// import Cookies from "js-cookie";

const axios = require("axios");

export async function fetchData(
  url,
  method = "GET",
  data = null,
  headers = {}
) {
  try {
    const response = await axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
// export async function refreshAccessToken() {
//   try {
//     const refreshToken = Cookies.get("refreshToken");
//     console.log(refreshToken);
//     const response = await axios.post(
//       "http://localhost:8000/auth/refresh-token",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${refreshToken}`,
//         },
//       }
//     );
//     return response.data.access_token;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
