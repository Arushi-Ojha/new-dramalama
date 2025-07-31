import { useEffect, useState } from 'react';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import Client_Navbar from './client_navbar';
import seatAvailable from '../assets/seat_available.jpg';
import seatBooked from '../assets/seat_booked.jpg';
import seatSelected from '../assets/seat_selected.jpg';

function Client_Seats() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const movie_id = localStorage.getItem("movie_id");
  const screening_id = localStorage.getItem("screening_id");
  
const [message, setMessage] = useState('');
const navigate = useNavigate();
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await api.get(`/seats/${movie_id}/${screening_id}`);
        setSeats(res.data.seats);
      } catch (err) {
        console.error("Error fetching seats:", err);
      }
    };

    fetchSeats();
  }, [movie_id, screening_id]);

  const handleSeatClick = (seat_id) => {
    if (selectedSeats.includes(seat_id)) {
      setSelectedSeats(prev => prev.filter(id => id !== seat_id));
    } else {
      setSelectedSeats(prev => [...prev, seat_id]);
    }
  };

  const renderSeatsGrid = () => {
    const rows = "ABCDEFGHIJ".split("");
    const cols = Array.from({ length: 12 }, (_, i) => i + 1);

    return rows.map(row => (
      <div key={row} style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
        {cols.map(col => {
          const seatNumber = `${row}${col}`;
          const seat = seats.find(s => s.seat_number === seatNumber);

          if (!seat) {
            return <div key={seatNumber} style={{ width: 40, height: 40 }} />;
          }

          const isSelected = selectedSeats.includes(seat.seat_id);
          const imageSrc = seat.is_booked
            ? seatBooked
            : isSelected
            ? seatSelected
            : seatAvailable

          return (
            <button
              key={seat.seat_id}
              onClick={() => !seat.is_booked && handleSeatClick(seat.seat_id)}
              disabled={seat.is_booked}
              style={{
                width: 40,
                height: 40,
                background: `url(${imageSrc}) center/cover no-repeat`,
                border: "none",
                cursor: seat.is_booked ? "not-allowed" : "pointer",
              }}
              title={seatNumber}
            />
          );
        })}
      </div>
    ));
  };
const handleConfirmBooking = async () => {
  try {
    const movieName = localStorage.getItem("movie_name"); 
    const user_id = localStorage.getItem("id");     
    for (let seat_id of selectedSeats) {
      await api.post('/bookings/ticket', {
        movie_id: parseInt(movie_id),
        screening_id: parseInt(screening_id),
        seat_id,
        user_id: parseInt(user_id),
      });
    }
    const movieRes = await api.get(`movies/movies/search?movie_name=${movieName}`);
    const price = movieRes.data.ticket_price;
    const total = price * selectedSeats.length;

    setMessage(`🎉 Ticket Booked! Pay ₹${total} at the counter`);
    setTimeout(() => {
      navigate('/client_tickets');
    }, 5000);

  } catch (error) {
    console.error("Booking failed:", error);
    setMessage("Booking failed. Please try again.");
  }
};


  return (
    <div className="cinema-bookings-container">
      <Client_Navbar />
      <h2 className="cinema-bookings-title">Select Your Seats</h2>

      <div className="cinema-bookings-subtitle">
        {message && (
  <div className="cinema-bookings-subtitle">
    {message}
  </div>
)}

        {renderSeatsGrid()}
        <h2>ALL EYES HERE</h2>
        {selectedSeats.length > 0 && (
          <button
            className="cinema-bookings-cell"
            onClick={handleConfirmBooking}
          >
            Confirm Booking ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
          </button>
        )}
      </div>
    </div>
  );
}

export default Client_Seats;
