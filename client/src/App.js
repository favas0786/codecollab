// client/src/App.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react'; // 1. Import the Editor component
import './App.css';

const SERVER_URL = "http://localhost:5000";
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling']
});

function App() {
  const [code, setCode] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with socket ID:', socket.id);
    });
    
    socket.on('code_change', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('connect');
      socket.off('code_change');
    };
  }, []);

  // 2. The editor's onChange handler gives us the value directly
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('code_change', value); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CodeCollab</h1>
        {/* 3. Replace the textarea with the Editor component */}
        <Editor
          height="80vh"
          width="80vw"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
        />
      </header>
    </div>
  );
}

export default App;