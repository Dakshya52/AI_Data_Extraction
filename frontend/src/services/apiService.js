import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ai-data-extraction.onrender.com', // Change to your backend URL https://ai-data-extraction.onrender.com
});

export default instance;
