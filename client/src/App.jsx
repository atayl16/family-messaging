import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import CableApp from './cable';

const API_URL = 'https://family-messaging.onrender.com';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      axios.get(`${API_URL}/rooms`).then(response => setRooms(response.data));
      axios.get(`${API_URL}/users/${currentUser.id}/rooms`).then(response => setUserRooms(response.data));
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleSelectRoom = (room) => {
    setActiveRoom(null); // Reset active room to show loading
    axios.get(`${API_URL}/rooms/${room.id}`).then(response => {
      setActiveRoom(response.data);
      if (subscription) {
        subscription.unsubscribe();
      }
      setSubscription(createSubscription(room.id));
    });
  };

  const handleCreateRoom = (roomName) => {
    axios.post(`${API_URL}/rooms`, { name: roomName, user_id: currentUser.id })
      .then(response => {
        setRooms([...rooms, response.data]);
        setUserRooms([...userRooms, response.data]);
        handleSelectRoom(response.data);
      });
  };

  const handleSendMessage = (content) => {
    const message = {
      room_id: activeRoom.id,
      user_id: currentUser.id,
      content: content
    };
    subscription.perform('speak', message);
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await axios.post(`${API_URL}/rooms/${roomId}/join`, { user_id: currentUser.id });
      const response = await axios.get(`${API_URL}/users/${currentUser.id}/rooms`);
      setUserRooms(response.data);
      const roomToSelect = rooms.find(room => room.id === roomId);
      if (roomToSelect) {
        handleSelectRoom(roomToSelect);
      }
    } catch (error) {
      console.error("Failed to join room", error);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await axios.delete(`${API_URL}/rooms/${roomId}/leave`, { data: { user_id: currentUser.id } });
      const response = await axios.get(`${API_URL}/users/${currentUser.id}/rooms`);
      setUserRooms(response.data);
      if (activeRoom?.id === roomId) {
        setActiveRoom(null);
      }
    } catch (error) {
      console.error("Failed to leave room", error);
    }
  };

  const createSubscription = (roomId) => {
    return CableApp.cable.subscriptions.create(
      { channel: 'ChatChannel', room_id: roomId, user_id: currentUser.id },
      {
        received: handleReceivedMessage,
      }
    );
  };

  const handleReceivedMessage = (message) => {
    setActiveRoom(prevRoom => {
      // Ensure we don't add duplicate messages
      if (prevRoom.messages.find(m => m.id === message.id)) {
        return prevRoom;
      }
      return {
        ...prevRoom,
        messages: [...prevRoom.messages, message]
      };
    });
  };

  if (!currentUser) {
    return (
      <Login onLogin={handleLogin} />
    );
  }

  return (
    <div className="App container">
      <header className="app-header">
        <h1>Family Chat</h1>
        <p>Welcome, {currentUser.username}!</p>
      </header>
      <div className="app-body">
        <RoomList
          rooms={rooms}
          userRooms={userRooms}
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
        {activeRoom ? (
          <ChatRoom
            room={activeRoom}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onLeaveRoom={handleLeaveRoom}
          />
        ) : (
          <div className="no-room-selected card">
            <h2>Select a room to start chatting</h2>
            <p>Or create a new one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
