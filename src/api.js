import axios from "axios";

export const getToken = async (email) => {
  const response = await axios.get(
    `https://iqormobpushnotif-development.azurewebsites.net/api/twilio/token/${email}`
  );
  const { data } = response;
  console.log(data);
  return data.jwt;
};

const SERVER_URL =
  "https://eajgjboaf1.execute-api.us-east-1.amazonaws.com/Prod";
const SERVER_REGION = "us-east-1";

export function createMeetingRequest(meetingName, attendeeName) {
  let url = encodeURI(
    SERVER_URL +
      "/join?" +
      `title=${meetingName}&name=${attendeeName}&region=${SERVER_REGION}`
  );

  return fetch(url, { method: "POST" }).then((j) => {
    console.log(j);
    return j.json();
  });
}

export function endMeetingRequest(meetingName) {
  let url = encodeURI(
    SERVER_URL + "/end?" + `title=${meetingName}&region=${SERVER_REGION}`
  );

  return fetch(url, { method: "POST" }).then((j) => {
    console.log(j);
    return j.json();
  });
}
