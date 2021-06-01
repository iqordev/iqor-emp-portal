import axios from "axios";

const API_URL = "https://iqormobpushnotif-development.azurewebsites.net";

const instance = axios.create({
  baseURL: `${API_URL}/api`,
});

instance.interceptors.request.use(
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

export const getToken = async (domainId) => {
  const params = new URLSearchParams();
  params.append("domainId", domainId);
  params.append("clientSecret", "e4f3958c-48e0-4aa9-87f1-cad1f420fc52");

  const response = await instance.post("/token", params);

  const { data } = response;

  localStorage.setItem("@accessToken", data.token);

  // console.log(data);
  return data.chatToken;
};

export const signIn = async (userDTO) => {
  return instance
    .post("/user/signin/alternate", userDTO)
    .then((res) => res.data)
    .catch((err) => console.error("[signIn]: ", err));
};

export const getUser = async () => {
  return instance
    .get("/user")
    .then((res) => res.data)
    .catch((err) => console.error("[getUser]: ", err));
};

export const startCall = async (currentMeetingId, mode, domainIds) => {
  instance
    .post(`/aws/video/call/${currentMeetingId}`, {
      mode,
      domainIds,
    })
    .catch((err) => console.error("[MeetingScreen]: ", err));
};

export async function createMeetingRequest(meetingName, attendeeName) {
  const response = await instance.post("/aws/meeting", {
    meetingName,
    attendeeName,
  });

  console.log(response.data);
  return response.data;
}

export async function endMeetingRequest(meetingName) {
  const response = await instance.delete("/aws/meeting", {
    meetingName,
  });

  console.log(response.data);
  return response.data;
}

export const searchContacts = async (searchTerm) => {
  const response = await instance.get(`/user/contacts/search/${searchTerm}`);

  return response.data;
};

export default instance;
