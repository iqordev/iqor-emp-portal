import axios from "axios";

axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("@accessToken");
    console.log("accessToken", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const getToken = async (email) => {
  const params = new URLSearchParams();
  params.append("domainId", email);
  params.append("clientSecret", "e4f3958c-48e0-4aa9-87f1-cad1f420fc52");

  const response = await axios.post(
    `https://iqormobpushnotif-development.azurewebsites.net/api/token`,
    params
  );

  const { data } = response;

  localStorage.setItem("@accessToken", data.token);

  console.log(data);
  return data.chatToken;
};

export const getUser = async () => {
  return axios
    .get(`https://iqormobpushnotif-development.azurewebsites.net/api/user`)
    .then((res) => res.data)
    .catch((err) => console.error("[MeetingScreen]: ", err));
};

export const startCall = async (currentMeetingId) => {
  axios
    .post(
      `https://iqormobpushnotif-development.azurewebsites.net/api/aws/video/call/${currentMeetingId}`,
      {
        mode: "video", //video only for testing
      }
    )
    .catch((err) => console.error("[MeetingScreen]: ", err));
};

// const SERVER_URL =
//   "https://eajgjboaf1.execute-api.us-east-1.amazonaws.com/Prod";
const SERVER_REGION = "us-east-1";

export function createMeetingRequest(meetingName, attendeeName) {
  let url = encodeURI(
    // SERVER_URL +
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
    // SERVER_URL +
    "/end?" + `title=${meetingName}&region=${SERVER_REGION}`
  );

  return fetch(url, { method: "POST" }).then((j) => {
    console.log(j);
    return j.json();
  });
}
