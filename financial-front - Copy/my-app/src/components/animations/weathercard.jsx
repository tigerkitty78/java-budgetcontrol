import { useSelector } from "react-redux";

import { useDispatch } from 'react-redux';

import React, { useEffect ,useState} from 'react';
import StoreLocator from "../../components/storelocator";
const WeatherCard = () => {
    const [isDay, setIsDay] = useState(true);
  
    useEffect(() => {
      const currentHour = new Date().getHours();
      setIsDay(currentHour > 6 && currentHour < 18);
    }, []);
  
    return (
      <div className={`card1 ${isDay ? 'day' : 'night'}`}>
        <div className="container1">
          <div className="cloud front">
            <span className="left-front"></span>
            <span className="right-front"></span>
          </div>
          {isDay ? (
            <span className="sun sunshine"></span>
          ) : (
            <div className="moon">
              <div className="crater crater1"></div>
              <div className="crater crater2"></div>
              <div className="crater crater3"></div>
            </div>
          )}
          <span className="sun"></span>
          <div className="cloud back">
            <span className="left-back"></span>
            <span className="right-back"></span>
          </div>
        </div>
        <div className="card-header1">
          {/* <span>Messadine, Susah<br/>Tunisia</span> */}
          <span>{new Date().toLocaleDateString()}</span>
           <StoreLocator />
        </div>
        <span className="temp">23°</span>
        <div className="temp-scale">
          <span>Celcius</span>
        </div>
      </div>
    );
  };
  export default WeatherCard;