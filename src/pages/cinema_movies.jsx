import { useState, useEffect } from 'react'
import api from '../../axios'
import { useNavigate } from 'react-router-dom'
import Cinema_Navbar from './cinema_navbar'

function Cinema_Movies() {
  const navigate = useNavigate()
  const cinema_id = localStorage.getItem('cinema_id') || ''
  const username = localStorage.getItem('username')
  const [formData, setFormData] = useState({
    movie_name: '',
    description: '',
    duration: '',
    ticket_price: '',
    poster_url: ''
  })
  
  const [message, setMessage] = useState('')
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get(`/movies/by-cinema/${cinema_id}`, {
          params: { cinema_id: cinema_id }
        })
        setMovies(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
        setMessage('Error loading your movies.')
      }
    }

    fetchMovies()
  }, [cinema_id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/movies/create', {
        ...formData,
        cinema_id: cinema_id
      })
      setMessage('Movie created successfully!')
      setFormData({
        movie_name: '',
        description: '',
        duration: '',
        ticket_price: '',
        poster_url: ''
      })

      setMovies((prev) => [response.data, ...prev])
    } catch (error) {
      console.error('Movie creation failed:', error)
      if (error.response?.data?.detail) {
        setMessage(`Error: ${error.response.data.detail}`)
      } else {
        setMessage('An error occurred.')
      }
    }
    
  }

  return (
    <div>
      <Cinema_Navbar/>
      <div className="cinema_dashboard">
        <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="movie_name"
          placeholder="Movie Name"
          value={formData.movie_name}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        /><br />
        <input
          type="number"
          name="ticket_price"
          placeholder="Ticket Price"
          value={formData.ticket_price}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="poster_url"
          placeholder="Poster URL"
          value={formData.poster_url}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Add Movie</button>
      </form>

      {message && <p>{message}</p>}

      <div id="movie-list">
        <h3>Your Movies</h3>
        {movies.map((movie, index) => (
          <button className="movie-card" key={index} style={{ margin: '5px', padding: '10px' }} onClick={() => { localStorage.setItem('movie_id', movie.id) 
            navigate('/cinema_screenings')
            }}>
            <img src={movie.poster_url}></img>
            <p className="movie-info">{movie.movie_name}</p>
          </button>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Cinema_Movies
