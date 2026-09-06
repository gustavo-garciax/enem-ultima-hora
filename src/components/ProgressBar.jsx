import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ value = 0, color = '#5842ED', height = 6, showValue = true }) {
  return (
    <div className="progress-container">
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showValue && <span className="progress-text">{value}%</span>}
    </div>
  );
}