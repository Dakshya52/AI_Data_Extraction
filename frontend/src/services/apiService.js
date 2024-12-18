import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // https://ai-data-extraction.onrender.com
});

export default instance;
