import './Results.css'

function Results({ data }) {
  const { recommendation, home_weather, work_weather } = data

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`
  }

  return (
    <div className="results">
      <div className="recommendation-card">
        <h2>Your Clothing Recommendation</h2>
        <div className="recommendation-text">
          {recommendation}
        </div>
      </div>

      <div className="weather-cards">
        <div className="weather-card">
          <h3>🏠 Morning at {home_weather.city}</h3>
          <div className="weather-info">
            <div className="weather-detail">
              <span className="label">Temperature:</span>
              <span className="value">{formatTemperature(home_weather.temperature)}</span>
            </div>
            <div className="weather-detail">
              <span className="label">Condition:</span>
              <span className="value">{home_weather.condition}</span>
            </div>
            <div className="weather-detail">
              <span className="label">Precipitation:</span>
              <span className="value">{home_weather.precipitation} mm</span>
            </div>
            <div className="weather-detail">
              <span className="label">Wind Speed:</span>
              <span className="value">{Math.round(home_weather.wind_speed)} km/h</span>
            </div>
          </div>
        </div>

        <div className="weather-card">
          <h3>🏢 Evening at {work_weather.city}</h3>
          <div className="weather-info">
            <div className="weather-detail">
              <span className="label">Temperature:</span>
              <span className="value">{formatTemperature(work_weather.temperature)}</span>
            </div>
            <div className="weather-detail">
              <span className="label">Condition:</span>
              <span className="value">{work_weather.condition}</span>
            </div>
            <div className="weather-detail">
              <span className="label">Precipitation:</span>
              <span className="value">{work_weather.precipitation} mm</span>
            </div>
            <div className="weather-detail">
              <span className="label">Wind Speed:</span>
              <span className="value">{Math.round(work_weather.wind_speed)} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
