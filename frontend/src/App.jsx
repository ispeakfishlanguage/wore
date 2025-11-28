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
      <header className="app-header bg-primary text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">WORE</h1>
          <p className="lead mb-0">A weather-based outfit recommendation agent</p>
        </div>
      </header>

      <main className="app-main container py-4">
        <WeatherForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlinkHref="#exclamation-triangle-fill"/></svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Getting your recommendation...</p>
          </div>
        )}

        {recommendation && !loading && (
          <Results data={recommendation} />
        )}
      </main>

      <footer className="app-footer bg-light border-top py-3 mt-5">
        <div className="container text-center text-muted">
          <p className="mb-0">Weather data from <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none">Open-Meteo</a></p>
        </div>
      </footer>
    </div>
  )
}

export default App
