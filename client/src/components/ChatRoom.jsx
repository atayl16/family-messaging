import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { MentionsInput, Mention } from 'react-mentions';
import './mention-styles.css';

function ChatRoom({ room, currentUser, onSendMessage, onLeaveRoom }) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const users = (room.users || []).map(user => ({
    id: user.username,
    display: user.username
  }));

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
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiObject) => {
    setMessageInput(prevInput => prevInput + emojiObject.emoji);
  };

  return (
    <div className="card chat-room">
      <div className="card-header">
        <h2>{room.name}</h2>
        <button className="button" onClick={() => onLeaveRoom(room.id)}>Leave</button>
      </div>
      <div className="card-body message-list">
        {room.messages && room.messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.user_id === currentUser.id ? 'sent' : 'received'}`}>
            <span className="message-user">{msg.user?.username || 'User'}: </span>
            <span className="message-content">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="card-footer">
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="form-group">
            <button
              type="button"
              className="button-emoji"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
            <MentionsInput
              value={messageInput}
              onChange={(event, newValue) => setMessageInput(newValue)}
              placeholder="Type a message or @mention a user..."
              className="mentions"
              onFocus={() => setShowEmojiPicker(false)}
            >
              <Mention
                trigger="@"
                data={users}
                className="mentions__mention"
              />
            </MentionsInput>
            <button className="button" type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom; 
