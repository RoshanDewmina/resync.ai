import axios from 'axios';
import * as cheerio from 'cheerio';

export const getFavicon = async (url: string): Promise<string | null> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const favicon = $('link[rel="icon"]').attr('href');
    if (favicon) {
      if (favicon.startsWith('http')) {
        return favicon;
      }
      return new URL(favicon, url).href;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch favicon for ${url}:`, error);
    return null;
  }
};
