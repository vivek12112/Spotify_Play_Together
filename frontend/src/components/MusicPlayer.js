// src/components/MusicPlayer.js

import React from "react";
import {
  Grid, Typography, Card, IconButton,
  LinearProgress, Box
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export default function MusicPlayer({
  image_url, title, artist, is_playing,
  time, duration, votes, votes_required
}) {
  const songProgress = duration > 0 ? (time / duration) * 100 : 0;

  const playSong = async () => {
    await fetch("/spotify/play", { method: "PUT", headers: { "Content-Type": "application/json" } });
  };

  const pauseSong = async () => {
    await fetch("/spotify/pause", { method: "PUT", headers: { "Content-Type": "application/json" } });
  };

  const skipSong = async () => {
    await fetch("/spotify/skip", { method: "POST", headers: { "Content-Type": "application/json" } });
  };

  if (!title) {
    return null;
  }

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid xs={4}>
          <img src={image_url} alt={`${title} album art`} height="100%" width="100%" />
        </Grid>
        <Grid xs={8} sx={{ textAlign: "center" }}>
          <Typography component="h5" variant="h5">{title}</Typography>
          <Typography color="textSecondary" variant="subtitle1">{artist}</Typography>
          <Box>
            <IconButton onClick={() => (is_playing ? pauseSong() : playSong())}>
              {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={skipSong}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {votes} / {votes_required}
              </Typography>
              <SkipNextIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}