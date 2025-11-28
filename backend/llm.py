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
        departure_time: float,
        return_time: float,
        commute_duration: int,
        cold_sensitivity: str,
        has_important_meeting: bool = False,
        meeting_type: str = None
    ) -> str:
        """
        Generate clothing recommendation using GitHub Models.

        Args:
            home_weather: Weather data for home location
            work_weather: Weather data for work location
            departure_time: Time of departure in decimal hours (0-24)
            return_time: Time of return in decimal hours (0-24)
            commute_duration: Commute duration in minutes
            cold_sensitivity: User's cold sensitivity (low/medium/high)
            has_important_meeting: Whether there's an important meeting
            meeting_type: Type of important meeting (if applicable)

        Returns:
            LLM-generated clothing recommendation
        """
        prompt = self._build_prompt(
            home_weather,
            work_weather,
            departure_time,
            return_time,
            commute_duration,
            cold_sensitivity,
            has_important_meeting,
            meeting_type
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
        departure_time: float,
        return_time: float,
        commute_duration: int,
        cold_sensitivity: str,
        has_important_meeting: bool = False,
        meeting_type: str = None
    ) -> str:
        """
        Build the prompt for the LLM.

        Args:
            home_weather: Weather data for home location
            work_weather: Weather data for work location
            departure_time: Time of departure in decimal hours
            return_time: Time of return in decimal hours
            commute_duration: Commute duration in minutes
            cold_sensitivity: User's cold sensitivity level
            has_important_meeting: Whether there's an important meeting
            meeting_type: Type of important meeting (if applicable)

        Returns:
            Formatted prompt string
        """
        from weather import WeatherService

        # Extract relevant weather info
        home_condition = WeatherService.interpret_weather_code(home_weather["weather_code"])
        work_condition = WeatherService.interpret_weather_code(work_weather["weather_code"])

        # Format decimal hours to HH:MM
        def format_time(decimal_hours: float) -> str:
            hours = int(decimal_hours)
            minutes = int((decimal_hours - hours) * 60)
            return f"{hours:02d}:{minutes:02d}"

        departure_str = format_time(departure_time)
        return_str = format_time(return_time)

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

        # Format meeting type for display
        meeting_types = {
            "client_meeting": "Client Meeting",
            "presentation": "Presentation",
            "interview": "Job Interview",
            "board_meeting": "Board Meeting",
            "networking": "Networking Event",
            "casual_team": "Casual Team Meeting"
        }
        meeting_display = meeting_types.get(meeting_type, meeting_type) if meeting_type else None

        # Build user profile section
        user_profile = f"- Cold Sensitivity: {cold_sensitivity}"
        if has_important_meeting and meeting_display:
            user_profile += f"\n- Important Event Today: {meeting_display} - dress appropriately for a professional setting"

        prompt = f"""Based on the following weather conditions, provide a detailed clothing recommendation:

MORNING (Departure at {departure_str}):
- Location: Home
- Temperature: {home_weather['temperature']}°C
- Conditions: {home_condition}
- Precipitation: {home_weather['precipitation']} mm
- Wind Speed: {home_weather['wind_speed']} km/h

EVENING (Return at {return_str}):
- Location: Work
- Temperature: {work_weather['temperature']}°C
- Conditions: {work_condition}
- Precipitation: {work_weather['precipitation']} mm
- Wind Speed: {work_weather['wind_speed']} km/h

COMMUTE:
- Duration: {commute_str}
- You'll be exposed to outdoor conditions during your commute

USER PROFILE:
{user_profile}

Please provide your recommendation in this EXACT format:

Based on the forecast between {departure_str} and {return_str}, here's what you should wear:

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
