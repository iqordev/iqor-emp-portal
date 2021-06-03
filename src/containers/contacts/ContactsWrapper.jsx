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
  Checkbox,
} from "@material-ui/core";
import Title from "../../components/Title";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import {
  ChatBubbleRounded,
  CallRounded,
  VideocamRounded,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
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
import { useContactContext } from "../../providers/ContactsProvider";

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

const ContactsWrapper = ({ user, onTapContactChat }) => {
  const classes = useStyles();
  const history = useHistory();

  const { contacts, onSelectContact, onDeselectAllContact } =
    useContactContext();
  const [criteria, setCriteria] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  //UI
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              <div>
                {isEdit ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    endIcon={<DeleteIcon />}
                    onClick={() => {
                      setIsEdit(false);
                      onDeselectAllContact();
                    }}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    endIcon={<PersonAddIcon />}
                    onClick={handleOpen}
                  >
                    Add
                  </Button>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={isEdit ? <CancelIcon /> : <EditIcon />}
                  onClick={() => {
                    setIsEdit((prev) => !prev);

                    if (isEdit) {
                      onDeselectAllContact();
                    }
                  }}
                >
                  {isEdit ? "Cancel" : "Edit"}
                </Button>
              </div>
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
                {isEdit && <TableCell align="left"></TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Department Code</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.domainId}>
                  {isEdit && (
                    <TableCell align="left">
                      <Checkbox
                        checked={contact.isSelected ?? false}
                        onChange={() => onSelectContact(contact)}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    {`${contact.lastName}, ${contact.firstName}`}
                  </TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>{contact.departmentCode}</TableCell>
                  <TableCell>{contact.location}</TableCell>
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
        <AddContactModal open={open} handleClose={handleClose} />
      </Paper>
    </Grid>
  );
};

export default ContactsWrapper;
