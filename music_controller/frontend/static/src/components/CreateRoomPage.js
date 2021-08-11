import React from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Collapse,
} from "@material-ui/core";

import {Alert} from "@material-ui/lab";

import { useState } from "react";
import { Link } from "react-router-dom";

const CreateRoomPage = (props) => {
  let defaultProps = {
    votesToSkip: props.votesToSkip ? props.votesToSkip : 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  let defaultMsg = {
    successMsg: "",
    errorMsg: "",
  };

  const [updateMsg, setUpdateMsg] = useState(defaultMsg);
  const [guestCanPause, pauseFn] = useState(defaultProps.guestCanPause);
  const [votesToSkip, skipFn] = useState(defaultProps.votesToSkip);

  const handleVotesChange = (e) => {
    skipFn(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    pauseFn(e.target.value === "true" ? true : false);
  };

  const handleButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => props.history.push("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.code,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setUpdateMsg({ successMsg: "Room Updated successfully" });
      } else {
        setUpdateMsg({ errorMsg: "Oh oh something goes wrong" });
      }
      
    });
    props.updateCallback();
  };

  const title = props.update ? "Update Room" : "Create a Room";

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={updateMsg?.errorMsg != "" || updateMsg?.successMsg != ""}>
          {updateMsg?.successMsg != "" ? (
            <Alert severity="success" onClose={()=>{setUpdateMsg({successMsg:""})}}>{updateMsg?.successMsg}</Alert>
          ) : (
            <Alert severity="error" onClose={()=>{setUpdateMsg({errorMsg:""})}}>{updateMsg?.errorMsg}</Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause ? props.guestCanPause?.toString() : "true"}
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
              label="No control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            onChange={handleVotesChange}
            required={true}
            type="number"
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
