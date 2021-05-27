/* eslint-disable no-console */
// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  IconButton,
} from "@material-ui/core";
import Title from "../../components/Title";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import {
  ChatBubbleRounded,
  CallRounded,
  VideocamRounded,
} from "@material-ui/icons";

import "./ContactsWrapper.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";
import { searchContacts } from "../../api";
import { getAttendeeImage } from "../../utils/ImageHelper";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const ContactsWrapper = ({ user }) => {
  const classes = useStyles();

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const contacts = await searchContacts("");
      console.log("contacts", contacts);
      setContacts(contacts);
    };

    fetchContacts();
  }, []);

  return (
    // <>
    //   <div className="channel-list-wrapper">
    //     {/* <div className="channel-list-header">
    //       <div className="channel-list-header-title">Chat</div>
    //     </div> */}
    //     <div style={{ width: 300, paddingLeft: "8px" }}>
    //       <Autocomplete
    //         id="free-solo-demo"
    //         freeSolo
    //         options={contacts.map((option) => option.domainId)}
    //         renderInput={(params) => (
    //           <TextField
    //             {...params}
    //             label="Search Contacts"
    //             margin="normal"
    //             variant="outlined"
    //           />
    //         )}
    //       />
    //     </div>
    //     <List className={classes.root}>
    //       {contacts ? (
    //         contacts.map((contact) => (
    //           <ListItem
    //             key={contact.domainId}
    //             onClick={(e) => {
    //               //create conversation
    //               // setActiveConversation(null);
    //             }}
    //           >
    //             <ListItemAvatar>
    //               <Avatar
    //                 src={getAttendeeImage(contact.domainId, "alternate")}
    //                 style={{ alignSelf: "flex-end" }}
    //               />
    //             </ListItemAvatar>
    //             <ListItemText
    //               primary={`${contact.lastName}, ${contact.firstName}`}
    //               // secondary="Jan 9, 2014"
    //             />
    //           </ListItem>
    //         ))
    //       ) : (
    //         <ListItem>
    //           <ListItemAvatar>
    //             <Avatar>
    //               <PersonRounded />
    //             </Avatar>
    //           </ListItemAvatar>
    //           <ListItemText
    //             primary="Loading"
    //             // secondary="Jan 9, 2014"
    //           />
    //         </ListItem>
    //       )}
    //     </List>
    //   </div>
    // </>
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <React.Fragment>
          <Title>Contacts</Title>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={contacts.map((option) => option.domainId)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Contacts"
                margin="normal"
                variant="outlined"
              />
            )}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell>Date</TableCell>
                <TableCell align="right">Sale Amount</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.domainId}>
                  <TableCell>
                    {/* <div style={{ display: "flex" }}>
                      <Avatar
                        src={getAttendeeImage(contact.domainId, "alternate")}
                      /> */}
                    {`${contact.lastName}, ${contact.firstName}`}
                    {/* </div> */}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" aria-label="chat">
                      <ChatBubbleRounded />
                    </IconButton>
                    <IconButton color="primary" aria-label="call">
                      <CallRounded />
                    </IconButton>
                    <IconButton color="primary" aria-label="video-call">
                      <VideocamRounded />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={classes.seeMore}>
            {/* <Link color="primary" href="#" onClick={preventDefault}>
              See more orders
            </Link> */}
          </div>
        </React.Fragment>
      </Paper>
    </Grid>
  );
};

export default ContactsWrapper;
