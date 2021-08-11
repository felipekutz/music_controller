import React from 'react'
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
  } from "@material-ui/core";

  
import { Link } from "react-router-dom"
import { useState } from "react";

const RoomJoinPage = (props) =>{
    let initialCEState= {
        roomCode : "",
        error: "",
    }
    const [codeAndError, setCE ] = useState(initialCEState)

    const handleTextFieldChange = (e) =>{
        setCE({roomCode: e.target.value})
    }

    const roomButtonPressed = () => {
        const requestOptions ={
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: codeAndError.roomCode
            })
        }
        fetch('/api/join-room', requestOptions)
            .then((response)=>{
                if(response.ok){
                    props.history.push(`/room/${codeAndError.roomCode}`)
                }else{
                    setCE({error: "Room not found."})
                }
            }).catch((error)=>{
                console.log(error);
            })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={codeAndError.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={codeAndError.roomCode}
                    helperText={codeAndError.error}
                    variant="outlined"
                    onChange = {handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={roomButtonPressed}> 
                    Enter room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}> 
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}

export default RoomJoinPage;