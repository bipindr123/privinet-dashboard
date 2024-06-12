import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Handle autoplay (optional)
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
       <ReactPlayer
         url={videoUrl}
         playing={isPlaying}
         controls={true}
         onPlay={handlePlayPause}
         onPause={handlePlayPause}
         width="100%"
         height="auto"
       />
  );
};

export default VideoPlayer;
