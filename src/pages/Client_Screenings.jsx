import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import Client_Navbar from './client_navbar';

function Client_Screenings() {
  const [cinemaMap, setCinemaMap] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const movie_name = localStorage.getItem('movie_name');

    if (!movie_name) {
      setMessage('No movie name found in localStorage.');
      return;
    }

    fetchMovieData(movie_name);
  }, []);

  const fetchMovieData = async (movie_name) => {
    try {
      const movieRes = await api.get('cinemas/movies/by-name', {
        params: { movie_name },
      });

      const movies = movieRes.data;

      const cinemaDetails = {};

      for (const movie of movies) {

        try {
          const [cinemaRes, screeningRes] = await Promise.all([
            api.get('/cinemas/cinema-id', { params: { cinema_id: movie.cinema_id } }),
            api.get(`/screenings/screenings/${movie.id}`),
          ]);

          const cinemaId = movie.cinema_id;
          const cinemaData = cinemaRes.data;
          const screenings = screeningRes.data;
          const futureScreenings = screenings
  .map((s) => {
    const dateTimeString = `${s.date}T${s.start_time}`;
    return {
      ...s,
      date_time: new Date(dateTimeString),
    };
  })
  .filter((s) => s.date_time > new Date());


          if (futureScreenings.length > 0) {
            if (!cinemaDetails[cinemaId]) {
              cinemaDetails[cinemaId] = {
                cinema: cinemaData,
                screeningsByDate: {},
              };
            }

            for (const screening of futureScreenings) {
              const dt = new Date(screening.date_time);
              const dateKey = dt.toLocaleDateString();
              const time = {
                id: screening.id,
                timeString: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                raw: dt,
              };

              if (!cinemaDetails[cinemaId].screeningsByDate[dateKey]) {
                cinemaDetails[cinemaId].screeningsByDate[dateKey] = [];
              }

              cinemaDetails[cinemaId].screeningsByDate[dateKey].push(time);
            }
          }
        } catch (err) {
          console.error(`Error fetching cinema or screenings for movie ID ${movie.id}`, err);
        }
      }

      setCinemaMap(cinemaDetails);
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setMessage('Failed to fetch movie data.');
    }
  };

  const handleScreeningSelect = (screeningId) => {
    localStorage.setItem('screening_id', screeningId);
    navigate('/client_seats');
  };

  const handleBack = () => {
    navigate('/client_dashboard');
  };

  return (
    <div>
      <Client_Navbar />
      <div className="client_screening">
      <div className="screenings_container">
        <button onClick={handleBack} className="back_button">← Back</button>

        {message && <p className="error_message">{message}</p>}

        {Object.keys(cinemaMap).length === 0 && !message && (
          <p className="loading_message">Loading screenings...</p>
        )}

        {Object.values(cinemaMap).map(({ cinema, screeningsByDate }) => (
          <div key={cinema.id} className="cinema_block">
            <h2 className="cinema_title">🎬 {cinema.cinema_name} ({cinema.cinema_city})</h2>

            {Object.keys(screeningsByDate).length > 0 ? (
              Object.entries(screeningsByDate).map(([date, times]) => (
                <div key={date} className="date_block">
                  <h3 className="screening_date">{date}</h3>
                  <div className="screening_times">
                    {times.sort((a, b) => a.raw - b.raw).map((screening) => (
                      <button
                        key={screening.id}
                        onClick={() => handleScreeningSelect(screening.id)}
                        className="time_button"
                      >
                        {screening.timeString}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no_screening">We don’t have a slot to premiere this movie.</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Client_Screenings;
