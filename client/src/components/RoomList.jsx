import React from 'react';
import Room from './Room';
import CreateRoomForm from './CreateRoomForm';

function RoomList({ currentUser, rooms, userRooms, onSelectRoom, onCreateRoom, onJoinRoom, onDeleteRoom }) {
  const [newRoomName, setNewRoomName] = React.useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim() === '') return;
    onCreateRoom(newRoomName);
    setNewRoomName('');
  };

  const isUserInRoom = (roomId) => {
    return userRooms && userRooms.some(userRoom => userRoom.id === roomId);
  };

  const handleDeleteClick = (roomId, roomName) => {
    if (window.confirm(`Are you sure you want to delete the room "${roomName}"?`)) {
      onDeleteRoom(roomId);
    }
  };

  return (
    <div className="card">
      <h2 className="card-header">Rooms</h2>
      <ul className="room-list card-body">
        {rooms.map(room => (
          <li key={room.id}>
            {isUserInRoom(room.id) ? (
              <>
                <span onClick={() => onSelectRoom(room)}>{room.name}</span>
                {currentUser?.id === 1 && (
                  <button className="button-delete" onClick={() => handleDeleteClick(room.id, room.name)}>X</button>
                )}
              </>
            ) : (
              <>
                <span>{room.name}</span>
                <button className="button" onClick={() => onJoinRoom(room.id)}>Join</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreateRoom} className="card-footer">
        <div className="form-group">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="New room name"
          />
          <button className="button" type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}

export default RoomList; 
