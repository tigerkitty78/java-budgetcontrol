import React, { useEffect, useRef, useState } from 'react';

const PlacesAutocomplete = () => {
  const [address, setAddress] = useState('');
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const loadAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ['address'] } // Specify what type of places you need
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setAddress(place.formatted_address || '');
        console.log('Selected place:', place);
      });
    };

    if (window.google) {
      loadAutocomplete();
    }
  }, []);

  return (
    <div>
      <input
        ref={autocompleteRef}
        type="text"
        placeholder="Enter an address"
        style={{ width: '300px', padding: '10px', marginTop: '20px' }}
      />
      <p>Selected Address: {address}</p>
    </div>
  );
};

export default PlacesAutocomplete;
