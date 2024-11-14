import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://aidataextractionbackend.netlify.app/', // Change to your backend URL
});

export default instance;
