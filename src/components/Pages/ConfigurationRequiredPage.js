// ConfigurationRequiredPage.js
import React from 'react';

const ConfigurationRequiredPage = ({ onComplete }) => {
  return (
    <div>
      <h2>Please complete your configuration first</h2>
      <button onClick={onComplete}>Complete Configuration</button>
    </div>
  );
};

export default ConfigurationRequiredPage;
