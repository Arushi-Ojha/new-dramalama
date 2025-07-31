import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import Cinema_Navbar from './cinema_navbar'

function Cinema_Dashboard() {
  const navigate = useNavigate()
  const [cinema, setCinema] = useState(null)
  const [formData, setFormData] = useState({
    cinema_name: '',
    cinema_city: '',
    screening_type: ''
  })
  const [message, setMessage] = useState('')
  const [movies, setMovies] = useState([])

  const username = localStorage.getItem('username')


  useEffect(() => {
    console.log('🎬 useEffect triggered')
    if (!username) {
      navigate('/login')
    } else {
      fetchCinema()
      fetchUserMovies()
    }
  }, [])

  const fetchCinema = async () => {
    try {
      const response = await api.get('/cinemas/get-by-user', {
        params: { username }
      })
      if (response.data.length > 0) {
        const cinemaData = response.data[0]
        setCinema(cinemaData)
        localStorage.setItem('cinema_id', cinemaData.id)
      } else {
        setCinema(null)
      }
    } catch (error) {
      console.error('Error fetching cinema:', error)
      setMessage('Error fetching cinema data.')
    }
  }


  const fetchUserMovies = async () => {
    const cinema_id = localStorage.getItem('cinema_id')
    if (!cinema_id) {
      console.warn('No cinema_id in localStorage')
      return
    }

    try {
      const res = await api.get(`/movies/by-cinema/${cinema_id}`)
      setMovies(res.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/cinemas/create', {
        ...formData,
        username: username
      })
      setMessage('Cinema created successfully!')
      fetchCinema()
    } catch (error) {
      console.error('Error creating cinema:', error)
      setMessage('Error creating cinema.')
    }
  }

  return (
    <div >
      <Cinema_Navbar />
      <div className="cinema_dashboard">
        <h2>Cinema</h2>
        {cinema ? (
          <div>
            <p><strong>Name:</strong> {cinema.cinema_name}</p>
            <p><strong>City:</strong> {cinema.cinema_city}</p>
            <p><strong>Screening Type:</strong> {cinema.screening_type}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="cinema_name"
              placeholder="Cinema Name"
              value={formData.cinema_name}
              onChange={handleChange}
              required
            /><br />
            <input
              type="text"
              name="cinema_city"
              placeholder="Cinema City"
              value={formData.cinema_city}
              onChange={handleChange}
              required
            /><br />
            <input
              type="text"
              name="screening_type"
              placeholder="Screening Type"
              value={formData.screening_type}
              onChange={handleChange}
              required
            /><br />
            <button type="submit">Create Cinema</button>
          </form>
        )}

        {message && <p>{message}</p>}

        <h2>Your Movies</h2>
        {movies.length > 0 ? (
          <div className="movie-list">
            {movies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <img src={movie.poster_url} alt={movie.movie_name} />
                <div className="movie-info">
                  <strong>{movie.movie_name}</strong>
                  <p>{movie.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies found.</p>
        )}

      </div>
    </div>
  )
}

export default Cinema_Dashboard
