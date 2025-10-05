import React, { useEffect, useState } from 'react';

// 1. Receive 'username' as a prop
const Chat = ({ socket, roomId, username }) => { 
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                roomId: roomId,
                // 2. Use the username prop as the author
                author: username, 
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ':' +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        const messageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on('receive_message', messageHandler);

        return () => {
            socket.off('receive_message', messageHandler);
        };
    }, [socket]);

    return (
        <div className="chat-window">
            {/* ... (chat header is the same) ... */}
            <div className="chat-header"><p>Live Chat</p></div>
            <div className="chat-body">
                {messageList.map((messageContent, index) => {
                    return (
                        <div
                            key={index}
                            className="message"
                            // 3. Compare author name with our username
                            id={username === messageContent.author ? 'you' : 'other'} 
                        >
                            {/* ... (the rest of the JSX is the same) ... */}
                            <div className="message-content"><p>{messageContent.message}</p></div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* ... (chat footer is the same) ... */}
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === 'Enter' && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;