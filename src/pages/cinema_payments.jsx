import { useState } from 'react';
import api from '../../axios';
import Cinema_Navbar from './cinema_navbar';
import { useNavigate } from 'react-router-dom';
function Cinema_Payments() {
  const [username, setUsername] = useState('');
  const [bookings, setBookings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


 const fetchBookings = async () => {
  try {
    const id = username.includes('-') ? username.split('-')[1] : username;
    const response = await api.get(`/bookings/bookings/user/${id}`);
    if (Array.isArray(response.data)) {
      setBookings(response.data);
      setUserId(response.data[0]?.user_id);
      setMessage('');
    } else {
      setBookings([]);
      setMessage('No bookings found.');
    }
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    setMessage('Failed to fetch bookings');
  }
};
  
  const fetchPayments = async () => {
    try {
      const response = await api.get(`/payments/booking/${userId}`);
      setPaymentDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setMessage('Failed to fetch payments');
    }
  };

  const confirmPayment = async () => {
    try {
      const payload = {
        booking_id: parseInt(bookingId),
        user_id: userId
      };
      const response = await api.post('/payments/create-payment', payload);
      alert('Payment Successfull')
      setMessage('Payment confirmed!');
      navigate('/cinema_dashboard')
    } catch (err) {
      console.error('Payment failed:', err);
      setMessage('Failed to confirm payment');
    }
  };

return (
    <div>
      <Cinema_Navbar />
      <div  className="cinema_dashboard">
      <h2 className="payments_title">CONFIRM PAYMENTS HERE</h2>

      <div className="form_group">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form_input"
        />
        <button onClick={fetchBookings} className="primary_btn">
          User's Fetched Bookings
        </button>
      </div>

      {message && <p className="error_text">{message}</p>}

      {bookings.length > 0 && (
        <div className="bookings_container">
          <h3 className="section_heading">Bookings:</h3>
          <ul className="booking_list">
            {bookings.map((booking) => (
              <li key={booking.id}>
                ID: {booking.id}, Seat: {booking.seat_number}, Movie ID: {booking.movie_id}, Time: {booking.booked_at}
              </li>
            ))}
          </ul>
        </div>
      )}

      {userId && (
        <>
          <button onClick={fetchPayments} className="secondary_btn">
            Check Existing Payments
          </button>

          {paymentDetails && (
            <div className="payments_section">
              <h3 className="section_heading">Existing Payments:</h3>
              <pre className="payments_pre">{JSON.stringify(paymentDetails, null, 2)}</pre>
            </div>
          )}

          <div className="form_group">
            <input
              type="text"
              placeholder="Enter Booking ID for payment"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="form_input"
            />
            <button onClick={confirmPayment} className="confirm_btn">
              Confirm Payment
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}


export default Cinema_Payments;
