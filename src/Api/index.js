import axios from "axios";
// Travel Advisor API


const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

export const graphQLFetch = async (query, variables = {}) => {
  try {
    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

export const getPlacesData = async (type, sw, ne) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
        },
        headers: {
          "x-rapidapi-key":
            "187f2de195msh3ff1117efda93acp16e500jsn8e5ddb60b874",
          "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get(`https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lng}`, {
        headers: {
          'X-RapidAPI-Key': "187f2de195msh3ff1117efda93acp16e500jsn8e5ddb60b874",
          'X-RapidAPI-Host': "open-weather13.p.rapidapi.com",
        },
      });
      return data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ***Imp: Combined code for both search and details

const getPlaceDetails = async (fsq_id) => {
  const URL = `https://api.foursquare.com/v3/places/${fsq_id}`;
  const options = {
    headers: {
      accept: "application/json",
      Authorization: "fsq33kG609v4M0X2VJ2yWqJXDfcucEfJUS+cFyDON5q1hig=",
    },
    params: {
      fields: "email,website,rating,price,photos,stats,tel,tastes",
      //useful fields:
      //https://location.foursquare.com/developer/reference/response-fields#core-data-fields
      //email,tel,website,stats,rating,popularity,price,menu,photos,tips,tastes,name
    },
  };

  try {
    const { data } = await axios.get(URL, options);
    return data;
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
};

export const getFourSquarePlacesData = async (advparams, sw, ne) => {
  try {
    const searchURL = "https://api.foursquare.com/v3/places/search";
    const searchOptions = {
      headers: {
        accept: "application/json",
        Authorization: "fsq33kG609v4M0X2VJ2yWqJXDfcucEfJUS+cFyDON5q1hig=",
      },
      params: {
        // ll: "13.0820699873036,80.27152061462404",
        ne: `${ne.lat},${ne.lng}`,
        sw: `${sw.lat},${sw.lng}`,
        categories: advparams,
        limit: 25,
      },
    };
    const { data } = await axios.get(searchURL, searchOptions);
    const places = data.results;

    const detailsPromises = places.map((place) =>
      getPlaceDetails(place.fsq_id)
    );
    const detailsResults = await Promise.all(detailsPromises);

    const combinedData = places.map((place, index) => ({
      ...place,
      details: detailsResults[index],
    }));

    console.log(combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error fetching data from FourSquare:", error);
  }
};

export const generateItinerary = async (places) => {
  const apiKey = ""; #Replace your api key here
  const messages = [
    {
      role: "system",
      content: "You are a knowledgeable travel guide.",
    },
    {
      role: "user",
      content: `Generate a detailed itinerary for a trip to the places: ${places} along with each place location. Include places to visit, activities, and dining options. Return in this format: {
      "DAY 1": [
        { id: "day1-1", content: "City Tour", time: "9 AM", lat: 13.0820699873036, lng: 80.27152061462404 },
        { id: "day1-2", content: "Museum Visit", time: "11 AM, lat: 13.0820699873036, lng: 80.27152061462404" },
        .....
      ],
      "DAY 2": [
        { id: "day2-1", content: "Hiking Adventure", time: "8 AM", lat: 13.0820699873036, lng: 80.27152061462404 },
      ],... add so on and also in JSON format`,
    },
  ];
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    console.log(response.data.choices[0].message.content); // Access the generated text
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI Chat API:", error);
    return null;
  }
};

export const fetchLatLong = async (place) => {
  const apiKey = ""; #Replace api key here
  const messages = [
    {
      role: "system",
      content: "You are a knowledgeable travel guide.",
    },
    {
      role: "user",
      content: `Get me the lat and long for : ${place}. Return in this format if relevant lat long is found: 
      {
        "lat": 51.508112,
        "lng": -0.075949
      },
      But if a place is not found or if place is too generic and could refer to a variety of locations, return
    {
      "lat": na,
      "lng": na,
    }`,
    },
  ];
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    console.log(response.data.choices[0].message.content); // Access the generated text
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI Chat API:", error);
    return "no lat and long";
  }
};

export const getPlaceFromOnLatLng = async (lat,lng) => {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDxbSZfui-9zzyJjDb-7mrBYcKj-mwcuLA`;
    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.results[0]) {
        return response.data.results[0].formatted_address;
      } else {
        return "No address found";
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Error retrieving address';
    }
  };
