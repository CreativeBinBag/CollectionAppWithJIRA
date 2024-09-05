import axios from 'axios';

//centralized axios instance to make API requests
const api = axios.create({

  baseURL:'https://collectionapp-4myu.onrender.com', // Fallback to localhost if env var is not set
  withCredentials: true,
  

});

export default api;
