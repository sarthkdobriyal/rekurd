"use client"
import React, { useEffect, useState } from 'react';

interface CurrentPlaybackTimeProps {
  currentTime: number;
    duration: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const CurrentPlaybackTime: React.FC<CurrentPlaybackTimeProps> = ({  duration }) => {

    const [currentTime, setCurrentTIme] = useState(0);


  return (
    <div className="audio-time-display">
      <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
    </div>
  );
};

export default CurrentPlaybackTime;