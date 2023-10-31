import axios from "axios";

const API_URL = process.env.REACT_APP_GPT_SVR_URL;

export async function translateText(inputData: string) {
  try {
    console.log(`Generating dialog: ${JSON.stringify(inputData)}`);

    const requestData = {
      source: "en",
      target: "ko",
      text: inputData
    };

    const response = await axios.post(`${API_URL}/gpt/translate-text`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      const dialogResult = response.data;
      console.log(`Dialog generation successful: ${JSON.stringify(dialogResult)}`);
      return dialogResult;
    } else {
      console.error(`Unexpected response code: ${response.status}`);
      return { error: `Error code: ${response.status}` };
    }

  } catch (error) {
    if (error.response) {
      console.error(`Server responded with error code: ${error.response.status}`);
      console.error(`Error data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received from the server");
      console.error(`Request was: ${JSON.stringify(error.request)}`);
    } else {
      console.error("Error", error.message);
    }

    return { error: "An error occurred" };
  }
}
