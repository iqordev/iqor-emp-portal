// import RNFetchBlob from "rn-fetch-blob";
// import { AZURE } from "../constants/provider";
import { randomColor } from "./randomColor";
// const fs = RNFetchBlob.fs;

// import { AuthManager } from "../services/auth/AuthManager";
import { getNameWithDomainId } from "./identityHelper";

// const config = RNFetchBlob.config({
//   fileCache: true,
// });

// const graphAPI = "https://graph.microsoft.com/v1.0";

// export const getCurrentUserImage = async () => {
//   try {
//     const { accessToken } = await AuthManager.getAccessTokenAsync();

//     const resp = await config.fetch("GET", `${graphAPI}/me/photo/$value`, {
//       ["Authorization"]: `Bearer ${accessToken}`,
//     });

//     if (resp.respInfo.status === 200) {
//       const base64 = await resp.readFile("base64");
//       return base64;
//     }

//     console.log("[ImageHelper] getCurrentUserImage:", resp.respInfo.status);
//   } catch (error) {
//     console.log("[ImageHelper] getCurrentUserImage:", error);
//   }

//   return null;
// };

// export const getUserImage = async (upn) => {
//   try {
//     const { accessToken } = await AuthManager.getAccessTokenAsync();

//     const resp = await config.fetch(
//       "GET",
//       `${graphAPI}/users/${upn}/photo/$value`,
//       {
//         ["Authorization"]: `Bearer ${accessToken}`,
//       }
//     );

//     if (resp.respInfo.status === 200) {
//       const base64 = await resp.readFile("base64");
//       return base64;
//     }

//     console.log("[ImageHelper] getUserImage:", resp.respInfo.status);
//   } catch (error) {
//     console.log("[ImageHelper] getUserImage:", error);
//   }
//   return null;
// };

export const getAttendeeImage = (domainId, provider) => {
  // if (provider === AZURE) {
  //   return `${await getUserImage(`${domainId}@iqor.com`)}`;
  // } else {
  const [firstName, lastName] = getNameWithDomainId(domainId);
  const [backgroundColor, fontColor] = randomColor(lastName);
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${backgroundColor}&color=${fontColor}&font-size=0.38&rounded=true&bold=true`;
  // }
};
