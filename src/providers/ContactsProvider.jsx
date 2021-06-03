import React, { createContext, useState, useContext, useEffect } from "react";
import { searchContacts, saveContacts } from "../api";
import { useAuthContext } from "./AuthProvider";

const ContactContext = createContext();

const ContactProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  // Contact state
  const [contacts, setContacts] = useState([]);

  const onSaveContacts = async (selectedContacts) => {
    try {
      await saveContacts(selectedContacts);
      const updatedContacts = await searchContacts("");

      setContacts(updatedContacts);
    } catch (error) {
      console.error(error);
    }
  };

  const onSelectContact = (selectedContact) => {
    setContacts((prevState) =>
      prevState.map((contact) => {
        return contact.domainId === selectedContact.domainId
          ? { ...contact, isSelected: !contact.isSelected }
          : contact;
      })
    );
  };

  const onDeselectAllContact = () => {
    setContacts((prevState) =>
      prevState.map((contact) => ({ ...contact, isSelected: false }))
    );
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchContacts = async () => {
      const contacts = await searchContacts("");
      console.log("contacts", contacts);
      setContacts(contacts);
    };

    fetchContacts();
  }, [isAuthenticated]);

  const contactsFulfiller = {
    contacts,
    onSaveContacts,
    onSelectContact,
    onDeselectAllContact
  };

  return (
    <ContactContext.Provider value={contactsFulfiller}>
      {children}
    </ContactContext.Provider>
  );
};

const useContactContext = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error("useContactContext must be used within ContactProvider");
  }

  return context;
};

export { ContactProvider, useContactContext };
