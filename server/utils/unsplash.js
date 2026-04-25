import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function getDestinationImage(destination) {
  try {
    const response = await axios.get(
      'https://api.unsplash.com/search/photos',
      {
        params: {
          query: destination + ' travel landmark',
          per_page: 1,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const results = response.data.results;
    if (results && results.length > 0) {
      return results[0].urls.regular;
    }
    return null;
  } catch {
    return null;
  }
}
