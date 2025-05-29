import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNearbyStore } from '../../Redux/LocationSlice';

const StoreLocatorr = () => {
  const dispatch = useDispatch();
  const currentStore = useSelector((state) => state. LocationReducer.currentStore);
  const status = useSelector((state) => state.LocationReducer.status);
  const error = useSelector((state) => state.LocationReducer.error);
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          dispatch(fetchNearbyStore({ latitude, longitude }));
        },
        () => console.error('Unable to fetch location')
      );
    } else {
      console.error('Geolocation not supported by this browser');
    }
  }, [dispatch]);

  return (
    <div>
      <h1>Your Location</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      <p>{currentStore}</p>
    </div>
  );
};

export default StoreLocatorr;
