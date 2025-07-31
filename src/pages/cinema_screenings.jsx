import React, { useState, useEffect } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import Cinema_Navbar from './cinema_navbar'

const CinemaScreenings = () => {
  const movie_id = localStorage.getItem("movie_id");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    movie_id: movie_id || "",
    hall_number: "",
    start_time: "",
    date: "",
  });
  const [screenings, setScreenings] = useState([]);

  const fetchScreenings = async () => {
    try {
      const res = await api.get(`/screenings/screenings/${movie_id}`);
      setScreenings(res.data);
    } catch (err) {
      console.error("Error fetching screenings", err);
    }
  };

  useEffect(() => {
    if (movie_id) fetchScreenings();
  }, [movie_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/screenings/screenings", form);
      alert("Screening created");
      fetchScreenings();
    } catch (err) {
      alert("Failed to create screening");
      console.error(err);
    }
  };

  const getColor = (date, time) => {
    const now = new Date();
    const screeningTime = new Date(`${date}T${time}`);
    return screeningTime < now ? "bg-red-200" : "bg-green-200";
  };

  return (
    <div className="cinema_screening">
  <Cinema_Navbar />
  <h2>Mark Screening</h2>
  <form onSubmit={handleSubmit} className="screening-form">
    <input type="hidden" value={form.movie_id} />
        <input
          type="number"
          placeholder="Hall Number"
          value={form.hall_number}
          onChange={(e) => setForm({ ...form, hall_number: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Screening
        </button>
  </form>

  <h2>Existing Screenings</h2>
  <ul className="screening-list">
    {screenings.map((s) => (
      <li
        key={s.id}
        className={`screening-item ${
          new Date(`${s.date}T${s.start_time}`) < new Date()
            ? "past-screening"
            : "upcoming-screening"
        }`}
      >
        <button
          onClick={() => {
            localStorage.setItem("screening_id", s.id);
            navigate("/cinema_bookings");
          }}
        >
          <strong>Hall:</strong> {s.hall_number} | <strong>Date:</strong>{" "}
          {s.date} | <strong>Time:</strong> {s.start_time}
        </button>
      </li>
    ))}
  </ul>
</div>

  );
};

export default CinemaScreenings;
