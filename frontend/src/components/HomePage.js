// src/components/HomePage.js

import React, { useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, Navigate } from "react-router-dom";

export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null);

    // This hook runs once when the component loads to check if the user is in a room.
    useEffect(() => {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                setRoomCode(data.code);
            });
    }, []); // The empty array ensures this effect runs only once.

    // If a roomCode is found, this Navigate component tells the main router in App.js
    // to change the URL, which will then render the <Room /> component.
    if (roomCode) {
        return <Navigate to={`/room/${roomCode}`} />;
    }

    // Otherwise, if there's no room code, show the default home page.
    return (    
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" component="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={Link}>
                        Join a Room
                    </Button>
                    <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}