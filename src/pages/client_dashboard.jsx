import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import Client_Navbar from './client_navbar'

function Client_Dashboard() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/trending')
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMessage('Failed to fetch movies.')
    }
  }

  const handleMovieClick = (movie_id, movie_name) => {
    localStorage.setItem('movie_id', movie_id)
    localStorage.setItem('movie_name', movie_name)
    navigate('/client_search')
  }

  const handleSearch = () => {
    const found = movies.find(
      (movie) =>
        movie.movie_name.toLowerCase().trim() === searchQuery.toLowerCase().trim()
    )
    if (found) {
      localStorage.setItem('movie_name', found.movie_name)
      navigate('/client_search')
    } else {
      alert('Movie not found!')
    }
  }

  return (
    <div>
      <Client_Navbar />
      <div className="cinema_dashboard">
        <h2 className="text-2xl font-bold text-center mt-4">Available Movies</h2>

      
      <div className="flex justify-center mt-4 gap-2 px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movie by name"
          className="border rounded-md px-3 py-2 w-full max-w-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {message && <p className="text-red-600 text-center mt-2">{message}</p>}

      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleMovieClick(movie.id, movie.movie_name)}
              className="movie-card"
            >
              <img
                src={movie.poster_url}
                alt={movie.movie_name}
                className="w-full h-64 object-cover"
              />
              <div className="movie-info">{movie.movie_name}</div>
            </button>
          ))
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      </div>
    </div>
  )
}

export default Client_Dashboard
