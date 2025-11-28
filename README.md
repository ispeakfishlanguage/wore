# WORE - A weather-based outfit recommendation agent

A full-stack application that provides personalized clothing recommendations based on weather conditions for your daily commute. The app uses real-time weather data and AI-powered recommendations to help you decide what to wear.

## Features

- **Weather-based recommendations**: Get clothing suggestions based on actual weather forecasts
- **Dual location support**: Compare weather at your home and workplace
- **Flexible scheduling**: Manual time input supports any departure/return time (e.g., 07:45, 16:35)
- **Commute awareness**: Factor in commute duration from 10 minutes to 2 hours
- **Meeting context**: Adjust recommendations for important meetings (client meetings, presentations, interviews, etc.)
- **Personalized advice**: Customize recommendations based on your cold sensitivity
- **Detailed weather data**: Temperature, feels-like temperature, wind speed, wind gusts, UV index, cloudiness, and precipitation
- **AI-powered**: Uses GitHub Models (GPT-4o-mini) for intelligent, context-aware suggestions
- **Weather caching**: SQLite-based caching for improved performance
- **Editorial design**: Fashion-forward UI with warm terracotta color palette, custom typography (Playfair Display, Nunito Sans)

## Architecture

```
┌─────────────────┐
│  React Frontend │  (Vite + React)
│   Port: 3000    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  FastAPI Backend│  (Python)
│   Port: 8000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐  ┌────────┐  ┌──────────────┐
│SQLite│  │Open-  │  │GitHub Models │
│Cache│  │Meteo  │  │(GPT-4o-mini) │
└─────┘  └────────┘  └──────────────┘
```

## Tech Stack

### Frontend
- React 18
- Vite
- CSS3 (with CSS Variables)

### Backend
- FastAPI
- Python 3.8+
- SQLite (caching)
- HTTPX (async HTTP client)
- Direct HTTP calls to GitHub Models API

### External Services
- **Open-Meteo API**: Weather data
- **GitHub Models**: AI recommendations

## Project Structure

```
wore/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherForm.jsx
│   │   │   ├── WeatherForm.css
│   │   │   ├── Results.jsx
│   │   │   └── Results.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── main.py           # FastAPI app & endpoints
│   ├── weather.py        # Weather service & Open-Meteo integration
│   ├── cache.py          # SQLite caching logic
│   ├── llm.py            # GitHub Models integration
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- GitHub Personal Access Token (for GitHub Models)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from example:
```bash
cp .env.example .env
```

5. Add your GitHub token to `.env`:
```env
GITHUB_TOKEN=your_github_token_here
```

6. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL (for local development, use default):
```env
VITE_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Documentation

### Endpoints

#### `GET /`
Root endpoint with API information.

**Response:**
```json
{
  "message": "WORE - Weather-based Outfit Recommendation Engine API",
  "version": "1.0.0",
  "endpoints": {
    "/recommend": "POST - Get clothing recommendation",
    "/health": "GET - Health check"
  }
}
```

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

#### `POST /recommend`
Get clothing recommendation based on weather conditions.

**Request Body:**
```json
{
  "home_city": "Solna",
  "work_city": "Stockholm",
  "departure_time": 8.5,
  "return_time": 17.75,
  "commute_duration": 30,
  "cold_sensitivity": "medium",
  "has_important_meeting": true,
  "meeting_type": "client_meeting"
}
```

**Parameters:**
- `home_city` (string, required): Home city name
- `work_city` (string, required): Work city name
- `departure_time` (float, required, 0-24): Departure time in decimal hours (e.g., 8.5 for 08:30)
- `return_time` (float, required, 0-24): Return time in decimal hours (e.g., 17.75 for 17:45)
- `commute_duration` (integer, required, 1-300): Commute duration in minutes
- `cold_sensitivity` (string, required): "low", "medium", or "high"
- `has_important_meeting` (boolean, optional): Whether there's an important meeting today (default: false)
- `meeting_type` (string, optional): Type of meeting - "client_meeting", "presentation", "interview", "board_meeting", "networking", or "casual_team"

**Response:**
```json
{
  "recommendation": "Based on the forecast between 08:30 and 17:45, here's what you should wear:\n\nBase layer: Merino wool or thermal top for warmth\nLegwear: Dress trousers suitable for client meeting...",
  "home_weather": {
    "temperature": 4.5,
    "apparent_temperature": 1.2,
    "precipitation": 0.0,
    "weather_code": 2,
    "wind_speed": 15.3,
    "wind_gusts": 25.8,
    "uv_index": 0.15,
    "cloud_cover": 75,
    "time": "2025-11-28T08:00",
    "city": "Solna",
    "condition": "Partly cloudy"
  },
  "work_weather": {
    "temperature": 6.2,
    "apparent_temperature": 3.5,
    "precipitation": 0.5,
    "weather_code": 61,
    "wind_speed": 12.7,
    "wind_gusts": 22.3,
    "uv_index": 0.05,
    "cloud_cover": 100,
    "time": "2025-11-28T17:00",
    "city": "Stockholm",
    "condition": "Slight rain"
  }
}
```

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your Render API URL

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `backend` (IMPORTANT: Set this first!)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Python Version**: `3.11.9`
   - **Environment Variables**:
     - `GITHUB_TOKEN`: Your GitHub token

4. Deploy

**Alternative:** If you can't set Root Directory, use these commands:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python main.py`

## Environment Variables

### Backend (.env)
```env
GITHUB_TOKEN=your_github_token_here  # Required
PORT=8000                            # Optional, defaults to 8000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000  # Your FastAPI backend URL
```

## How It Works

1. **User Input**: User enters home city, work city, departure/return times (precise to the minute), commute duration, cold sensitivity, and optional meeting context
2. **Weather Fetching**: Backend fetches comprehensive weather data from Open-Meteo API (temperature, feels-like, wind, gusts, UV index, cloudiness, precipitation)
3. **Caching**: Weather data is cached in SQLite for 60 minutes to reduce API calls
4. **Context Building**: System combines weather data with user preferences and meeting context
5. **LLM Processing**: Weather data and context are formatted into a detailed prompt and sent to GitHub Models
6. **Recommendation**: GPT-4o-mini generates a personalized, context-aware clothing recommendation
7. **Display**: Frontend displays the recommendation with bold layer names, along with detailed weather summaries and contextual weather chips

## Features in Detail

### Weather Caching
- SQLite-based caching system
- 60-minute cache lifetime for weather data
- Automatic cleanup of old entries (7+ days)
- Reduces API calls and improves response time

### Flexible Time Input
- Manual time entry supports any time of day (e.g., 07:45, 16:35)
- Times are converted to decimal hours for precise weather lookup
- Displayed in recommendations with accurate formatting (HH:MM)

### Commute Duration
- Adjustable from 10 minutes to 2 hours
- Factors into clothing recommendations (longer commutes = more outdoor exposure)
- Clearly communicated to AI for context-aware suggestions

### Meeting Context
- Optional checkbox for important meetings
- Six meeting types available:
  - **Client Meeting**: Professional, business-appropriate attire
  - **Presentation**: Polished, confident look
  - **Job Interview**: Formal, impressive outfit
  - **Board Meeting**: Executive-level professional attire
  - **Networking Event**: Smart, approachable style
  - **Casual Team Meeting**: Relaxed but presentable
- AI adjusts recommendations to balance weather comfort with professional requirements

### Cold Sensitivity Levels
- **Low**: Recommendations for people who rarely feel cold
- **Medium**: Standard recommendations for average sensitivity
- **High**: Extra layers and warmth for cold-sensitive users

### Detailed Weather Information
The app provides comprehensive weather data:
- **Temperature**: Actual and feels-like temperatures
- **Wind**: Wind speed and gust measurements
- **UV Index**: Sun exposure levels with descriptive categories
- **Cloudiness**: Cloud coverage percentage with descriptions
- **Precipitation**: Rain/snow amounts
- **Weather Conditions**: Clear sky, partly cloudy, overcast, rain (light/moderate/heavy), snow, fog, drizzle, thunderstorms

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python main.py
```

API documentation available at: `http://localhost:8000/docs`

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

## Troubleshooting

### Backend Issues

**"GITHUB_TOKEN environment variable is required"**
- Ensure you have a `.env` file with your GitHub token in the backend directory

**"City not found" error**
- Check city name spelling
- Try using a larger city nearby
- Use English city names

### Frontend Issues

**CORS errors**
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is properly configured in backend

**API connection failed**
- Verify backend is running on the correct port
- Check network connectivity
- Ensure firewall isn't blocking connections

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com)
- AI recommendations powered by GitHub Models
