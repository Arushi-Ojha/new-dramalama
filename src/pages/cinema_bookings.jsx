import { useEffect, useState } from 'react';
import api from '../../axios';
import seatBooked from '../assets/seat_booked.jpg';
import seatAvailable from '../assets/seat_available.jpg';

function Cinema_Bookings() {
  const [seats, setSeats] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const movie_id = localStorage.getItem('movie_id');
        const screening_id = localStorage.getItem('screening_id');

        const response = await api.get(`/screenings/screening/${screening_id}`);
        const data = response.data;
        setSeats(data.seats);

        const rowSet = new Set();
        const colSet = new Set();

        data.seats.forEach(seat => {
          const row = seat.seat_number.charAt(0);
          const col = parseInt(seat.seat_number.substring(1));
          rowSet.add(row);
          colSet.add(col);
        });

        setRows(Array.from(rowSet).sort());
        setColumns(Array.from(colSet).sort((a, b) => a - b));
      } catch (err) {
        console.error('Failed to fetch seats:', err);
      }
    };

    fetchSeats();
  }, []);

  const getSeatImage = (row, col) => {
    const seatNum = `${row}${col}`;
    const seat = seats.find(s => s.seat_number === seatNum);
    return seat?.is_booked ? seatBooked : seatAvailable;
  };

  return (
    <div className="cinema-bookings-container">
      <h2 className="cinema-bookings-title">CINEMA LAYOUT</h2>
      <p className="cinema-bookings-subtitle">(Booked / Available)</p>
      <table className="cinema-bookings-table">
        <thead>
          <tr>
            <th className="cinema-bookings-th-blank"></th>
            {columns.map(col => (
              <th className="cinema-bookings-th" key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr className="cinema-bookings-row" key={row}>
              <th className="cinema-bookings-row-label">{row}</th>
              {columns.map(col => (
                <td className="cinema-bookings-cell" key={col}>
                  <img
                    src={getSeatImage(row, col)}
                    alt="seat"
                    className="cinema-bookings-seat"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cinema_Bookings;
