import axios from 'axios';

//centralized axios instance to make API requests
const api = axios.create({

  baseURL:'https://collectionappwithjira.onrender.com', // Fallback to localhost if env var is not set
  withCredentials: true,
  

});

export default api;
