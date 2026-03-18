import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api", // Every request will be made to this base URL, this makes it so that I dont have to write this every time I want to make a request.
  headers: {
    "Content-Type": "application/json", //Sending JSON.
    Accept: "application/json", //Want JSON back.
  },
});

// Automatically attach the saved token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;

//Without this file i would have to write the base URL and headers every time I want to make a request, this file allows me to just import api and make requests without worrying about the base URL and headers.
