import os
import httpx
from typing import Dict, Any


class LLMService:
    def __init__(self):
        """Initialize GitHub Models client."""
        self.token = os.getenv("GITHUB_TOKEN")
        if not self.token:
            raise ValueError("GITHUB_TOKEN environment variable is required")

        self.endpoint = "https://models.inference.ai.azure.com/chat/completions"
        self.model = "gpt-4o-mini"  # Using GPT-4o-mini for cost efficiency

    async def generate_recommendation(
        self,
        home_weather: Dict[str, Any],
        work_weather: Dict[str, Any],
        departure_time: int,
        return_time: int,
        commute_duration: int,
        cold_sensitivity: str
    ) -> str:
        """
        Generate clothing recommendation using GitHub Models.

        Args:
            home_weather: Weather data for home location
            work_weather: Weather data for work location
            departure_time: Hour of departure (0-23)
            return_time: Hour of return (0-23)
            commute_duration: Commute duration in minutes
            cold_sensitivity: User's cold sensitivity (low/medium/high)

        Returns:
            LLM-generated clothing recommendation
        """
        prompt = self._build_prompt(
            home_weather,
            work_weather,
            departure_time,
            return_time,
            commute_duration,
            cold_sensitivity
        )

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides practical clothing recommendations based on weather conditions. Be concise, friendly, and specific."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": self.model,
            "temperature": 0.7,
            "max_tokens": 500
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.endpoint,
                headers=headers,
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()

        return data["choices"][0]["message"]["content"]

    def _build_prompt(
        self,
        home_weather: Dict[str, Any],
        work_weather: Dict[str, Any],
        departure_time: int,
        return_time: int,
        commute_duration: int,
        cold_sensitivity: str
    ) -> str:
        """
        Build the prompt for the LLM.

        Args:
            home_weather: Weather data for home location
            work_weather: Weather data for work location
            departure_time: Hour of departure
            return_time: Hour of return
            commute_duration: Commute duration in minutes
            cold_sensitivity: User's cold sensitivity level

        Returns:
            Formatted prompt string
        """
        from weather import WeatherService

        # Extract relevant weather info
        home_condition = WeatherService.interpret_weather_code(home_weather["weather_code"])
        work_condition = WeatherService.interpret_weather_code(work_weather["weather_code"])

        # Format commute duration
        if commute_duration >= 60:
            hours = commute_duration // 60
            mins = commute_duration % 60
            if mins > 0:
                commute_str = f"{hours}h {mins}min"
            else:
                commute_str = f"{hours} hour" if hours == 1 else f"{hours} hours"
        else:
            commute_str = f"{commute_duration} minutes"

        prompt = f"""Based on the following weather conditions, provide a detailed clothing recommendation:

MORNING (Departure at {departure_time:02d}:00):
- Location: Home
- Temperature: {home_weather['temperature']}°C
- Conditions: {home_condition}
- Precipitation: {home_weather['precipitation']} mm
- Wind Speed: {home_weather['wind_speed']} km/h

EVENING (Return at {return_time:02d}:00):
- Location: Work
- Temperature: {work_weather['temperature']}°C
- Conditions: {work_condition}
- Precipitation: {work_weather['precipitation']} mm
- Wind Speed: {work_weather['wind_speed']} km/h

COMMUTE:
- Duration: {commute_str}
- You'll be exposed to outdoor conditions during your commute

USER PROFILE:
- Cold Sensitivity: {cold_sensitivity}

Please provide your recommendation in this EXACT format:

Based on the forecast between {departure_time:02d}:00 and {return_time:02d}:00, here's what you should wear:

Base layer: [specific recommendation with brief reasoning]
Legwear: [specific recommendation with brief reasoning]
Top: [specific recommendation with brief reasoning]
Warm layer: [specific recommendation with brief reasoning]
Outerwear: [specific recommendation with brief reasoning]
Headwear: [specific recommendation or "Not needed" with reasoning]
Handwear: [specific recommendation or "Not needed" with reasoning]
Footwear: [specific recommendation with brief reasoning]
Umbrella: [Yes/No with reasoning]

Keep each line concise but specific. Reference temperatures and conditions where relevant."""

        return prompt
