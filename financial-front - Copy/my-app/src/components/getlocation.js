import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StorLocator = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);

  // Define the function here
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error('Error getting location:', error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserLocation(); // Call the function here
  }, []);

  useEffect(() => {
    if (location) {
      const apiKey = 'AIzaSyCSXo4df6KLpVlZbNkPHuwJo44wHH_Vsvc';
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=store&key=${apiKey}`
        )
        .then((response) => setStores(response.data.results))
        .catch((error) => console.error('Error fetching stores:', error));
    }
  }, [location]);

  return (
    <div>
      <h2>Nearby Stores</h2>
      <ul>
        {stores.map((store) => (
          <li key={store.place_id}>{store.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default StorLocator;
