// src/components/Room.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

export default function Room() {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  // This function checks if the host is authenticated with Spotify.
  // If not, it redirects them to the Spotify login page.
  // useCallback is used to prevent this function from being recreated on every render.
  const authenticateSpotify = useCallback(async () => {
    try {
      const authResponse = await fetch("/spotify/is-authenticated");
      const authData = await authResponse.json();
      setSpotifyAuthenticated(authData.status);

      if (!authData.status) {
        const urlResponse = await fetch("/spotify/get-auth-url");
        const urlData = await urlResponse.json();
        // Redirect the user to the Spotify authorization page
        window.location.replace(urlData.url);
      }
    } catch (error) {
      console.error("Spotify authentication failed:", error);
    }
  }, []);

  // Effect to fetch initial room details when the component mounts.
  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        setLoading(true);
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

    getRoomDetails();
  }, [roomCode, navigate]);

  // Effect to handle Spotify authentication *after* we confirm the user is the host.
  useEffect(() => {
    if (roomDetails.isHost) {
      authenticateSpotify();
    }
  }, [roomDetails.isHost, authenticateSpotify]);

  const leaveButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/api/leave-room", requestOptions);
    navigate("/");
  };

  const handleUpdateCallback = () => {
    // Re-fetch details after an update. We can reuse the effect by just re-rendering.
    // For simplicity, we can just call getRoomDetails again or let the state update trigger it.
    // For now, let's just close the settings view.
    setShowSettings(false);
    // You might want to re-trigger getRoomDetails here if settings affect display immediately.
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
      {/* The rest of the UI remains unchanged */}
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
