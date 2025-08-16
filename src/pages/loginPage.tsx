import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [empcode, setEmpcode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (empcode.trim() === '') {
      setError('Please enter an employee code');
      return;
    }
    // Set dummy user in localStorage/sessionStorage or context
    localStorage.setItem('dummyUser', JSON.stringify({
      name: 'Demo User',
      empcode,
      role: 'ADMIN', // or 'USER'
    }));
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Static Demo Login</h2>
        <input
          type="text"
          placeholder="Employee Code"
          value={empcode}
          onChange={e => setEmpcode(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;