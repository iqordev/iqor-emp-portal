import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { PersonAdd as PersonAddIcon } from "@material-ui/icons";

import { saveContacts, searchAvailableContacts } from "../../api";
import { useHistory } from "react-router";
import { useContactContext } from "../../providers/ContactsProvider";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "0px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

export default function AddContactModal({ open, handleClose }) {
  const classes = useStyles();
  const { history } = useHistory();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const [modalStyle] = React.useState(getModalStyle);

  const { onSaveContacts } = useContactContext();

  // avail contact to add different from contacct provider
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    const fetchAvailableContacts = async () => {
      const result = await searchAvailableContacts("");
      console.log(result);
      setContacts(result);
    };

    fetchAvailableContacts();
    return () => {};
  }, []);

  const onSave = () => {
    onSaveContacts(selectedContacts);
    handleClose();
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Autocomplete
        multiple
        id="tags-standard"
        options={contacts.map((option) => option.domainId)}
        onChange={(event, value) => {
          setSelectedContacts(value);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Contacts:" placeholder="Contacts" />
        )}
      />
      <AddContactModal />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        fullWidth
        endIcon={<PersonAddIcon />}
        onClick={onSave}
      >
        Add
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}
