import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../static/css/Room.css"

const Room = () => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { roomCode } = useParams();

    useEffect(() => {
        const getRoomDetails = async () => {
            try {
                const response = await fetch("/api/get-room" + "?code=" + roomCode);
                if (!response.ok) {
                    throw new Error("Room not found. Please check the code.");
                }
                const data = await response.json();
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            } catch (error) {
                console.error("Failed to fetch room details:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getRoomDetails();
    }, [roomCode]);

    if (loading) {
        // We add the className here as well for consistent background
        return <div className="room-container">Loading...</div>;
    }

    if (error) {
        return <div className="room-container">Error: {error}</div>;
    }

    return (
        <div className="room-container">
            <div className="room-card">
                <h3>{roomCode}</h3>
                <p>
                    Votes To Skip: <span>{votesToSkip}</span>
                </p>
                <p>
                    Guest Can Pause: <span>{guestCanPause.toString()}</span>
                </p>
                <p>
                    You are the Host: <span>{isHost.toString()}</span>
                </p>
            </div>
        </div>
    );
};

export default Room;