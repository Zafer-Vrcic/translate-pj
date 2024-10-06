import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { options } from "../../constant";

// Thunk action to fetch languages
export const getLanguages = createAsyncThunk(
  "translate/getLanguages",
  async () => {
    const res = await axios.request(options);
    return res.data.data.languages; // Ensure this matches the API response structure
  }
);

// Thunk action to translate text
export const translateText = createAsyncThunk(
  "translate/text",
  async ({ text, sourceLang, targetLang }, { rejectWithValue }) => {
    try {
      // Create form data
     

      const params = new URLSearchParams();
      params.set('source_language',  sourceLang.value);
      params.set('target_language', targetLang.value);
      params.set('text', text);
      
      const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
          'x-rapidapi-key': '99443c7fa8mshfc16044f109f8ddp1ab3f8jsn9e4cbbd0582b',
          'x-rapidapi-host': 'text-translator2.p.rapidapi.com',
        },
        data: params,
      };

      // Await the axios request
      const res = await axios.request(options);
      
      // Return the translated text from the response
      return res.data.data.translatedText; // Ensure the key is correct based on API response
    } catch (error) {
      // Handle any error
      return rejectWithValue(error.response?.data?.message || "Translation failed");
    }
  }
);
