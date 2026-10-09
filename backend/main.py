# backend/main.py
import io
import uuid
import json
import sqlite3
from typing import List, Optional, Tuple
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from PIL import Image

# Initialize FastAPI application
app = FastAPI(
    title="KrishiMind Crop Analysis API",
    description="Transparent rule-based crop risk assessment using farmer-reported inputs.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allowed image MIME types and limits
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB limit
DATABASE_PATH = Path(__file__).resolve().parent / "krishimind_history.sqlite3"


def get_database_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    connection = get_database_connection()
    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS crop_assessments (
                assessment_id TEXT PRIMARY KEY,
                crop_name TEXT NOT NULL,
                growth_stage TEXT NOT NULL,
                selected_symptoms TEXT NOT NULL,
                field_observations TEXT NOT NULL,
                location TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                risk_category TEXT NOT NULL,
                assessment_factors TEXT NOT NULL,
                recommendations TEXT NOT NULL,
                assessed_at TEXT NOT NULL,
                model_status TEXT NOT NULL,
                complete_assessment TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS farmer_profile (
                profile_id INTEGER PRIMARY KEY CHECK (profile_id = 1),
                profile_data TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.commit()
    finally:
        connection.close()


@app.on_event("startup")
def startup_database() -> None:
    initialize_database()


def save_assessment(assessment: dict) -> None:
    received_inputs = assessment["receivedInputs"]
    result = assessment["assessment"]
    connection = get_database_connection()
    try:
        connection.execute(
            """
            INSERT INTO crop_assessments (
                assessment_id, crop_name, growth_stage, selected_symptoms,
                field_observations, location, risk_score, risk_category,
                assessment_factors, recommendations, assessed_at, model_status,
                complete_assessment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                assessment["id"],
                assessment["crop"],
                assessment["stage"],
                json.dumps(received_inputs["symptoms"]),
                json.dumps(received_inputs["fieldObservations"]),
                json.dumps(received_inputs["location"]),
                result["riskScore"],
                result["riskCategory"],
                json.dumps(result["factors"]),
                json.dumps(result["suggestedNextSteps"]),
                result["assessedAt"],
                result["modelStatus"],
                json.dumps(assessment),
            ),
        )
        connection.commit()
    finally:
        connection.close()


def get_history_summary(assessment: dict) -> dict:
    return {
        "id": assessment["id"],
        "date": assessment["date"],
        "crop": assessment["crop"],
        "variety": assessment.get("variety"),
        "location": assessment.get("location") or "",
        "stage": assessment["stage"],
        "riskScore": assessment["assessment"]["riskScore"],
        "riskCategory": assessment["assessment"]["riskCategory"],
        "riskLevel": assessment["assessment"]["riskCategory"],
        "status": "Completed",
        "symptoms": assessment["receivedInputs"]["symptoms"],
        "assessedAt": assessment["assessment"]["assessedAt"],
        "modelStatus": assessment["assessment"]["modelStatus"],
    }


class FarmerProfile(BaseModel):
    name: str
    mobile: str = ""
    preferredLanguage: str = "English"
    state: str = ""
    district: str = ""
    village: str = ""
    farmSize: str = ""
    soilType: str = ""
    irrigationType: str = ""
    mainCrops: List[str] = Field(default_factory=list)


@app.get("/api/profile")
def get_farmer_profile():
    try:
        connection = get_database_connection()
        try:
            row = connection.execute(
                "SELECT profile_data, updated_at FROM farmer_profile WHERE profile_id = 1"
            ).fetchone()
        finally:
            connection.close()
        if row is None:
            return {"data": None, "success": True, "persisted": False}
        profile_data = FarmerProfile.model_validate(json.loads(row["profile_data"])).model_dump()
        return {
            "data": profile_data,
            "success": True,
            "persisted": True,
            "updatedAt": row["updated_at"],
        }
    except (sqlite3.Error, json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The farmer profile could not be loaded.",
        ) from exc


@app.put("/api/profile")
def save_farmer_profile(profile: FarmerProfile):
    profile_data = profile.model_dump()
    updated_at = datetime.now(timezone.utc).isoformat()
    try:
        connection = get_database_connection()
        try:
            connection.execute(
                """
                INSERT INTO farmer_profile (profile_id, profile_data, updated_at)
                VALUES (1, ?, ?)
                ON CONFLICT(profile_id) DO UPDATE SET
                    profile_data = excluded.profile_data,
                    updated_at = excluded.updated_at
                """,
                (json.dumps(profile_data), updated_at),
            )
            connection.commit()
        finally:
            connection.close()
    except sqlite3.Error as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The farmer profile could not be saved.",
        ) from exc
    return {
        "data": profile_data,
        "success": True,
        "persisted": True,
        "updatedAt": updated_at,
    }


def assess_crop_inputs(
    symptoms: list[str],
    spread_speed: str,
    recent_rainfall: str,
    irrigation_condition: str,
    soil_condition: str,
    growth_stage: str,
    other_symptom_text: str,
    additional_observation: str,
) -> Tuple[int, str, str, List[dict], List[str], List[str]]:
    """Calculate an explainable risk indicator from farmer-reported inputs."""
    normalized_symptoms = {value.strip().lower().replace(" ", "_") for value in symptoms}
    score = 20
    factors = [{
        "title": "Baseline",
        "metric": "Starting indicator",
        "status": "Neutral",
        "badgeColor": "bg-stone-100 text-stone-700 border-stone-200",
        "description": "A neutral starting score before considering the reported field inputs.",
        "points": 20,
    }]
    concerns = []
    recommendations = [
        "Recheck the affected plants and compare symptoms across several areas of the field.",
        "Record changes and take a follow-up photo in consistent daylight if symptoms continue.",
        "Consult a local agricultural extension officer if crop condition worsens or remains unclear.",
    ]

    symptom_rules = [
        ({"brown_spots", "brownspots"}, "Brown spots", 15, "Inspect affected leaves for lesion shape and spread."),
        ({"yellow_leaves", "yellowing_leaves", "yellow_leaves"}, "Yellowing leaves", 8, "Check whether yellowing affects older or newer leaves and compare across plants."),
        ({"wilting"}, "Wilting", 14, "Check root-zone moisture and whether plants recover during cooler hours."),
        ({"pest_activity", "pestactivity"}, "Pest activity", 12, "Inspect leaf undersides and growing points for insects or feeding damage."),
        ({"slow_growth", "slowgrowth"}, "Slow growth", 8, "Compare growth with nearby healthy plants and review recent watering."),
        ({"other"}, "Other reported symptom", 5, "Describe the unusual sign to a local agricultural advisor if it persists."),
    ]
    for aliases, label, points, recommendation in symptom_rules:
        if normalized_symptoms.intersection(aliases):
            score += points
            concern = label
            if label == "Other reported symptom" and other_symptom_text.strip():
                concern = f"{label}: {other_symptom_text.strip()}"
            concerns.append(concern)
            recommendations.append(recommendation)
            factors.append({
                "title": label,
                "metric": f"+{points} points",
                "status": "Reported",
                "badgeColor": "bg-amber-50 text-amber-700 border-amber-200",
                "description": f"The farmer reported {concern.lower()}; this increases the rule-based risk indicator.",
                "points": points,
            })

    spread_rules = {
        "quickly": (10, "Rapid symptom spread", "Quick spread was reported; inspect whether new plants are becoming affected."),
        "moderately": (4, "Moderate symptom spread", "Moderate spread was reported; monitor the same plants over the next few days."),
        "slowly": (-3, "Slow symptom spread", "Slow spread was reported; continue routine monitoring."),
    }
    spread = spread_speed.strip().lower()
    if spread in spread_rules:
        points, title, recommendation = spread_rules[spread]
        score += points
        factors.append({
            "title": title,
            "metric": f"{points:+} points",
            "status": "Reported",
            "badgeColor": "bg-amber-50 text-amber-700 border-amber-200" if points > 0 else "bg-emerald-50 text-emerald-700 border-emerald-200",
            "description": f"Farmer-reported spread speed: {spread_speed}.",
            "points": points,
        })
        if points > 0:
            concerns.append(title)
        recommendations.append(recommendation)

    rainfall_rules = {
        "heavy": (10, "Heavy recent rainfall"),
        "moderate": (5, "Moderate recent rainfall"),
        "light": (2, "Light recent rainfall"),
    }
    rainfall = recent_rainfall.strip().lower()
    if rainfall in rainfall_rules:
        points, title = rainfall_rules[rainfall]
        score += points
        factors.append({
            "title": title,
            "metric": f"+{points} points",
            "status": "Reported",
            "badgeColor": "bg-blue-50 text-blue-700 border-blue-200",
            "description": "Recent water exposure can contribute to field moisture and crop stress.",
            "points": points,
        })
        if rainfall == "heavy":
            concerns.append(title)
            recommendations.append("Check field drainage and avoid unnecessary irrigation while soil remains saturated.")

    soil_rules = {
        "dry": (5, "Dry soil"),
        "wet": (5, "Wet soil"),
        "waterlogged": (10, "Waterlogged soil"),
    }
    soil = soil_condition.strip().lower()
    if soil in soil_rules:
        points, title = soil_rules[soil]
        score += points
        factors.append({
            "title": title,
            "metric": f"+{points} points",
            "status": "Reported",
            "badgeColor": "bg-amber-50 text-amber-700 border-amber-200",
            "description": f"The farmer described soil condition as {soil_condition.lower()}.",
            "points": points,
        })
        concerns.append(title)
        if soil in {"wet", "waterlogged"}:
            recommendations.append("Check drainage and soil moisture before making irrigation decisions.")

    irrigation = irrigation_condition.strip().lower()
    if irrigation == "excess":
        score += 6
        factors.append({
            "title": "Excess irrigation",
            "metric": "+6 points",
            "status": "Reported",
            "badgeColor": "bg-amber-50 text-amber-700 border-amber-200",
            "description": "Flood or excess watering was reported and may contribute to prolonged wet conditions.",
            "points": 6,
        })
        concerns.append("Excess irrigation")
        recommendations.append("Review irrigation timing and check whether water is draining from the field.")

    stage = growth_stage.strip().lower()
    if stage in {"flowering", "fruiting", "bulb formation", "bulb development", "grain filling", "boll development"}:
        score += 4
        factors.append({
            "title": f"{growth_stage} growth stage",
            "metric": "+4 points",
            "status": "Stage factor",
            "badgeColor": "bg-purple-50 text-purple-700 border-purple-200",
            "description": "The selected growth stage adds a small monitoring factor; it is not a disease diagnosis.",
            "points": 4,
        })

    if additional_observation.strip():
        concerns.append(f"Additional observation: {additional_observation.strip()}")
        factors.append({
            "title": "Additional farmer observation",
            "metric": "Reviewed",
            "status": "Reported",
            "badgeColor": "bg-stone-100 text-stone-700 border-stone-200",
            "description": additional_observation.strip(),
            "points": 0,
        })

    score = min(max(score, 0), 100)
    if score >= 65:
        risk_band, overall_health = "Moderate–High Risk", "Elevated Risk"
    elif score >= 35:
        risk_band, overall_health = "Moderate Risk", "Moderate Condition"
    else:
        risk_band, overall_health = "Low Risk", "Good Condition"

    if not concerns:
        concerns.append("No specific symptoms or field concerns were reported.")

    return score, risk_band, overall_health, factors, concerns, recommendations


def get_sample_weather(location: str) -> dict:
    """Return clearly identified sample weather until a provider is configured."""
    now = datetime.now(timezone.utc)
    forecast = []
    conditions = [
        ("Partly Cloudy", 28, 21, 65, 12, 78),
        ("Light Rain", 29, 22, 60, 8, 75),
        ("Moderate Rain", 27, 20, 70, 18, 82),
        ("Partly Cloudy", 30, 22, 35, 2, 68),
        ("Sunny / Clear", 31, 23, 20, 0, 62),
    ]

    for offset, (condition, temp, min_temp, rain_probability, rain_mm, humidity) in enumerate(conditions):
        forecast_date = now.date().fromordinal(now.date().toordinal() + offset)
        forecast.append({
            "day": "Today" if offset == 0 else forecast_date.strftime("%a"),
            "date": forecast_date.strftime("%d %b"),
            "temp": temp,
            "minTemp": min_temp,
            "humidity": humidity,
            "rainProb": rain_probability,
            "rainMm": rain_mm,
            "condition": condition,
        })

    temperature = 28
    humidity = 78
    rain_probability = 65
    rainfall_mm = 12
    humidity_level = "High" if humidity >= 75 else "Moderate" if humidity >= 60 else "Low"
    rainfall_level = "High" if rain_probability >= 70 else "Moderate" if rain_probability >= 40 else "Low"
    temperature_level = "High" if temperature >= 35 else "Low"
    overall_risk = "High" if humidity_level == "High" and rainfall_level == "High" else (
        "Moderate" if humidity_level != "Low" or rainfall_level != "Low" else "Low"
    )

    return {
        "location": location,
        "temperature": temperature,
        "condition": "Partly Cloudy with Humidity",
        "humidity": humidity,
        "rainfall_mm": rainfall_mm,
        "rain_probability": rain_probability,
        "wind": {"speed_kmh": 14},
        "forecast": forecast,
        "agricultural_weather_risk": {
            "overall": overall_risk,
            "rainfall": {
                "level": rainfall_level,
                "explanation": f"{rain_probability}% rain probability and sample rainfall of {rainfall_mm} mm may prolong canopy moisture and wash off foliar treatments.",
            },
            "humidity": {
                "level": humidity_level,
                "explanation": f"{humidity}% relative humidity can favor fungal disease development in susceptible crops.",
            },
            "temperature": {
                "level": temperature_level,
                "explanation": "Sample daytime temperature is within a generally suitable range for many crops.",
            },
        },
        "risk_explanation": "Sample conditions indicate that high humidity and possible rainfall may increase crop-health risk. Check local field conditions, maintain drainage, and avoid late-evening irrigation.",
        "data_source": "sample_fallback",
        "is_sample": True,
        "timestamp": now.isoformat(),
    }


@app.get("/api/weather")
def get_weather(
    location: Optional[str] = Query(None, min_length=1, max_length=100),
    city: Optional[str] = Query(None, min_length=1, max_length=100),
):
    """Return weather for a location, using labeled sample data when no provider is configured."""
    requested_location = next((value.strip() for value in (location, city) if value and value.strip()), "Pune")
    if not requested_location:
        raise HTTPException(status_code=400, detail="A non-empty location or city is required.")
    return get_sample_weather(requested_location)


@app.get("/api/market")
def get_market(
    crop: str = Query("Tomato", min_length=1, max_length=100),
    location: Optional[str] = Query(None, min_length=1, max_length=100),
    city: Optional[str] = Query(None, min_length=1, max_length=100),
):
    """Return explicitly labeled sample mandi figures until a live provider is connected."""
    requested_crop = crop.strip()
    requested_location = next((value.strip() for value in (location, city) if value and value.strip()), "Pune")
    if not requested_crop:
        raise HTTPException(status_code=400, detail="A non-empty crop is required.")
    if not requested_location:
        raise HTTPException(status_code=400, detail="A non-empty location or city is required.")

    sample_prices = {
        "tomato": {"current_price": 2850, "min_price": 2400, "max_price": 3200, "arrivals": 1450},
        "onion": {"current_price": 2300, "min_price": 1800, "max_price": 2800, "arrivals": 920},
        "potato": {"current_price": 1800, "min_price": 1400, "max_price": 2200, "arrivals": 1100},
        "wheat": {"current_price": 2600, "min_price": 2400, "max_price": 2800, "arrivals": 550},
        "cotton": {"current_price": 7200, "min_price": 6800, "max_price": 7600, "arrivals": 420},
    }
    prices = sample_prices.get(
        requested_crop.lower(),
        {"current_price": 2000, "min_price": 1800, "max_price": 2200, "arrivals": 0},
    )
    return {
        "crop": requested_crop,
        "location": requested_location,
        **prices,
        "market": f"{requested_location} Sample Mandi",
        "mandi_name": f"{requested_location} Sample Mandi",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "KrishiMind illustrative sample/fallback data; no live mandi API is connected.",
        "is_sample_data": True,
    }


@app.get("/api/health")
def health_check():
    """Healthcheck endpoint for monitoring server status."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "KrishiMind Crop Analysis Engine"
    }


@app.post("/api/crop/analyze", status_code=status.HTTP_200_OK)
async def analyze_crop(
    crop: str = Form(..., description="Crop name (e.g. Tomato, Wheat, Onion)"),
    growth_stage: str = Form(..., alias="growthStage", description="Current growth stage"),
    symptoms: Optional[str] = Form(None, description="Reported symptoms as a JSON array"),
    field_observations: Optional[str] = Form(None, alias="fieldObservations", description="Farmer-reported field conditions as a JSON object"),
    location_input: Optional[str] = Form(None, alias="location", description="Field location as a JSON object"),
    farmer_name: Optional[str] = Form(None, alias="farmerName"),
    crop_variety: Optional[str] = Form(None, alias="cropVariety", description="Variety or hybrid name"),
    farm_size: Optional[str] = Form(None, alias="farmSize"),
    image_file: Optional[UploadFile] = File(None, alias="imageFile", description="Optional crop foliage or plant photo"),
):
    """
    Assess crop-health risk from farmer-reported inputs.
    An optional photo is validated and stored, but is not analyzed by an AI model.
    """
    crop = crop.strip()
    growth_stage = growth_stage.strip()
    if not crop or not growth_stage:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Crop name and growth stage are required.",
        )

    parsed_symptoms: List[str] = []
    if symptoms:
        try:
            parsed = json.loads(symptoms)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Symptoms must be sent as a JSON array.",
            ) from exc
        if not isinstance(parsed, list):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Symptoms must be sent as a JSON array.",
            )
        parsed_symptoms = [str(value).strip() for value in parsed if str(value).strip()]

    try:
        parsed_observations = json.loads(field_observations) if field_observations else {}
        parsed_location = json.loads(location_input) if location_input else {}
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Field observations and location must be valid JSON objects.",
        ) from exc
    if not isinstance(parsed_observations, dict) or not isinstance(parsed_location, dict):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Field observations and location must be JSON objects.",
        )

    spread_speed = str(parsed_observations.get("spreadSpeed") or "Not sure")
    irrigation_condition = str(parsed_observations.get("irrigationCondition") or "")
    soil_condition = str(parsed_observations.get("soilCondition") or "")
    recent_rainfall = str(parsed_observations.get("recentRainfall") or "")
    other_symptom_text = str(parsed_observations.get("otherSymptomText") or "")
    additional_observation = str(parsed_observations.get("additionalObservation") or "")
    village = str(parsed_location.get("village") or "")
    district = str(parsed_location.get("district") or "")
    state = str(parsed_location.get("state") or "")

    image_present = False
    if image_file and image_file.filename:
        content_type = (image_file.content_type or "").lower()
        if content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Please upload a JPG, PNG, or WEBP image.",
            )

        image_bytes = await image_file.read(MAX_FILE_SIZE_BYTES + 1)
        if not image_bytes:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded image is empty.")
        if len(image_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Image size exceeds the maximum limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB.",
            )

        try:
            with Image.open(io.BytesIO(image_bytes)) as pil_image:
                pil_image.verify()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is not a valid or readable image.",
            ) from exc

        image_present = True

    score, risk_band, overall_health, factors, concerns, recommendations = assess_crop_inputs(
        symptoms=parsed_symptoms,
        spread_speed=spread_speed,
        recent_rainfall=recent_rainfall or "",
        irrigation_condition=irrigation_condition or "",
        soil_condition=soil_condition or "",
        growth_stage=growth_stage or "",
        other_symptom_text=other_symptom_text or "",
        additional_observation=additional_observation or "",
    )
    analyzed_at = datetime.now(timezone.utc)
    location_parts = [part.strip() for part in (village, district, state) if part.strip()]
    location = ", ".join(location_parts)
    risk_factors = [
        {
            **factor,
            "status": factor["status"],
        }
        for factor in factors
    ]
    checklist = [
        {"id": f"recommendation-{index}", "text": recommendation, "checked": False}
        for index, recommendation in enumerate(recommendations, start=1)
    ]

    assessment = {
        "riskScore": score,
        "riskCategory": risk_band,
        "factors": factors,
        "observationsToReview": concerns,
        "suggestedNextSteps": recommendations,
        "assessedAt": analyzed_at.isoformat(),
        "assessmentMethod": "RULE_BASED",
        "dataStatus": "FARMER_REPORTED_INPUTS_ONLY",
        "modelStatus": "NOT_USED",
        "imageDetectionStatus": "NOT_CONNECTED",
    }

    assessment_result = {
        "id": f"KM-{uuid.uuid4().hex.upper()}",
        "crop": crop,
        "farmerName": farmer_name,
        "variety": crop_variety,
        "stage": growth_stage,
        "date": analyzed_at.strftime("%d %b %Y"),
        "location": location or None,
        "farmSize": farm_size,
        "riskScore": score,
        "riskBand": risk_band,
        "overallHealth": overall_health,
        "concerns": concerns,
        "factors": factors,
        "riskFactors": risk_factors,
        "recommendations": recommendations,
        "whatToCheckNext": checklist,
        "whatMayBeHappening": (
            "The reported field observations contribute to this rule-based crop-health risk indicator. "
            "It does not identify a specific disease."
        ),
        "assessmentSummary": "Risk indicator calculated from farmer-reported crop and field inputs.",
        "imageAnalysisStatus": "NOT_CONNECTED",
        "imagePresent": image_present,
        "analyzedAt": analyzed_at.isoformat(),
        "assessment": assessment,
        "assessmentMethod": "RULE_BASED",
        "dataStatus": "FARMER_REPORTED_INPUTS_ONLY",
        "modelStatus": "NOT_USED",
        "observationsToReview": concerns,
        "suggestedNextSteps": recommendations,
        "visualObservations": {
            "detectedSymptoms": [],
            "spreadRate": f"{spread_speed} spread reported by farmer",
        },
        "disclaimer": (
            "This transparent rule-based risk indicator uses farmer-reported inputs. "
            "The uploaded image was not analyzed by AI and the result is not a guaranteed diagnosis."
        ),
        "receivedInputs": {
            "farmerName": farmer_name,
            "crop": crop,
            "cropVariety": crop_variety,
            "growthStage": growth_stage,
            "symptoms": parsed_symptoms,
            "fieldObservations": parsed_observations,
            "location": parsed_location,
            "farmSize": farm_size,
        }
    }
    try:
        save_assessment(assessment_result)
    except sqlite3.Error as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The assessment was calculated but could not be saved to history.",
        ) from exc
    return assessment_result


@app.get("/api/history")
def list_assessments():
    try:
        connection = get_database_connection()
        try:
            rows = connection.execute(
                "SELECT complete_assessment FROM crop_assessments ORDER BY assessed_at DESC, assessment_id DESC"
            ).fetchall()
        finally:
            connection.close()
        assessments = [json.loads(row["complete_assessment"]) for row in rows]
    except (sqlite3.Error, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Crop assessment history could not be loaded.",
        ) from exc
    return {"data": [get_history_summary(item) for item in assessments], "success": True}


@app.get("/api/history/{assessment_id}")
def get_assessment(assessment_id: str):
    try:
        connection = get_database_connection()
        try:
            row = connection.execute(
                "SELECT complete_assessment FROM crop_assessments WHERE assessment_id = ?",
                (assessment_id,),
            ).fetchone()
        finally:
            connection.close()
    except sqlite3.Error as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The requested crop assessment could not be loaded.",
        ) from exc
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved crop assessment exists with that ID.",
        )
    try:
        assessment = json.loads(row["complete_assessment"])
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The saved crop assessment record is invalid.",
        ) from exc
    return {"data": assessment, "success": True}


@app.delete("/api/history/{assessment_id}")
def delete_assessment(assessment_id: str):
    try:
        connection = get_database_connection()
        try:
            cursor = connection.execute(
                "DELETE FROM crop_assessments WHERE assessment_id = ?",
                (assessment_id,),
            )
            connection.commit()
        finally:
            connection.close()
    except sqlite3.Error as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The crop assessment could not be deleted.",
        ) from exc
    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved crop assessment exists with that ID.",
        )
    return {"data": {"id": assessment_id, "deleted": True}, "success": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
