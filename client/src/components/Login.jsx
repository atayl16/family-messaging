import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://family-messaging-b43098fd5fb4.herokuapp.com';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      onLogin(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-header">Login</h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 
