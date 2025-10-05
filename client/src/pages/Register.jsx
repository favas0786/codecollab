import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '' // Add confirm password field
    });
    const navigate = useNavigate();

    const { username, email, password, password2 } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        // Check if passwords match
        if (password !== password2) {
            alert('Passwords do not match');
            return; // Stop the submission
        }
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                username,
                email,
                password,
            });
            navigate('/login');
        } catch (err) {
            console.error(err.response.data);
            alert('Error registering user');
        }
    };

    return (
        <div className="homePageWrapper">
            <form className="formWrapper" onSubmit={onSubmit}>
                <div className="inputGroup">
                    <h1>Register</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                        className="inputBox"
                    />
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
                        minLength="6"
                        className="inputBox"
                    />
                    {/* Add the new input field */}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={onChange}
                        required
                        minLength="6"
                        className="inputBox"
                    />
                    <button type="submit" className="btn joinBtn">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;