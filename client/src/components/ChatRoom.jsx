import React, { useState, useEffect, useRef } from 'react';

function ChatRoom({ room, user, onSendMessage, onLeaveRoom }) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;
    onSendMessage(messageInput);
    setMessageInput('');
  };

  const parseEmojis = (text) => {
    const emojiMap = {
      '<3': '❤️',
      ':)': '😊',
      ':(': '😢',
      ':D': '😃',
      ';)': '😉',
      ':P': '😛',
    };
    const regex = new RegExp(Object.keys(emojiMap).map(e => e.replace(/([()*+?^${}|[\]\\])/g, '\\$1')).join('|'), 'g');
    return text.replace(regex, (match) => emojiMap[match]);
  };

  return (
    <div className="card chat-room">
      <div className="card-header">
        <h2>{room.name}</h2>
        <button className="button" onClick={() => onLeaveRoom(room.id)}>Leave</button>
      </div>
      <div className="card-body message-list">
        {room.messages && room.messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="message-user">{msg.user?.username || 'User'}: </span>
            <span className="message-content">{parseEmojis(msg.content)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="card-footer">
        <div className="form-group">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="button" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom; 
