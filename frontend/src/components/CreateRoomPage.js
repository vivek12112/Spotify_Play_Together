// src/components/CreateRoomPage.js

import React, { useState, useEffect } from "react";
import {
  Button, Grid, Typography, TextField, FormHelperText,
  FormControl, RadioGroup, Radio, FormControlLabel, Collapse, Alert
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function CreateRoomPage({
  update = false,
  roomCode = null,
  initialVotesToSkip = 2,
  initialGuestCanPause = true,
  updateCallback = () => { },
}) {
  const navigate = useNavigate();
  const [guestCanPause, setGuestCanPause] = useState(initialGuestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(initialVotesToSkip);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (update) {
      setGuestCanPause(initialGuestCanPause);
      setVotesToSkip(initialVotesToSkip);
    }
  }, [update, initialGuestCanPause, initialVotesToSkip]);

  const handleVotesChange = (e) => {
    setVotesToSkip(parseInt(e.target.value, 10));
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleCreateRoom = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    try {
      const response = await fetch("/api/create-room", requestOptions);
      if (!response.ok) throw new Error("Failed to create room.");
      const data = await response.json();
      navigate(`/room/${data.code}`);
    } catch (error) {
      console.error("Creation error:", error);
    }
  };

  const handleUpdateRoom = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    try {
      const response = await fetch("/api/update-room", requestOptions);
      if (response.ok) {
        setSuccessMsg("Room updated successfully!");
        updateCallback();
      } else {
        setErrorMsg("Error updating room...");
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.");
    }
  };

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1} sx={{ textAlign: 'center', mt: 2 }}>
      <Grid xs={12}>
        <Collapse in={errorMsg !== "" || successMsg !== ""}>
          {successMsg !== "" ? (
            <Alert severity="success" onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid xs={12}>
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid xs={12}>
        <FormControl component="fieldset">
          <FormHelperText sx={{ textAlign: "center" }}>
            Guest Control of Playback State
          </FormHelperText>
          <RadioGroup row value={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
            <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" />
            <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
          />
          <FormHelperText sx={{ textAlign: "center" }}>
            Votes Required To Skip Song
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <Button color="primary" variant="contained" onClick={update ? handleUpdateRoom : handleCreateRoom}>
          {update ? "Update Room" : "Create A Room"}
        </Button>
      </Grid>
      {!update && (
        <Grid xs={12}>
          <Button color="secondary" variant="contained" component={Link} to="/">
            Back
          </Button>
        </Grid>
      )}
    </Grid>
  );
}