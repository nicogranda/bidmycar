import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useState, useEffect } from "react";

export default function useFFmpeg() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const ff = new FFmpeg({ log: true });
      await ff.load();
      setFfmpeg(ff);
      setReady(true);
    };
    load();
  }, []);

  return { ffmpeg, ready };
}
