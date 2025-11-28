function Results({ data }) {
  const { recommendation, home_weather, work_weather } = data

  const formatTemperature = (temp) => {
    return `${Math.round(temp)}°C`
  }

  return (
    <div className="mt-4">
      <div className="card shadow-sm mb-4 bg-primary text-white">
        <div className="card-body p-4">
          <h4 className="card-title mb-3">Your Clothing Recommendation</h4>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            whiteSpace: 'pre-line',
            lineHeight: '1.9'
          }}>
            {recommendation}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-primary border-bottom pb-2 mb-3">
                Morning at {home_weather.city}
              </h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Temperature:</span>
                  <span className="fw-bold">{formatTemperature(home_weather.temperature)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Condition:</span>
                  <span className="fw-bold">{home_weather.condition}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Precipitation:</span>
                  <span className="fw-bold">{home_weather.precipitation} mm</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Wind Speed:</span>
                  <span className="fw-bold">{Math.round(home_weather.wind_speed)} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-primary border-bottom pb-2 mb-3">
                Evening at {work_weather.city}
              </h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Temperature:</span>
                  <span className="fw-bold">{formatTemperature(work_weather.temperature)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Condition:</span>
                  <span className="fw-bold">{work_weather.condition}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Precipitation:</span>
                  <span className="fw-bold">{work_weather.precipitation} mm</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="text-muted fw-medium">Wind Speed:</span>
                  <span className="fw-bold">{Math.round(work_weather.wind_speed)} km/h</span>
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
