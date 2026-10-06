# backend/main.py
import io
import uuid
import json
from typing import List, Optional, Tuple
from datetime import datetime, timezone

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# Initialize FastAPI application
app = FastAPI(
    title="KrishiMind Crop Analysis API",
    description="Backend foundation for real crop health assessment and computer vision models.",
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
    farmer_name: Optional[str] = Form(None, alias="farmerName"),
    crop_variety: Optional[str] = Form(None, alias="cropVariety", description="Variety or hybrid name"),
    growth_stage: Optional[str] = Form(None, alias="growthStage", description="Current growth stage"),
    symptoms: Optional[str] = Form(None, description="Reported symptoms as a JSON array"),
    spread_speed: str = Form("Not sure", alias="spreadSpeed"),
    irrigation_condition: Optional[str] = Form(None, alias="irrigationCondition", description="Irrigation condition"),
    soil_condition: Optional[str] = Form(None, alias="soilCondition", description="Soil moisture/condition"),
    recent_rainfall: Optional[str] = Form(None, alias="recentRainfall", description="Recent rainfall / water exposure"),
    other_symptom_text: Optional[str] = Form(None, alias="otherSymptomText"),
    additional_observation: Optional[str] = Form(None, alias="additionalObservation"),
    village: Optional[str] = Form(None),
    district: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    farm_size: Optional[str] = Form(None, alias="farmSize"),
    image_file: Optional[UploadFile] = File(None, alias="imageFile", description="Optional crop foliage or plant photo"),
):
    """
    Assess crop-health risk from farmer-reported inputs.
    An optional photo is validated and stored, but is not analyzed by an AI model.
    """
    parsed_symptoms: List[str] = []
    if symptoms:
        try:
            parsed = json.loads(symptoms)
            if isinstance(parsed, list):
                parsed_symptoms = [str(s) for s in parsed]
            else:
                parsed_symptoms = [str(parsed)]
        except json.JSONDecodeError:
            parsed_symptoms = [s.strip() for s in symptoms.split(",") if s.strip()]

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
    location_parts = [part for part in (village, district, state) if part]
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

    return {
        "id": f"KM-{uuid.uuid4().hex[:8].upper()}",
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
            "spreadSpeed": spread_speed,
            "otherSymptomText": other_symptom_text,
            "irrigationCondition": irrigation_condition,
            "soilCondition": soil_condition,
            "recentRainfall": recent_rainfall,
            "additionalObservation": additional_observation,
            "village": village,
            "district": district,
            "state": state,
            "farmSize": farm_size,
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
