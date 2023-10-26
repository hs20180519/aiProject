import axios from "axios";
import {
  InputGrammarData,
  GrammarResponse,
  InputDialogData,
  DialogResponse,
  HTTPValidationError,
} from "./new_gpt_interface";

const { REACT_APP_GPT_URL: baseURL, REACT_APP_GPT_TOKEN: token } = process.env;

const instance = axios.create({
  baseURL,
  headers: {
    "x-token": token,
    "Content-Type": "application/json",
  },
});

class FetchGpt {
  static async getGrammar(params: InputGrammarData): Promise<GrammarResponse> {
    const url = "/explain-grammar";
    try {
      const response = await instance.post<GrammarResponse>(url, params);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const errData: HTTPValidationError = error.response.data;
        console.error("HTTP Validation Errors:", errData.detail.map((e) => e.msg).join(", "));
      }
      throw error;
    }
  }

  static async getScript(params: InputDialogData): Promise<DialogResponse> {
    const url = "/generate-dialog";
    try {
      const response = await instance.post<DialogResponse>(url, params);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        const errData: HTTPValidationError = error.response.data;
        console.error("HTTP Validation Errors:", errData.detail.map((e) => e.msg).join(", "));
      }
      throw error;
    }
  }
}

export { FetchGpt };
