// src/components/RoomJoinPage.js

import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    };

    const roomButtonPressed = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: roomCode,
            }),
        };
        try {
            const response = await fetch("/api/join-room", requestOptions);
            if (response.ok) {
                navigate(`/room/${roomCode}`);
            } else {
                setError("Room not found.");
            }
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    return (
        <Grid container spacing={1} sx={{ textAlign: 'center', mt: 4 }}>
            <Grid xs={12}>
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid xs={12}>
                <TextField
                    error={!!error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={roomButtonPressed}
                >
                    Enter Room
                </Button>
            </Grid>
            <Grid xs={12}>
                <Button variant="contained" color="secondary" component={Link} to="/">
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}