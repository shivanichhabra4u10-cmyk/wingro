import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { FormWrapper, FormField } from '../components';
import { useAuth } from '../context/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  // Use Google OAuth client ID from .env
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const GOOGLE_REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

  const getGoogleOAuthUrl = () => {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'id_token',
      scope: 'openid email profile',
      prompt: 'select_account',
      nonce: Math.random().toString(36).substring(2),
    });
    return `${base}?${params.toString()}`;
  };
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  // Simulate fetching settings from backend or context
  const [googleSSOEnabled, setGoogleSSOEnabled] = useState(true);
  const [testGoogleToken, setTestGoogleToken] = useState('');
  const handleSubmit = async (values: LoginFormValues) => {
  await login(values.email, values.password);
  const redirectTo = (location.state && location.state.from) ? location.state.from : '/';
  navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-center text-3xl font-extrabold text-blue-900 mb-2">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-cyan-600 hover:text-cyan-500"
          >
            create a new account
          </Link>
        </p>
        {!showOtp && !showForgot ? (
          <>
            <FormWrapper
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              submitButton={{
                text: 'Sign in',
                props: { className: 'w-full', variant: 'primary' },
              }}
            >
            <FormField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <div className="w-full flex justify-end mt-1">
              <span
                className="text-xs text-gray-400 hover:text-cyan-600 cursor-pointer underline"
                onClick={() => setShowForgot(true)}
                role="link"
              >
                Forgot password?
              </span>
            </div>
            </FormWrapper>
            {/* Forgot password link moved above, styled as small subtle button */}
            <div className="mt-6 flex flex-col gap-2 items-center">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                onClick={async () => {
                  if (googleSSOEnabled) {
                    window.location.href = getGoogleOAuthUrl();
                  } else {
                    let token = testGoogleToken;
                    if (!token) {
                      token = window.prompt('Paste test Google ID token here') || '';
                      setTestGoogleToken(token);
                    }
                    const phone = window.prompt('Enter phone (optional, for first time)');
                    fetch(`${process.env.REACT_APP_API_URL}/api/auth/login/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ token, phone })
                    }).then(res => res.json()).then(data => {
                      alert('Google login successful!');
                      window.location.reload();
                    }).catch(() => alert('Google login failed'));
                  }
                }}
              >
                Sign in with Google
              </button>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                onClick={() => setShowOtp(true)}
              >
                Login with OTP
              </button>
            </div>
          </>
        ) : showForgot ? (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter your email to reset password</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              onClick={async () => {
                setForgotLoading(true);
                setForgotMsg('');
                try {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/request-password-reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: forgotEmail }),
                  });
                  if (res.ok) {
                    setForgotMsg('If this email exists, a reset link will be sent.');
                  } else {
                    const data = await res.json();
                    setForgotMsg(data.error || 'Failed to send reset link.');
                  }
                } catch (err) {
                  setForgotMsg('Network error. Please try again.');
                }
                setForgotLoading(false);
              }}
              disabled={forgotLoading || !forgotEmail}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mt-2"
              onClick={() => {
                setShowForgot(false);
                setForgotEmail('');
                setForgotMsg('');
              }}
            >
              Back to Login
            </button>
            {forgotMsg && <div className="mt-2 text-green-600 text-center">{forgotMsg}</div>}
          </div>
        ) : (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={otpPhone}
              onChange={e => setOtpPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your phone number"
            />
            {!otpSent ? (
              <button
                type="button"
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
                onClick={async () => {
                  setOtpLoading(true);
                  setOtpError('');
                  // Call backend to send OTP
                  const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: otpPhone })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setOtpSent(true);
                  } else {
                    setOtpError(data.error || 'Failed to send OTP');
                  }
                  setOtpLoading(false);
                }}
                disabled={otpLoading || !otpPhone}
              >
                {otpLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Enter OTP</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter OTP code"
                />
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition"
                  onClick={async () => {
                    setOtpLoading(true);
                    setOtpError('');
                    // Call backend to verify OTP
                    const res = await fetch('/api/auth/verify-otp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ phone: otpPhone, otp: otpCode })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      window.location.reload();
                    } else {
                      setOtpError(data.error || 'Invalid OTP');
                    }
                    setOtpLoading(false);
                  }}
                  disabled={otpLoading || !otpCode}
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
                <button
                  type="button"
                  className="w-full mt-2 text-indigo-600 hover:underline"
                  onClick={() => {
                    setShowOtp(false);
                    setOtpPhone('');
                    setOtpSent(false);
                    setOtpCode('');
                    setOtpError('');
                  }}
                >
                  Back to Email/Password Login
                </button>
              </>
            )}
            {otpError && <div className="mt-2 text-red-600 text-center">{otpError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

// Duplicate component and export removed. Only one Login component and export default remain.
