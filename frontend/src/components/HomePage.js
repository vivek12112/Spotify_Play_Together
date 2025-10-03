// src/components/HomePage.js

import React, { useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, Navigate } from "react-router-dom";

export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserInRoom = async () => {
            try {
                const response = await fetch("/api/user-in-room");
                const data = await response.json();
                setRoomCode(data.code);
            } catch (error) {
                console.error("Error checking room status:", error);
            } finally {
                setLoading(false);
            }
        };
        checkUserInRoom();
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (roomCode) {
        return <Navigate to={`/room/${roomCode}`} />;
    }

    return (
        <Grid container spacing={3} sx={{ textAlign: 'center', mt: 4 }}>
            <Grid xs={12}>
                <Typography variant="h3" component="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid xs={12}>
                <ButtonGroup disableElevation variant="contained">
                    <Button color="primary" component={Link} to="/join">
                        Join a Room
                    </Button>
                    <Button color="secondary" component={Link} to="/create">
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}