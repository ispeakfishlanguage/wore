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
      <header className="py-4" style={{backgroundColor: 'var(--bg-warm)'}}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            margin: 0,
            color: 'var(--text-main)'
          }}>
            WORE
          </h1>
          <p className="label-sm mb-0">A Weather-Based Outfit Recommendation Agent</p>
        </div>
      </header>

      <main className="container py-5">
        <WeatherForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Getting your recommendation...</p>
          </div>
        )}

        {recommendation && !loading && (
          <Results data={recommendation} />
        )}
      </main>

      <footer className="app-footer py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0 text-muted" style={{fontSize: '0.875rem'}}>
            Weather data from <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
