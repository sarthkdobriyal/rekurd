import { useState, useEffect, useMemo } from "react";
import { Howl } from "howler";

const useAudio = (url: string) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = useMemo(() => new Howl({
    src: [url],
    loop: false,
    preload: true,
  }), [url]);


   const playPauseSong = () => {
    if (audio.playing()) {
      audio.fade(1, 0, 1000);
      setTimeout(() => {
        setIsPlaying(false);
        audio.pause(); // Stop the audio to reset it to the beginning
      }, 1000);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };
   const playStopSong = () => {
    if (audio.playing()) {
      audio.fade(1, 0, 1000);
      setTimeout(() => {
        audio.stop(); // Stop the audio to reset it to the beginning
        setIsPlaying(false);
      }, 1000);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const play = () => {
    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    audio.fade(1, 0, 1000);
    setTimeout(() => {
      audio.stop();
      setIsPlaying(false);
    }, 1000);
  };

  useEffect(() => {
    audio.on('end', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.off('end');
    };
  }, [audio]);

  return {
    isPlaying,
    play,
    pause,
    stop,
    playPauseSong,
    playStopSong
  };
};

export default useAudio;