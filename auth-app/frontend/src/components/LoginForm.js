import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    await axios.post('http://localhost:5000/api/auth/login/otp', { phone }, { withCredentials: true });
    setStep(2);
    setMessage('OTP sent to your phone');
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login/otp', { phone, otp, name, email }, { withCredentials: true });
      setMessage('Login successful!');
      // handle login success (e.g., redirect)
    } catch (err) {
      setMessage('Invalid OTP or error');
    }
  };

  return (
    <div>
      {step === 1 ? (
        <div>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" />
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
      <div>{message}</div>
    </div>
  );
}
