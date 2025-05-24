import React from 'react';
import Layout from '../components/Layout';
import '../styles/global.css';

const Home = ({ user }) => {
  return (
    <Layout user={user}>
      <div className="home-container">
        <h1>Welcome{user ? `, ${user.name}` : ''}!</h1>
        {user ? (
          <p>You are a {user.role.toUpperCase()} in the {user.department} department.</p>
        ) : (
          <p>Please log in or register to continue.</p>
        )}
      </div>
    </Layout>
  );
};

export default Home;
