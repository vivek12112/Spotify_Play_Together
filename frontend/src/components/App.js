

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"; // Assuming this is your HomePage component
import RoomJoinPage from "./RoomJoinPage"; // Assuming this is your RoomJoinPage component
import CreateRoomPage from "./CreateRoomPage"; // Assuming this is your CreateRoomPage component
import Room from "./Room"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;