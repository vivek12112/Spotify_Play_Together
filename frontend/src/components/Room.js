// src/components/Room.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

export default function Room() {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        navigate("/"); // Redirect home if room doesn't exist
        return;
      }
      const data = await response.json();
      setRoomDetails({
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      });
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    } finally {
        setLoading(false);
    }
  };

  // Fetch room details when component mounts or roomCode changes
  useEffect(() => {
    getRoomDetails();
  }, [roomCode]);

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/api/leave-room", requestOptions);
    navigate("/");
  };
  
  const handleUpdateCallback = () => {
    getRoomDetails(); // Refetch details after an update
    setShowSettings(false); // Close the settings view
  };

  const renderSettings = () => (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item xs={12}>
        <CreateRoomPage
          update={true}
          roomCode={roomCode}
          initialVotesToSkip={roomDetails.votesToSkip}
          initialGuestCanPause={roomDetails.guestCanPause}
          updateCallback={handleUpdateCallback}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderRoom = () => (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Votes to Skip: {roomDetails.votesToSkip}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          Guest Can Pause: {roomDetails.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Host: {roomDetails.isHost.toString()}</Typography>
      </Grid>
      {roomDetails.isHost && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return showSettings ? renderSettings() : renderRoom();
}