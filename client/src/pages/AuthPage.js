// src/pages/AuthPage.js
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.toggleButtons}>
          <button
            style={showRegister ? styles.inactiveBtn : styles.activeBtn}
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>
          <button
            style={showRegister ? styles.activeBtn : styles.inactiveBtn}
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>

        <div style={styles.formContainer}>
          {showRegister ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f7f7f7',
    fontFamily: 'Arial, sans-serif',
  },
  box: {
    width: 400,
    padding: 20,
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  },
  toggleButtons: {
    display: 'flex',
    marginBottom: 20,
  },
  activeBtn: {
    flex: 1,
    padding: 10,
    background: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px 5px 0 0',
  },
  inactiveBtn: {
    flex: 1,
    padding: 10,
    background: '#e0e0e0',
    color: '#333',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px 5px 0 0',
  },
  formContainer: {
    border: '1px solid #ccc',
    borderTop: 'none',
    padding: 20,
  },
};
