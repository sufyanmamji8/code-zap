// src/components/Loader.jsx
import React from 'react';
import { Player } from '@lottie-react/lottie-react';
import cryptoLoader from '../assets/animations/cryptoLoader.json'; // Animation JSON file ka path

const Loader = () => {
  return (
    <div style={styles.overlay}>
      <Player
        autoplay
        loop
        src={cryptoLoader} // Animation file ka path
        style={{ height: '200px', width: '200px' }} // Animation size
      />
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Halka white transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Har cheez ke upar dikhai dega
  },
};

export default Loader;
