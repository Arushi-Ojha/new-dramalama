import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import api from '../../axios'
import Landing_Button from './LandingButton'
function SignUp() {
  localStorage.clear();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'viewer', otp: '' })
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const requestOtp = async () => {
    try {
      await api.post('/auth/signup/request-otp', form)
      setOtpSent(true)
      alert('OTP sent to your email')
    } catch (err) {
      alert(err.response?.data?.detail || 'Error requesting OTP')
    }
  }

  const verifyOtp = async () => {
    try {
      await api.post('/auth/signup/verify-otp', { email: form.email, otp: form.otp })
      alert('Signup successful!')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.detail || 'Error verifying OTP')
    }
  }

  return (
    <div className="signup-container">
      <Landing_Button/>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={handleChange} /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
      <select name="role" onChange={handleChange}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
        <option value="cinema">Cinema</option>
      </select><br />
      {!otpSent ? (
        <button onClick={requestOtp}>Request OTP</button>
      ) : (
        <>
          <input name="otp" placeholder="Enter OTP" onChange={handleChange} /><br />
          <button onClick={verifyOtp}>Verify OTP & Sign Up</button>
        </>
      )}
    </div>
  )
}

export default SignUp
