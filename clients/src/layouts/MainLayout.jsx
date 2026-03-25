import React from 'react';
import Navbar from '../components/Navbar';
import CursorFollower from '../components/CursorFollower';
import DynamicBackground from '../components/DynamicBackground';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <DynamicBackground />
      <CursorFollower />
      <Navbar />
      <main>
        {children}
      </main>
      <ToastContainer 
        position="bottom-right"
        theme="colored"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MainLayout;
