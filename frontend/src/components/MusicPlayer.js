// src/components/MusicPlayer.js

import React from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
    Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export default function MusicPlayer({
    image_url,
    title,
    artist,
    is_playing,
    time,
    duration,
}) {
    const songProgress = (time / duration) * 100;

    // Define API call functions directly inside the component
    const playSong = async () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        await fetch("/spotify/play", requestOptions);
    };

    const pauseSong = async () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        await fetch("/spotify/pause", requestOptions);
    };

    const skipSong = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        await fetch("/spotify/skip", requestOptions);
    };

    // Render nothing if there's no song title
    if (!title) {
        return null;
    }

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item xs={4}>
                    <img src={image_url} alt={`${title} album art`} height="100%" width="100%" />
                </Grid>
                <Grid item xs={8} sx={{ textAlign: "center" }}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <Box>
                        <IconButton onClick={() => (is_playing ? pauseSong() : playSong())}>
                            {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={skipSong}>
                            <SkipNextIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}