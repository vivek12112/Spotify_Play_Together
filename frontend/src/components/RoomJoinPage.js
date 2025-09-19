import React, { useState } from "react";
// 👇 The imports have been updated to the MUI v5 syntax
import {
    TextField,
    Button,
    Grid,
    Typography,
    Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const RoomJoinPage = () => {
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
            console.error("There was an error joining the room:", error);
        }
    };

    return (
        <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            <Paper elevation={3} style={{ padding: "32px", borderRadius: "15px" }}>
                <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h4">
                            Join a Room
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ width: '100%' }}>
                        <TextField
                            error={!!error}
                            label="Code"
                            placeholder="Enter a Room Code"
                            value={roomCode}
                            helperText={error}
                            variant="outlined"
                            onChange={handleTextFieldChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={roomButtonPressed}
                        >
                            Enter Room
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            to="/"
                            component={Link}
                        >
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default RoomJoinPage;