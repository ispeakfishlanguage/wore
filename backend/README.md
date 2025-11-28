# Weather Clothing Recommender - Backend

FastAPI backend service for the Weather Clothing Recommender app.

## Features

- RESTful API with FastAPI
- Weather data fetching from Open-Meteo API
- SQLite caching for improved performance
- GitHub Models integration for AI recommendations
- Async/await for efficient handling
- CORS enabled for frontend integration
- Comprehensive error handling

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- GitHub Personal Access Token

### Setup

1. Create and activate virtual environment:
```bash
python -m venv venv

# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your GitHub token:
```env
GITHUB_TOKEN=your_github_personal_access_token
PORT=8000
```

### Getting a GitHub Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token (classic)
3. No specific scopes are required for GitHub Models
4. Copy the token and add it to your `.env` file

## Running the Server

### Development
```bash
python main.py
```

The server will start on `http://localhost:8000`

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py           # FastAPI application and endpoints
├── weather.py        # Weather service and Open-Meteo integration
├── cache.py          # SQLite caching implementation
├── llm.py            # GitHub Models / LLM integration
├── requirements.txt  # Python dependencies
├── .env.example      # Environment variables template
└── README.md         # This file
```

## Module Details

### main.py
- FastAPI application setup
- CORS configuration
- `/recommend` endpoint implementation
- Request/response models with Pydantic
- Error handling

### weather.py
- `WeatherService` class for weather operations
- City geocoding (converting city names to coordinates)
- Weather data fetching from Open-Meteo
- Cache integration
- Weather code interpretation (WMO codes to descriptions)

### cache.py
- `WeatherCache` class for SQLite operations
- Automatic table creation
- Cache expiration (60 minutes default)
- Old entry cleanup (7 days)

### llm.py
- `LLMService` class for GitHub Models integration
- Prompt construction
- Temperature and sensitivity-based recommendations
- OpenAI SDK integration for GitHub Models

## API Endpoints

### POST /recommend

Get clothing recommendation based on weather conditions.

**Request:**
```json
{
  "home_city": "San Francisco",
  "work_city": "Oakland",
  "departure_time": 9,
  "return_time": 17,
  "cold_sensitivity": "medium"
}
```

**Response:**
```json
{
  "recommendation": "For the morning commute with temperatures around 14°C and partly cloudy conditions...",
  "home_weather": {
    "temperature": 14.2,
    "precipitation": 0.0,
    "weather_code": 2,
    "wind_speed": 12.5,
    "time": "2025-11-27T09:00",
    "city": "San Francisco",
    "condition": "Partly cloudy"
  },
  "work_weather": {
    "temperature": 11.8,
    "precipitation": 0.0,
    "weather_code": 1,
    "wind_speed": 15.2,
    "time": "2025-11-27T17:00",
    "city": "Oakland",
    "condition": "Mainly clear"
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| GITHUB_TOKEN | Yes | - | GitHub Personal Access Token for Models API |
| PORT | No | 8000 | Port to run the server on |

### Cache Settings

Cache settings can be modified in `cache.py`:

- `max_age_minutes`: Cache expiration time (default: 60 minutes)
- `max_age_days`: Old entry cleanup threshold (default: 7 days)

## Deployment

### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Environment Variables**:
     - `GITHUB_TOKEN`: Your GitHub token

### Heroku

1. Create `Procfile` in backend directory:
```
web: python main.py
```

2. Deploy:
```bash
heroku create your-app-name
heroku config:set GITHUB_TOKEN=your_token
git push heroku main
```

### Docker

Create `Dockerfile` in backend directory:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
```

Build and run:
```bash
docker build -t weather-recommender-backend .
docker run -p 8000:8000 -e GITHUB_TOKEN=your_token weather-recommender-backend
```

## Database

The application uses SQLite for caching. The database file (`weather_cache.db`) is automatically created on first run.

### Schema

```sql
CREATE TABLE weather_cache (
    city TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    timestamp REAL NOT NULL
);
```

### Cache Behavior

- Weather data is cached per city
- Cache expires after 60 minutes
- Entries older than 7 days are automatically cleaned up
- Cache key is case-insensitive city name

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (invalid city name, invalid parameters)
- `500`: Internal server error (API failures, LLM errors)

Error response format:
```json
{
  "detail": "Error message here"
}
```

## Development Tips

### Testing the API

Using curl:
```bash
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "home_city": "London",
    "work_city": "Cambridge",
    "departure_time": 8,
    "return_time": 18,
    "cold_sensitivity": "high"
  }'
```

Using Python requests:
```python
import requests

response = requests.post('http://localhost:8000/recommend', json={
    'home_city': 'London',
    'work_city': 'Cambridge',
    'departure_time': 8,
    'return_time': 18,
    'cold_sensitivity': 'high'
})

print(response.json())
```

### Debugging

Enable FastAPI debug mode in `main.py`:
```python
app = FastAPI(debug=True)
```

Add logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Performance Considerations

- Weather data is cached for 60 minutes to reduce API calls
- SQLite is suitable for small to medium traffic
- For high traffic, consider:
  - Switching to PostgreSQL
  - Adding Redis for caching
  - Implementing rate limiting
  - Adding request queuing

## Security

- Never commit `.env` file
- Rotate GitHub tokens regularly
- Use environment variables for sensitive data
- Implement rate limiting in production
- Keep dependencies updated

## Troubleshooting

### Common Issues

**"GITHUB_TOKEN environment variable is required"**
- Solution: Create `.env` file with your GitHub token

**"City 'XYZ' not found"**
- Solution: Use correct city spelling, try larger nearby cities

**"Connection error" when fetching weather**
- Solution: Check internet connection, verify Open-Meteo API is accessible

**SQLite locked errors**
- Solution: Ensure only one process is accessing the database

## Dependencies

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `httpx`: Async HTTP client
- `python-dotenv`: Environment variable management
- `pydantic`: Data validation
- `openai`: GitHub Models client (OpenAI SDK)

## License

MIT
