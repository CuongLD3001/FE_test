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
