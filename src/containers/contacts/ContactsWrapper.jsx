/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from "react";

import {
  Button,
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
  PersonAdd as PersonAddIcon,
} from "@material-ui/icons";

import "./ContactsWrapper.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";
import { searchContacts } from "../../api";
import { getAttendeeImage } from "../../utils/ImageHelper";
import { useHistory } from "react-router";
import { CALL_TYPE } from "../../constants/CallType";
import { convertName } from "../../utils/nameHelper";
import { getUniqueName } from "../../utils/chatConversationHelper";
import AddContactModal from "./AddContactModal";

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

const ContactsWrapper = ({
  user,
  onTapContactChat,
  onSaveContacts,
  contacts,
}) => {
  const classes = useStyles();
  const history = useHistory();

  // const [contacts, setContacts] = useState([]);
  const [criteria, setCriteria] = useState("");

  //UI
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     const contacts = await searchContacts("");
  //     console.log("contacts", contacts);
  //     setContacts(contacts);
  //   };

  //   fetchContacts();
  // }, []);

  const filteredContacts = useMemo(() => {
    return criteria
      ? contacts.filter(
          (contact) =>
            contact.firstName.includes(criteria) ||
            contact.lastName.includes(criteria) ||
            contact.domainId.includes(criteria)
          // || contact.email.includes(criteria)
        )
      : contacts;
  }, [contacts, criteria]);

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <React.Fragment>
          {/* <Title>Contacts</Title> */}
          <Grid container justify="space-between">
            <Grid item>
              <Title>Contacts</Title>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                endIcon={<PersonAddIcon />}
                onClick={handleOpen}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={contacts.map((option) => option.domainId)}
            onInputChange={(event, value, reason) => {
              setCriteria(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Contacts"
                margin="normal"
                variant="outlined"
                placeholder="Contacts"
              />
            )}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.domainId}>
                  <TableCell>
                    {/* <div style={{ display: "flex" }}>
                      <Avatar
                        src={getAttendeeImage(contact.domainId, "alternate")}
                      /> */}
                    {`${contact.lastName}, ${contact.firstName}`}
                    {/* </div> */}
                  </TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      aria-label="chat"
                      disabled={!contact.hasAppInstalled}
                      onClick={() => {
                        onTapContactChat(contact);
                      }}
                    >
                      <ChatBubbleRounded />
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="call"
                      disabled={!contact.hasAppInstalled}
                      onClick={() => {
                        history.push("videocall", {
                          domainId: user.domainId,
                          notifiedIds: [contact.domainId],
                          mode: CALL_TYPE.CALL,
                        });
                      }}
                    >
                      <CallRounded />
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="video-call"
                      disabled={!contact.hasAppInstalled}
                      onClick={() => {
                        history.push("videocall", {
                          domainId: user.domainId,
                          notifiedIds: [contact.domainId],
                          mode: CALL_TYPE.VIDEO_CALL,
                        });
                      }}
                    >
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
        <AddContactModal open={open} handleClose={handleClose} onSaveContacts={onSaveContacts} />
      </Paper>
    </Grid>
  );
};

export default ContactsWrapper;
