import { useEffect, useState } from 'react';
import api from '../../axios';
import Client_Navbar from './client_navbar';

function Client_Tickets() {
  const [tickets, setTickets] = useState([]);
  const user_id = localStorage.getItem('id');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const bookingRes = await api.get(`bookings/bookings/user/${user_id}`);
        const bookingData = bookingRes.data;

        const enrichedData = await Promise.all(
          bookingData.map(async (booking) => {
            try {
              const screeningRes = await api.get(`/screenings/screenings/${booking.movie_id}`);
              const screeningInfo = screeningRes.data.find(
                s => s.id === booking.screening_id
              );

              return {
                ...booking,
                ...screeningInfo,
              };
            } catch (err) {
              console.error('Error fetching screening:', err);
              return booking;
            }
          })
        );

        setTickets(enrichedData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [user_id]);

  return (
    <div className="client-tickets-container">
      <Client_Navbar />
      <div className="tickets-wrapper">
        <h1 className="tickets-heading">Your Tickets</h1>
        {tickets.length === 0 ? (
          <p className="no-tickets-message">No bookings found.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket, index) => (
              <div key={index} className="ticket-card">
                <div className="ticket-header">
                  <span>Admit One</span>
                </div>
                <div className="ticket-info">
                  <p><strong>Seat:</strong> {ticket.seat_number}</p>
                  <p><strong>Booked At:</strong> {new Date(ticket.booked_at).toLocaleString()}</p>
                  <p><strong>Start Time:</strong> {ticket.start_time}</p>
                  <p><strong>Date:</strong> {ticket.date}</p>
                  <p><strong>Hall Number:</strong> {ticket.hall_number}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Client_Tickets;
