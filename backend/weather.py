import httpx
from typing import Dict, Any, Tuple
from datetime import datetime
from cache import WeatherCache


class WeatherService:
    def __init__(self):
        """Initialize weather service with cache."""
        self.cache = WeatherCache()
        self.geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"

    async def get_coordinates(self, city: str) -> Tuple[float, float]:
        """
        Get latitude and longitude for a city.

        Args:
            city: City name

        Returns:
            Tuple of (latitude, longitude)

        Raises:
            ValueError: If city not found
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.geocoding_url,
                params={"name": city, "count": 1, "language": "en", "format": "json"}
            )
            response.raise_for_status()
            data = response.json()

            if not data.get("results"):
                raise ValueError(f"City '{city}' not found")

            result = data["results"][0]
            return result["latitude"], result["longitude"]

    async def get_weather(self, city: str) -> Dict[str, Any]:
        """
        Get weather forecast for a city with caching.

        Args:
            city: City name

        Returns:
            Weather data including hourly temperature, precipitation, and conditions
        """
        # Check cache first
        cached_data = self.cache.get(city)
        if cached_data:
            return cached_data

        # Fetch fresh data
        lat, lon = await self.get_coordinates(city)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.weather_url,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "hourly": "temperature_2m,precipitation,weather_code,wind_speed_10m",
                    "timezone": "auto",
                    "forecast_days": 1
                }
            )
            response.raise_for_status()
            data = response.json()

        # Store in cache
        self.cache.set(city, data)

        return data

    def get_hourly_weather(self, weather_data: Dict[str, Any], hour: int) -> Dict[str, Any]:
        """
        Extract weather data for a specific hour.

        Args:
            weather_data: Full weather response from API
            hour: Hour of day (0-23)

        Returns:
            Dictionary with temperature, precipitation, weather code, and wind speed
        """
        hourly = weather_data.get("hourly", {})
        times = hourly.get("time", [])

        # Find the index for the requested hour
        target_hour_str = f"{datetime.now().strftime('%Y-%m-%d')}T{hour:02d}:00"

        try:
            index = times.index(target_hour_str)
        except ValueError:
            # If exact hour not found, use the closest one
            index = hour if hour < len(times) else 0

        return {
            "temperature": hourly.get("temperature_2m", [])[index],
            "precipitation": hourly.get("precipitation", [])[index],
            "weather_code": hourly.get("weather_code", [])[index],
            "wind_speed": hourly.get("wind_speed_10m", [])[index],
            "time": times[index] if index < len(times) else None
        }

    @staticmethod
    def interpret_weather_code(code: int) -> str:
        """
        Convert weather code to human-readable description.

        Args:
            code: WMO Weather interpretation code

        Returns:
            Human-readable weather description
        """
        weather_codes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        }
        return weather_codes.get(code, "Unknown")
