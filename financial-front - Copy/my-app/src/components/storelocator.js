import { useEffect, useState } from 'react';

const StoreLocator = () => {
  const [location, setLocation] = useState({});
  const [error, setError] = useState('');
  const [currentStore, setCurrentStore] = useState('');
  console.log('gogg')
  useEffect(() => {
    console.log('useEffect triggered');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          //fetchAddress(latitude, longitude);
          fetchAddress(latitude, longitude);
          
        },
        (err) => setError('Unable to fetch location')
      );
    } else {
      setError('Geolocation not supported by this browser');
    }
  }, []);

  const fetchAddress = async (latitude, longitude) => {
    console.log('uuogg')
    const apiKey = 'AIzaSyCSXo4df6KLpVlZbNkPHuwJo44wHH_Vsvc';
    const response = await fetch(
        `http://localhost	:8080/api/nearby-store?latitude=${latitude}&longitude=${longitude}`,
      
      { method: 'GET', credentials: 'include' } // Ensure cookies are sent
    );
    if (!response.ok) throw new Error('Failed to fetch store');

    const data = await response.json();
    console.log('Latitude:', latitude, 'Longitude:', longitude);
    console.log('Response status:', response.status);

    console.log(data);


      setCurrentStore(data.name);  // Set the closest store's name
   
  
};

  return (
    <div>
   
      
          <div>
            
            <p>Your Location</p>
            <p>{currentStore}</p>
            
          </div>
        
     
     
    </div>
  );
};

export default StoreLocator;
