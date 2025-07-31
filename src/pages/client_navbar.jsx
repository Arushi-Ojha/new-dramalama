import { useNavigate } from "react-router-dom";
import Landing_Button from "./LandingButton";
function Client_Navbar(){
    const navigate = useNavigate();
    function Dashboard(){
        navigate('/client_dashboard')
    }
    function Tickets(){
        navigate('/client_tickets')
    }
    function Login(){
        localStorage.clear();
        navigate('/login')
    }
    return(
        <div className="Navbar">   
            <Landing_Button/>
            <button onClick={Dashboard}>MOVIES</button>
            <button onClick={Tickets}>YOUR TICKETS</button>
            <button onClick={Login}>LOGOUT</button>
        </div>
    );
}
export default Client_Navbar