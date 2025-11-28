import { useState } from 'react'
import './WeatherForm.css'

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
    <form className="weather-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>Location</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="home_city">Home City</label>
            <input
              type="text"
              id="home_city"
              name="home_city"
              value={formData.home_city}
              onChange={handleChange}
              placeholder="e.g., Solna"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="work_city">Work City</label>
            <input
              type="text"
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

      <div className="form-section">
        <h2>Schedule</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departure_time">Departure Time</label>
            <select
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

          <div className="form-group">
            <label htmlFor="return_time">Return Time</label>
            <select
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

          <div className="form-group">
            <label htmlFor="commute_duration">Commute Duration (minutes)</label>
            <select
              id="commute_duration"
              name="commute_duration"
              value={formData.commute_duration}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Preferences</h2>
        <div className="form-group">
          <label htmlFor="cold_sensitivity">Cold Sensitivity</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="cold_sensitivity"
                value="low"
                checked={formData.cold_sensitivity === 'low'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Low - I rarely feel cold</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="cold_sensitivity"
                value="medium"
                checked={formData.cold_sensitivity === 'medium'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Medium - Average sensitivity</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="cold_sensitivity"
                value="high"
                checked={formData.cold_sensitivity === 'high'}
                onChange={handleChange}
                disabled={loading}
              />
              <span>High - I get cold easily</span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
      </button>
    </form>
  )
}

export default WeatherForm
