import { useState, useEffect, useMemo } from "react";
import { Howl } from "howler";

const useAudio = (url: string, onEnd?: () => void) => {

  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);


  const audio = useMemo(() => new Howl({
    src: [url],
    loop: false,
    preload: true,
    onend: onEnd,
  }), [url, onEnd]);


  const isPlaying = () => audio.playing();
 
  const playFrom = (time: number) => {
    if (audio) {
      audio.seek(time);
      audio.play();
    }
  };


   const playPauseSong = () => {
    if (audio.playing()) {
      audio.fade(1, 0, 1000);
      setTimeout(() => {

        audio.pause(); // Stop the audio to reset it to the beginning
      }, 1000);
    } else {
      audio.play();
    }
  };
   const playStopSong = () => {
    if (audio.playing()) {
      audio.fade(1, 0, 1000);
      setTimeout(() => {
        audio.stop(); // Stop the audio to reset it to the beginning

      }, 1000);
    } else {
      audio.play();
    }
  };

  const play = () => {
    audio.play();

  };

  const pause = () => {

      const pausedAt = audio.seek();
      audio.pause();
      return pausedAt;
  };
  const stop = () => {
    audio.fade(1, 0, 1000);
    setTimeout(() => {
      audio.stop();
    }, 1000);
  };



  const muteUnmute = () => {
    if (isMuted) {
      audio.mute(false);
      setIsMuted(false);
    } else {
      audio.mute(true);
      setIsMuted(true);
    }
  };

  return {
    isPlaying,
    play,
    pause,
    stop,
    playPauseSong,
    playStopSong,
    playFrom,
    duration: audio.duration(),
    muteUnmute,
    currentTime,
    isMuted,
    setCurrentTime
  };
};

export default useAudio;