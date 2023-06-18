import axios from 'axios';

const MAX_REQUESTS_PER_DAY = 50;
let requestCount = 0;

// Debounce function
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getPlacesData = async (type, sw, ne) => {
  if (requestCount >= MAX_REQUESTS_PER_DAY) {
    console.log('Request limit exceeded. Please try again tomorrow.');
    return;
  }

  try {
    const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
      // API request parameters
      params: {
        bl_latitude: sw.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
        tr_latitude: ne.lat,
      },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_TRAVEL_API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
      },
    });

    requestCount++; // Increment the request count
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Example usage: Debounce the API call for 500ms
const debouncedGetPlacesData = debounce(getPlacesData, 500);

// Call the debounced function when needed
debouncedGetPlacesData('restaurants', { lat: 37.1234, lng: -122.5678 }, { lat: 37.5678, lng: -122.1234 });
