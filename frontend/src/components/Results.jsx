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

  return (
    <div className="mt-4">
      {/* Main Recommendation Card */}
      <div className="card recommendation-card mb-4">
        <div className="card-body p-4">
          <p className="label-sm mb-3" style={{color: 'rgba(255,255,255,0.9)'}}>
            Today's Outfit
          </p>
          <div className="recommendation-text">
            {recommendation}
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

              {/* Weather Details */}
              <div>
                <div className="weather-detail-row">
                  <span className="weather-detail-label">Condition</span>
                  <span className="weather-detail-value">{home_weather.condition}</span>
                </div>
                <div className="weather-detail-row">
                  <span className="weather-detail-label">Wind</span>
                  <span className="weather-detail-value">{Math.round(home_weather.wind_speed)} km/h</span>
                </div>
              </div>
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

              {/* Weather Details */}
              <div>
                <div className="weather-detail-row">
                  <span className="weather-detail-label">Condition</span>
                  <span className="weather-detail-value">{work_weather.condition}</span>
                </div>
                <div className="weather-detail-row">
                  <span className="weather-detail-label">Wind</span>
                  <span className="weather-detail-value">{Math.round(work_weather.wind_speed)} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
