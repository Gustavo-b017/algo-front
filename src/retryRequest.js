import axios from 'axios';

export async function retryRequest(url, attempts = 2) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (i === attempts - 1) {
        throw error;
      }
    }
  }
}