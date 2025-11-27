import sqlite3
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any


class WeatherCache:
    def __init__(self, db_path: str = "weather_cache.db"):
        """Initialize the SQLite cache for weather data."""
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Create the cache table if it doesn't exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS weather_cache (
                    city TEXT PRIMARY KEY,
                    data TEXT NOT NULL,
                    timestamp REAL NOT NULL
                )
            """)
            conn.commit()

    def get(self, city: str, max_age_minutes: int = 60) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached weather data for a city if it's fresh enough.

        Args:
            city: City name
            max_age_minutes: Maximum age of cache in minutes (default 60)

        Returns:
            Cached weather data or None if not found/expired
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT data, timestamp FROM weather_cache WHERE city = ?",
                (city.lower(),)
            )
            row = cursor.fetchone()

            if row:
                data_json, timestamp = row
                cache_time = datetime.fromtimestamp(timestamp)
                age = datetime.now() - cache_time

                if age < timedelta(minutes=max_age_minutes):
                    return json.loads(data_json)

        return None

    def set(self, city: str, data: Dict[str, Any]):
        """
        Store weather data in cache.

        Args:
            city: City name
            data: Weather data to cache
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO weather_cache (city, data, timestamp)
                VALUES (?, ?, ?)
                """,
                (city.lower(), json.dumps(data), datetime.now().timestamp())
            )
            conn.commit()

    def clear_old_entries(self, max_age_days: int = 7):
        """
        Remove cache entries older than specified days.

        Args:
            max_age_days: Maximum age in days before deletion
        """
        cutoff = datetime.now() - timedelta(days=max_age_days)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "DELETE FROM weather_cache WHERE timestamp < ?",
                (cutoff.timestamp(),)
            )
            conn.commit()
