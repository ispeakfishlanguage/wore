# Weather Clothing Recommender

A full-stack application that provides personalized clothing recommendations based on weather conditions for your daily commute. The app uses real-time weather data and AI-powered recommendations to help you decide what to wear.

## Features

- **Weather-based recommendations**: Get clothing suggestions based on actual weather forecasts
- **Dual location support**: Compare weather at your home and workplace
- **Personalized advice**: Customize recommendations based on your cold sensitivity
- **AI-powered**: Uses GitHub Models (GPT-4o-mini) for intelligent, context-aware suggestions
- **Weather caching**: SQLite-based caching for improved performance
- **Modern UI**: Clean, responsive React interface

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
  "message": "Weather Clothing Recommender API",
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
  "home_city": "New York",
  "work_city": "Jersey City",
  "departure_time": 8,
  "return_time": 18,
  "cold_sensitivity": "medium"
}
```

**Parameters:**
- `home_city` (string): Home city name
- `work_city` (string): Work city name
- `departure_time` (integer, 0-23): Departure hour
- `return_time` (integer, 0-23): Return hour
- `cold_sensitivity` (string): "low", "medium", or "high"

**Response:**
```json
{
  "recommendation": "Based on the morning temperature of 12°C and evening temperature of 8°C, I recommend wearing a medium-weight jacket with layers underneath...",
  "home_weather": {
    "temperature": 12.5,
    "precipitation": 0.0,
    "weather_code": 2,
    "wind_speed": 15.3,
    "time": "2025-11-27T08:00",
    "city": "New York",
    "condition": "Partly cloudy"
  },
  "work_weather": {
    "temperature": 8.2,
    "precipitation": 0.5,
    "weather_code": 61,
    "wind_speed": 18.7,
    "time": "2025-11-27T18:00",
    "city": "Jersey City",
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

1. **User Input**: User enters home city, work city, departure/return times, and cold sensitivity
2. **Weather Fetching**: Backend fetches weather data from Open-Meteo API
3. **Caching**: Weather data is cached in SQLite for 60 minutes to reduce API calls
4. **LLM Processing**: Weather data is formatted into a prompt and sent to GitHub Models
5. **Recommendation**: GPT-4o-mini generates a personalized clothing recommendation
6. **Display**: Frontend displays the recommendation along with detailed weather information

## Features in Detail

### Weather Caching
- SQLite-based caching system
- 60-minute cache lifetime for weather data
- Automatic cleanup of old entries (7+ days)
- Reduces API calls and improves response time

### Cold Sensitivity Levels
- **Low**: Recommendations for people who rarely feel cold
- **Medium**: Standard recommendations for average sensitivity
- **High**: Extra layers and warmth for cold-sensitive users

### Weather Conditions
The app handles various weather conditions:
- Clear sky, partly cloudy, overcast
- Rain (light, moderate, heavy)
- Snow (light, moderate, heavy)
- Fog, drizzle, thunderstorms
- Wind speed and precipitation data

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
