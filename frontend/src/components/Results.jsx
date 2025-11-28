function Results({ data }) {
  const { recommendation, home_weather, work_weather } = data

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`
  }

  const getWeatherChipClass = (temp) => {
    if (temp < 5) return 'cold'
    if (temp < 15) return 'mild'
    return 'hot'
  }

  const hasRain = (precipitation) => precipitation > 0.1

  const getUVLevel = (uvIndex) => {
    if (uvIndex < 3) return 'Very low'
    if (uvIndex < 6) return 'Low'
    if (uvIndex < 8) return 'Moderate'
    if (uvIndex < 11) return 'High'
    return 'Very high'
  }

  const formatRecommendation = (text) => {
    // Split by lines and format each one
    const lines = text.split('\n')
    return lines.map((line, index) => {
      // Match pattern "LayerName: rest of text"
      const match = line.match(/^(Base layer|Legwear|Top|Warm layer|Outerwear|Headwear|Handwear|Footwear|Umbrella):\s*(.+)$/i)
      if (match) {
        return (
          <div key={index}>
            <strong>{match[1]}:</strong> {match[2]}
          </div>
        )
      }
      return <div key={index}>{line}</div>
    })
  }

  const WeatherSummary = ({ weather }) => (
    <div className="mb-4 p-3" style={{
      backgroundColor: 'var(--bg-warm)',
      borderRadius: '12px',
      fontSize: '0.9rem'
    }}>
      <p className="label-sm mb-2">Weather Summary</p>
      <div className="d-flex flex-column gap-1">
        <div>
          <strong>Temperature:</strong> {formatTemperature(weather.temperature)}
          <span className="text-muted"> (feels like {formatTemperature(weather.apparent_temperature)})</span>
        </div>
        <div>
          <strong>Condition:</strong> {weather.condition}
        </div>
        <div>
          <strong>Wind:</strong> {Math.round(weather.wind_speed)} m/s
          {weather.wind_gusts > weather.wind_speed && (
            <span className="text-muted"> (gusts up to {Math.round(weather.wind_gusts)} m/s)</span>
          )}
        </div>
        <div>
          <strong>UV Index:</strong> {getUVLevel(weather.uv_index)} ({weather.uv_index.toFixed(2)})
        </div>
        <div>
          <strong>Cloudiness:</strong> {Math.round(weather.cloud_cover)}% {weather.cloud_cover > 90 ? 'overcast' : weather.cloud_cover > 50 ? 'mostly cloudy' : weather.cloud_cover > 25 ? 'partly cloudy' : 'mostly clear'}
        </div>
        {hasRain(weather.precipitation) && (
          <div>
            <strong>Precipitation:</strong> {weather.precipitation} mm
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="mt-4">
      {/* Main Recommendation Card */}
      <div className="card recommendation-card mb-4">
        <div className="card-body p-4">
          <p className="label-sm mb-3" style={{color: 'rgba(255,255,255,0.9)'}}>
            Today's Outfit
          </p>
          <div className="recommendation-text">
            {formatRecommendation(recommendation)}
          </div>
        </div>
      </div>

      {/* Weather Details Cards */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body p-4">
              <p className="label-sm mb-2">Morning</p>
              <h5 className="card-title mb-3">{home_weather.city}</h5>

              {/* Weather Chips */}
              <div className="mb-3 d-flex flex-wrap gap-2">
                <span className={`weather-chip ${getWeatherChipClass(home_weather.temperature)}`}>
                  {formatTemperature(home_weather.temperature)}
                </span>
                {hasRain(home_weather.precipitation) && (
                  <span className="weather-chip rain">
                    Rain {home_weather.precipitation}mm
                  </span>
                )}
              </div>

              {/* Weather Summary */}
              <WeatherSummary weather={home_weather} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body p-4">
              <p className="label-sm mb-2">Evening</p>
              <h5 className="card-title mb-3">{work_weather.city}</h5>

              {/* Weather Chips */}
              <div className="mb-3 d-flex flex-wrap gap-2">
                <span className={`weather-chip ${getWeatherChipClass(work_weather.temperature)}`}>
                  {formatTemperature(work_weather.temperature)}
                </span>
                {hasRain(work_weather.precipitation) && (
                  <span className="weather-chip rain">
                    Rain {work_weather.precipitation}mm
                  </span>
                )}
              </div>

              {/* Weather Summary */}
              <WeatherSummary weather={work_weather} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
