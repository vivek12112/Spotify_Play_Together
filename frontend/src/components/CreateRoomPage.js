import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link, useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const defaultVotes = 2;

  // State management with useState hook
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

  // Event Handlers
  const handleVotesChange = (e) => {
    // Ensure input is a valid number, prevent NaN
    const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    if (value === '' || (Number.isInteger(value) && value >= 1)) {
      setVotesToSkip(value);
    }
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = () => {
    // Prevent submission if votes field is empty
    if (votesToSkip === '') return;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Automatically navigate to the new room page
        if (data && data.code) {
          navigate(`/room/${data.code}`);
        }
      })
      .catch((error) => {
        // Handle API errors
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <Grid container spacing={2} direction="column" alignItems="center" sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography component="h4" variant="h4" align="center">
          Create A Room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormHelperText sx={{ textAlign: "center" }}>
            Guest Control of Playback State
          </FormHelperText>
          <RadioGroup
            row
            defaultValue="true"
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip} // Controlled component
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText sx={{ textAlign: "center" }}>
            Votes Required To Skip Song
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleRoomButtonPressed}
          disabled={votesToSkip === ''} // Disable button if input is invalid
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}