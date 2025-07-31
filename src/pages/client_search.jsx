import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import Client_Navbar from './client_navbar'

function Client_Search() {
  const [movie, setMovie] = useState(null)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const movie_name = localStorage.getItem('movie_name')
    if (!movie_name) {
      setMessage('No movie name provided.')
      return
    }

    fetchMovie(movie_name)
  }, [])

  const fetchMovie = async (movie_name) => {
    try {
      const response = await api.get('/movies/movies/search', {
        params: { movie_name }
      })
      setMovie(response.data)
    } catch (error) {
      console.error('Error fetching movie:', error)
      setMessage('Failed to fetch movie.')
    }
  }

  const handleBack = () => {
    navigate('/client_dashboard')
  }
  function screenings(){
    navigate('/client_screenings')
  }
  return (
    <div>
      <Client_Navbar />
      <div className="client_search">
      <div className="client_search_container">
        <button onClick={handleBack} className="back_button">
          ← Back
        </button>

        {message && <p className="error_message">{message}</p>}

        {movie && (
          <div onClick={screenings} className="movie_card">
            <img
              src={movie.poster_url}
              alt={movie.movie_name}
              className="movie_poster"
            />
            <div className="movie_details">
              <h2>{movie.movie_name}</h2>
              <p>{movie.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default Client_Search
