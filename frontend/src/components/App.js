// src/components/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

// Create a light theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    // Provide the theme to the entire app
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicks off a baseline of styles, including background color */}
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/room/:roomCode" element={<Room />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;