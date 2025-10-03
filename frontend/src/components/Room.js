// src/components/Room.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room() {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });
  const [song, setSong] = useState(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const getRoomDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        navigate("/");
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
    }
  }, [roomCode, navigate]);

  const authenticateSpotify = useCallback(async () => {
    try {
      const authResponse = await fetch("/spotify/is-authenticated");
      const authData = await authResponse.json();
      setSpotifyAuthenticated(authData.status);
      if (!authData.status) {
        const urlResponse = await fetch("/spotify/get-auth-url");
        const urlData = await urlResponse.json();
        window.location.replace(urlData.url);
      }
    } catch (error) {
      console.error("Spotify authentication failed:", error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getRoomDetails().finally(() => setLoading(false));
  }, [getRoomDetails]);

  useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const response = await fetch("/spotify/current-song");
        if (response.ok) {
          const data = await response.json();
          setSong(data);
        } else {
          setSong(null);
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }
    };
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roomDetails.isHost) {
      authenticateSpotify();
    }
  }, [roomDetails.isHost, authenticateSpotify]);

  const leaveButtonPressed = async () => {
    await fetch("/api/leave-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    navigate("/");
  };

  const handleUpdateCallback = () => {
    setShowSettings(false);
    getRoomDetails();
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      <Grid xs={12} sx={{ textAlign: 'center' }}>
        <CreateRoomPage
          update={true}
          roomCode={roomCode}
          initialVotesToSkip={roomDetails.votesToSkip}
          initialGuestCanPause={roomDetails.guestCanPause}
          updateCallback={handleUpdateCallback}
        />
      </Grid>
      <Grid xs={12} sx={{ textAlign: 'center' }}>
        <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderRoom = () => (
    <Grid container spacing={3} sx={{ alignItems: 'center', flexDirection: 'column', mt: 2 }}>
      <Grid xs={12}>
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid xs={12} sx={{ width: '100%', maxWidth: 400 }}>
        <MusicPlayer
          {...song}
          votes={song?.votes}
          votes_required={roomDetails.votesToSkip}
        />
      </Grid>
      {roomDetails.isHost && (
        <Grid xs={12} sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      )}
      <Grid xs={12} sx={{ mt: 1 }}>
        <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>;
  }

  return showSettings ? renderSettings() : renderRoom();
}