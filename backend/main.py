from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import os
from dotenv import load_dotenv

from weather import WeatherService
from llm import LLMService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Weather Clothing Recommender API",
    description="API for getting clothing recommendations based on weather conditions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
weather_service = WeatherService()
llm_service = LLMService()


class RecommendationRequest(BaseModel):
    """Request model for clothing recommendation."""
    home_city: str = Field(..., description="Home city name")
    work_city: str = Field(..., description="Work city name")
    departure_time: float = Field(..., ge=0, le=24, description="Departure time in decimal hours (0-24)")
    return_time: float = Field(..., ge=0, le=24, description="Return time in decimal hours (0-24)")
    commute_duration: int = Field(..., ge=1, le=300, description="Commute duration in minutes")
    cold_sensitivity: str = Field(..., pattern="^(low|medium|high)$", description="Cold sensitivity level")
    has_important_meeting: bool = Field(default=False, description="Whether there's an important meeting today")
    meeting_type: Optional[str] = Field(default=None, description="Type of important meeting")

    class Config:
        schema_extra = {
            "example": {
                "home_city": "New York",
                "work_city": "Jersey City",
                "departure_time": 8.5,
                "return_time": 18.0,
                "commute_duration": 30,
                "cold_sensitivity": "medium",
                "has_important_meeting": True,
                "meeting_type": "client_meeting"
            }
        }


class RecommendationResponse(BaseModel):
    """Response model for clothing recommendation."""
    recommendation: str
    home_weather: dict
    work_weather: dict


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Weather Clothing Recommender API",
        "version": "1.0.0",
        "endpoints": {
            "/recommend": "POST - Get clothing recommendation",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest):
    """
    Get clothing recommendation based on weather conditions.

    Args:
        request: Recommendation request with cities, times, and cold sensitivity

    Returns:
        Clothing recommendation with weather data

    Raises:
        HTTPException: If there's an error fetching weather or generating recommendation
    """
    try:
        # Fetch weather data for both cities
        home_weather_data = await weather_service.get_weather(request.home_city)
        work_weather_data = await weather_service.get_weather(request.work_city)

        # Extract hourly weather for departure and return times
        # Convert decimal hours to integers for weather lookup
        departure_hour = int(request.departure_time)
        return_hour = int(request.return_time)

        home_weather = weather_service.get_hourly_weather(
            home_weather_data,
            departure_hour
        )
        work_weather = weather_service.get_hourly_weather(
            work_weather_data,
            return_hour
        )

        # Generate recommendation using LLM
        recommendation = await llm_service.generate_recommendation(
            home_weather=home_weather,
            work_weather=work_weather,
            departure_time=request.departure_time,
            return_time=request.return_time,
            commute_duration=request.commute_duration,
            cold_sensitivity=request.cold_sensitivity,
            has_important_meeting=request.has_important_meeting,
            meeting_type=request.meeting_type
        )

        return RecommendationResponse(
            recommendation=recommendation,
            home_weather={
                **home_weather,
                "city": request.home_city,
                "condition": weather_service.interpret_weather_code(home_weather["weather_code"])
            },
            work_weather={
                **work_weather,
                "city": request.work_city,
                "condition": weather_service.interpret_weather_code(work_weather["weather_code"])
            }
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
