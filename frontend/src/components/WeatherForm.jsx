import { useState } from 'react'

function WeatherForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    home_city: '',
    work_city: '',
    departure_time: '8',
    return_time: '18',
    commute_duration: '30',
    cold_sensitivity: 'medium'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert times and duration to integers
    const submissionData = {
      ...formData,
      departure_time: parseInt(formData.departure_time, 10),
      return_time: parseInt(formData.return_time, 10),
      commute_duration: parseInt(formData.commute_duration, 10)
    }

    onSubmit(submissionData)
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-4">
      <div className="card-body p-4">
        <div className="mb-4">
          <p className="label-sm mb-3">Location</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="home_city" className="form-label">Home City</label>
              <input
                type="text"
                className="form-control"
                id="home_city"
                name="home_city"
                value={formData.home_city}
                onChange={handleChange}
                placeholder="e.g., Solna"
                required
                disabled={loading}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="work_city" className="form-label">Work City</label>
              <input
                type="text"
                className="form-control"
                id="work_city"
                name="work_city"
                value={formData.work_city}
                onChange={handleChange}
                placeholder="e.g., Stockholm"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="label-sm mb-3">Schedule</p>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="departure_time" className="form-label">Departure</label>
              <select
                className="form-select"
                id="departure_time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="return_time" className="form-label">Return</label>
              <select
                className="form-select"
                id="return_time"
                name="return_time"
                value={formData.return_time}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="commute_duration" className="form-label">Commute</label>
              <select
                className="form-select"
                id="commute_duration"
                name="commute_duration"
                value={formData.commute_duration}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="label-sm mb-3">Preferences</p>
          <label className="form-label">Cold Sensitivity</label>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="cold_sensitivity"
                id="sensitivity_low"
                value="low"
                checked={formData.cold_sensitivity === 'low'}
                onChange={handleChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="sensitivity_low">
                Low sensitivity
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="cold_sensitivity"
                id="sensitivity_medium"
                value="medium"
                checked={formData.cold_sensitivity === 'medium'}
                onChange={handleChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="sensitivity_medium">
                Medium sensitivity
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="cold_sensitivity"
                id="sensitivity_high"
                value="high"
                checked={formData.cold_sensitivity === 'high'}
                onChange={handleChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="sensitivity_high">
                High sensitivity
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </button>
      </div>
    </form>
  )
}

export default WeatherForm
