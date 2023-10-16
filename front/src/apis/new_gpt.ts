import axios from "axios";
import {
  InputGrammarData,
  GrammarResponse,
  InputDialogData,
  DialogResponse,
  HTTPValidationError,
} from "./new_gpt_schema";

const baseURL = "http://34.64.215.129/python/api/gpt"
const token = "elice-ai-8-1-team"

const instance = axios.create({
  baseURL: baseURL,
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
