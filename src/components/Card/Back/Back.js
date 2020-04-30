import React from 'react';
import cardBackground from '../../../card_background.png';
import './Back.css';

const Back = () => (
  <div className="card">
    <div className="card__points">
      <img style={{objectFit: 'scale-down', width: '80px', height: '100px'}} src={cardBackground} alt="logo" />
    </div>
  </div>
);

export default Back;
