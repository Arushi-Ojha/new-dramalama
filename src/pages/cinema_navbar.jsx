import { useNavigate } from "react-router-dom";
import Landing_Button from "./LandingButton";
function Cinema_Navbar(){
    const navigate = useNavigate();
    function Dashboard(){
        navigate('/cinema_dashboard')
    }
    function Screenings(){
        navigate('/cinema_movies')
    }
    function Bookings(){
        navigate('/cinema_payments')
    }
    function Login(){
        localStorage.clear();
        navigate('/login')
    }
    return(
        <div className="Navbar">   
            <Landing_Button/>
            <button onClick={Dashboard}>PROFILE</button>
            <button onClick={Screenings}>SCREENINGS</button>
            <button onClick={Bookings}>MAKE PAYMENTS</button>
            <button onClick={Login}>LOGOUT</button>
        </div>
    );
}
export default Cinema_Navbar