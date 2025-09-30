// src/components/Room.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer"; // Import the modernized component

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

  // Effect to fetch initial room details when the component mounts.
  useEffect(() => {
    const getRoomDetails = async () => {
      // ... (This function remains unchanged)
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    getRoomDetails();
  }, [roomCode, navigate]);

  // Effect for polling the current song every second
  useEffect(() => {
    const getCurrentSong = async () => {
      try {
        const response = await fetch("/spotify/current-song");
        if (response.ok) {
          const data = await response.json();
          setSong(data);
        } else {
          setSong(null); // Clear song data if nothing is playing
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }
    };

    const interval = setInterval(getCurrentSong, 1000);

    // This is a cleanup function that React runs when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty array means this effect runs once on mount

  // Effect to handle Spotify authentication *after* we confirm the user is the host.
  useEffect(() => {
    if (roomDetails.isHost) {
      authenticateSpotify();
    }
  }, [roomDetails.isHost, authenticateSpotify]);

  const leaveButtonPressed = async () => {
    // ... (This function remains unchanged)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/api/leave-room", requestOptions);
    navigate("/");
  };

  const playPauseSong = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    await fetch(`/spotify/${song.is_playing ? 'pause' : 'play'}`, requestOptions);
  };

  const skipSong = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/spotify/skip", requestOptions);
  };

  const handleUpdateCallback = () => {
    // ... (This function remains unchanged)
    setShowSettings(false);
  };

  const renderSettings = () => (
    // ... (This JSX remains unchanged)
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
    <Grid container spacing={3} alignItems="center" direction="column">
      <Grid item xs={12}>
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ width: '100%', maxWidth: 400 }}>
        {/* Pass song data and control functions to the MusicPlayer */}
        <MusicPlayer {...song} onPlayPause={playPauseSong} onSkip={skipSong} />
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