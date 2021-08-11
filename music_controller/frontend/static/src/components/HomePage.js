import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import RoomJoinPage from "./RoomJoinPage";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";

const HomePage = (props) => {
  const [roomCode, setRoomCode] = useState(null);
  useEffect(() => {
    (async () => {
      await fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
          setRoomCode(data.code);
        });
    })();
  }, []);

  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return roomCode ? (
              <Redirect to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            );
          }}
        />
        <Route path="/join" component={RoomJoinPage} />
        <Route path="/create" component={CreateRoomPage} />
        <Route
          path="/room/:roomCode"
          render={(props) => {
            return <Room {...props} leaveRoomCallback={clearRoomCode} />;
          }}
        />
      </Switch>
    </Router>
  );
};

export default HomePage;
