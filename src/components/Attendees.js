import React, { useEffect, useState, useMemo } from "react";
import {
  MeetingProvider,
  useRosterState,
  Roster,
  RosterGroup,
  RosterAttendee,
  RosterHeader,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";

const Attendees = () => {
  const [criteria, setCriteria] = useState("");
  const { roster } = useRosterState();
  const attendees = Object.values(roster);


  const filteredAttendees = useMemo(() => {
    return criteria
      ? attendees.filter((attendee) =>
          attendee.externalUserId.includes(criteria)
        )
      : attendees;
  }, [attendees, criteria]);

  const attendeeItems = filteredAttendees.map((attendee) => {
    const { chimeAttendeeId, externalUserId } = attendee;
    const name = externalUserId.split("#")[1];
    return (
      <RosterAttendee
        key={chimeAttendeeId}
        attendeeId={chimeAttendeeId}
        name={name}
      />
    );
  });

  return (
    <Roster>
      <RosterHeader
        title="Present"
        badge={attendees.length}
        // onClose={() => setRosterTabToggle(true)}
        // searchValue={criteria}
        onSearch={(e) => {
          const newValue = e.target.value;
          console.log(newValue);
          setCriteria(newValue);
        }}
      />
      <RosterGroup>{attendeeItems}</RosterGroup>
    </Roster>
  );
};

export default Attendees;
