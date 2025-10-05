// client/src/pages/RoomPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import Chat from '../components/Chat';
import UserList from '../components/UserList'; // 1. Import UserList
import axios from 'axios';

const SERVER_URL = "https://codecollab-backend.onrender.com"; 
const socket = io(SERVER_URL, {
    transports: ['websocket', 'polling']
});

const RoomPage = () => {
    const { roomId } = useParams();
    const [code, setCode] = useState('// Start coding here...');
    const [username, setUsername] = useState('Guest');
    const [users, setUsers] = useState([]); // 2. Add state for the user list
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // 3. Emit 'join_room' with username
        if (roomId && storedUsername) {
            socket.emit('join_room', { roomId, username: storedUsername });
        }

        // 4. Listen for the updated user list
        socket.on('update_user_list', (userList) => {
            setUsers(userList);
        });

        // Other listeners
        socket.on('code_change', (newCode) => {
            setCode(newCode);
        });

        // Cleanup
        return () => {
            socket.off('update_user_list');
            socket.off('code_change');
        };
    }, [roomId]);

    const handleEditorChange = (value) => {
        setCode(value);
        socket.emit('code_change', { roomId, newCode: value });
    };

    const runCode = async () => {
        // ... (runCode function remains the same)
        setIsLoading(true);
        try {
            const res = await axios.post('https://codecollab-backend.onrender.com/api/execute', {
                language: 'javascript',
                code: code,
            });
            setOutput(res.data.stdout || res.data.stderr || 'No output.');
        } catch (err) {
            setOutput('An error occurred. Please try again.');
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className="room-page-wrapper">
            <div className="sidebar">
                {/* 5. Add the UserList component */}
                <UserList users={users} />
                <Chat socket={socket} roomId={roomId} username={username} />
            </div>

            <div className="main-content">
                {/* ... (rest of your JSX for editor/output remains the same) ... */}
                <div className="editor-controls">
                    <button className="btn run-btn" onClick={runCode} disabled={isLoading}>
                        {isLoading ? 'Running...' : 'Run Code'}
                    </button>
                </div>
                <div className="editor-container">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        defaultLanguage="javascript"
                        value={code}
                        onChange={handleEditorChange}
                    />
                </div>
                <div className="output-container">
                    <h3>Output:</h3>
                    <pre className="output-text">{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;