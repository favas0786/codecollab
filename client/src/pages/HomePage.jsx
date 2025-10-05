import React, { useState, useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        navigate(`/room/${id}`);
    };

    const joinRoom = () => {
        if (!roomId) {
            alert('Please enter a room ID');
            return;
        }
        navigate(`/room/${roomId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUsername(''); // Update state to reflect logout
    };

    const authLinks = (
        <div className='inputGroup'>
            <Link to="/login" className="btn joinBtn" style={{ textDecoration: 'none', textAlign: 'center' }}>Login</Link>
            <Link to="/register" className="btn joinBtn" style={{ textDecoration: 'none', textAlign: 'center' }}>Register</Link>
        </div>
    );

    const loggedInView = (
        <>
            <h2 style={{ textAlign: 'center' }}>Welcome, {username}!</h2>
            <div className="inputGroup">
                <input
                    type="text"
                    className="inputBox"
                    placeholder="ROOM ID"
                    onChange={(e) => setRoomId(e.target.value)}
                    value={roomId}
                />
                <button className="btn joinBtn" onClick={joinRoom}>
                    Join
                </button>
            </div>
            <span className="createInfo">
                If you don't have an invite then create a&nbsp;
                <button onClick={createNewRoom} className="createNewBtn">
                    new room
                </button>
            </span>

            {/* --- CHANGE IS HERE --- */}
            <div style={{ textAlign: 'center', width: '100%' }}>
                <button onClick={handleLogout} className="btn joinBtn" style={{ marginTop: '20px', backgroundColor: '#d9534f' }}>
                    Logout
                </button>
            </div>
        </>
    );


    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <h1 className="mainLabel">CodeCollab</h1>
                {username ? loggedInView : authLinks}
            </div>
        </div>
    );
};

export default HomePage;