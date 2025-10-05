import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(''); // 1. Add error state
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // client/src/pages/Login.jsx

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const res = await axios.post('https://codecollab-backend.onrender.com/api/auth/login', {
                email,
                password,
            });
            const token = res.data.token;
            localStorage.setItem('token', token);

            // Decode token to get username and store it
            const decoded = jwtDecode(token);
            localStorage.setItem('username', decoded.user.username);

            navigate('/');
        } catch (err) {
            setError(err.response.data.msg || 'Invalid credentials');
        }
    };

    return (
        <div className="homePageWrapper">
            <form className="formWrapper" onSubmit={onSubmit}>
                <div className="inputGroup">
                    <h1 className="mainLabel">Login</h1>
                    {/* 3. Display the error message */}
                    {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        className="inputBox"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        className="inputBox"
                    />
                    <button type="submit" className="btn joinBtn">Login</button>
                    <span className="createInfo">
                        Don't have an account?&nbsp;
                        <Link to="/register" className="createNewBtn">Register</Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Login;