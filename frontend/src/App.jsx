import { useState } from 'react'
import WeatherForm from './components/WeatherForm'
import Results from './components/Results'
import './App.css'

function App() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setRecommendation(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

      const response = await fetch(`${apiUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get recommendation')
      }

      const data = await response.json()
      setRecommendation(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Weather Clothing Recommender</h1>
        <p>Get personalized clothing recommendations based on your daily commute weather</p>
      </header>

      <main className="app-main">
        <WeatherForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Getting your recommendation...</p>
          </div>
        )}

        {recommendation && !loading && (
          <Results data={recommendation} />
        )}
      </main>

      <footer className="app-footer">
        <p>Weather data from <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a></p>
      </footer>
    </div>
  )
}

export default App
