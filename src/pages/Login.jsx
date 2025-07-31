import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import Landing_Button from './LandingButton';

function Login() {
    localStorage.clear();
    const [form, setForm] = useState({ username: '', password: '' })
    const navigate = useNavigate()
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', form)
            const {username, email, role, id } = res.data
            localStorage.setItem('username', username)
            localStorage.setItem('email', email)
            localStorage.setItem('role', role)
            localStorage.setItem('id', id)
            alert(`Welcome ${username}`)
            if(localStorage.role=='cinema'){
                navigate('/cinema_dashboard')
            }
            else{
                navigate('/client_dashboard')
            }
        } catch (err) {
            alert(err.response?.data?.detail || 'Login failed')
        }
    }


    const handleGoogleResponse = async (response) => {
        try {
            const res = await api.post('/auth/google-login', { token_id: response.credential })
            const {username, email, role, id } = res.data
            localStorage.setItem('username', username)
            localStorage.setItem('email', email)
            localStorage.setItem('role', role)
            localStorage.setItem('id', id)
            alert(`Welcome ${username}`)
            if(localStorage.role=='cinema'){
                navigate('/cinema_dashboard')
            }
            else if(localStorage.role=='viewer'){
                navigate('/client_dashboard')
            }
        } catch (err) {
            console.log('Google Login Error:', err)
            alert(err.response?.data?.detail || 'Google login failed')
        }
    }



    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google && window.google.accounts && window.google.accounts.id) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleResponse,
                })
                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignInDiv'),
                    { theme: 'outline', size: 'large' }
                )
                clearInterval(interval)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [])
        function Signup(){
        navigate('/signup');
    }

    return (
        <div className="login-container">
            <Landing_Button/>
            <h2>Login</h2>
            <input name="username" placeholder="Username" onChange={handleChange} /><br />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
            <button onClick={handleLogin}>Login</button><br /><br />
            <button onClick={Signup}>Isn't connected with Lama?</button>
            <div id="googleSignInDiv"></div>
        </div>
    )
}

export default Login
