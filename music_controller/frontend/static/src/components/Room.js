import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

const Room = (props) => {
  let initialRoomState = {
    guest_can_pause: false,
    votes_to_skip: 2,
    isHost: false,
    showSettings: false,
    spotifyAuth: false,
  };
  const [roomInfo, setRoomInfo] = useState(initialRoomState);
  const params = useParams();
  let teste = true;

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + params.roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          props.history.push("/");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomInfo({...roomInfo,
          votes_to_skip: data.votes_to_skip,
          guest_can_pause: data.guest_can_pause,
          isHost: data.is_host,
        });

        return data;
      });
  };

  useEffect(() => {
    let data = getRoomDetails();
    teste = false
    // setRoomInfo({
    //   votes_to_skip: data.votes_to_skip,
    //   guest_can_pause: data.guest_can_pause,
    //   isHost: data.is_host,
    // });
  }, []);

  useEffect(()=>{
    if(roomInfo.isHost){
      authenticateSpotify()
    }
  },[roomInfo.isHost])

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomInfo({...roomInfo, spotifyAuth: data.status });
        console.log("status", data);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              console.log("get auth", data);
              //window.location.replace(data.url);
            });
        }
      });
  };

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: roomInfo.votes_to_skip,
        guest_can_pause: roomInfo.guest_can_pause,
      }),
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.history.push("/");
    });
  };

  const updateShowSettings = (value) => {
    setRoomInfo({
      ...roomInfo,
      showSettings: value,
    });
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomInfo.votes_to_skip}
            guestCanPause={roomInfo.guest_can_pause}
            code={params.roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  if (roomInfo.showSettings) {
    return renderSettings();
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {params.roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes to skip: {roomInfo.votes_to_skip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest can pause: {roomInfo.guest_can_pause?.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Is Host: {roomInfo.isHost?.toString()}
        </Typography>
      </Grid>
      {roomInfo.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={leaveButtonPressed}
        >
          Leave room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;

/*
<div>
            <h3>{params.roomCode}</h3>
            <p>Guest can pause: {roomInfo.guest_can_pause.toString()}</p>
            <p>Votes to skip: {roomInfo.votes_to_skip}</p>
            <p>Is Host: {roomInfo.isHost.toString()}</p>
        </div>
*/
