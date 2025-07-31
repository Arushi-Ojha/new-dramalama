import { useNavigate } from "react-router-dom";
function Landing_Button(){
    const navigate = useNavigate();
    function LandingButton(){
        localStorage.clear();
        navigate('/')
    }
    return(
        <div>
            <button onClick={LandingButton} className="Landing">DramaLama</button>
        </div>
    );
}
export default Landing_Button