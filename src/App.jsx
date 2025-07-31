import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Client_Dashboard from './pages/client_dashboard'
import Cinema_Dashboard from './pages/cinema_dashboard'
import Cinema_Movies from './pages/cinema_movies'
import Cinema_Bookings from './pages/cinema_bookings'
import Cinema_Screenings from './pages/cinema_screenings'
import Cinema_Payments from './pages/cinema_payments'
import Client_Tickets from './pages/client_tickets'
import Client_Search from './pages/client_search'
import Client_Screenings from './pages/Client_Screenings'
import Client_Seats from './pages/client_seat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cinema_movies' element={<Cinema_Movies/>}/>
        <Route path='/cinema_dashboard' element={<Cinema_Dashboard/>}/>
        <Route path='/cinema_bookings' element={<Cinema_Bookings/>}/>
        <Route path='/cinema_screenings' element={<Cinema_Screenings/>}/>
        <Route path='cinema_payments' element={<Cinema_Payments/>}/>
        <Route path='client_dashboard' element={<Client_Dashboard/>}/>
        <Route path='client_tickets' element={<Client_Tickets/>}/>
        <Route path='client_search' element={<Client_Search/>}/>
        <Route path='client_screenings' element={<Client_Screenings/>}/>
        <Route path='client_seats' element={<Client_Seats/>}/>
      </Routes>
    </Router>
  )
}

export default App
