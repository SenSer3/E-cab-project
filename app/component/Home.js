"use client"
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar.js';
import Map from './Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle } from '@fortawesome/free-solid-svg-icons';
import { faBicycle,faCar } from '@fortawesome/free-solid-svg-icons';
import { RideContext } from '../context/RideContext';

const Home = () => {
  const { updateRideData } = useContext(RideContext);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [price, setPrice] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFromChange = (e) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
  };

  // Geocode address to coordinates using Nominatim API
  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      throw new Error('Address not found');
    }
  };

  // Get route from OSRM API with profile based on vehicle type
  const getRoute = async (start, end, profile = 'driving') => {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 'Ok') {
      const route = data.routes[0];
      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        coords: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // convert to [lat, lon]
      };
    } else {
      throw new Error('Routing error: ' + data.message);
    }
  };

  const rideHandleSubmit = async (e) => {
    e.preventDefault();
    if (from.trim() !== '' && to.trim() !== '') {
      setLoading(true);
      try {
        const startCoords = await geocodeAddress(from);
        const endCoords = await geocodeAddress(to);
        // Use profile based on selected vehicle type or default to driving
        const profile = selectedOption === 'bike' ? 'bike' : selectedOption === 'car' || selectedOption === 'carpool' ? 'driving' : 'foot';
        const routeData = await getRoute(startCoords, endCoords, profile);
        setRouteCoords(routeData.coords);
        setDistance(routeData.distance);
        setDuration(routeData.duration);
        setShowOptions(true);
      } catch (error) {
        alert(error.message);
        setShowOptions(false);
      }
      setLoading(false);
    } else {
      setShowOptions(false);
    }
  };

  const optClick = (option, optionPrice) => {
    setSelectedOption(option);
    setPrice(optionPrice);
    // Recalculate route duration based on selected vehicle type if route exists
    if (routeCoords.length > 0) {
      (async () => {
        try {
          const startCoords = routeCoords[0];
          const endCoords = routeCoords[routeCoords.length - 1];
          const profile = option === 'bike' ? 'bike' : option === 'car' || option === 'carpool' ? 'driving' : 'foot';
          const routeData = await getRoute(startCoords, endCoords, profile);
          setDistance(routeData.distance);
          setDuration(routeData.duration);
        } catch (error) {
          console.error('Error recalculating route:', error);
        }
      })();
    }
  };

  const payOnClick = (e) => {
    e.preventDefault();
    updateRideData({ from, to, price, distance, duration, routeCoords });
    router.push('./payment');
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-[#90C67C]">
        {/* Header Section */}
        <header className="bg-[#90C67C] p-4 text-black flex flex-col gap-4">
          <div className="flex justify-center items-center gap-10">
            <div className="flex gap-2 items-center">
              <label htmlFor="">From</label>
              <div>
                <input
                  className="border-b-2 focus:outline-none bg-[#b7d8ab]"
                  type="text"
                  value={from}
                  onChange={handleFromChange}
                  placeholder="Enter start address"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="">To</label>
              <div>
                <input
                  className="border-b-2 focus:outline-none bg-[#b7d8ab]"
                  type="text"
                  value={to}
                  onChange={handleToChange}
                  placeholder="Enter destination address"
                />
              </div>
            </div>
            <button
              className="bg-green-800 text-white px-2 py-1 rounded-xl"
              onClick={rideHandleSubmit}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Ride'}
            </button>
          </div>
          {showOptions && (
            <div className="text-center mt-2">
              <p>Distance: {(distance / 1000).toFixed(2)} km</p>
              <p>Duration: {(duration / 60).toFixed(0)} mins</p>
            </div>
          )}
        </header>

        {/* Map Section */}
        <main className="m-2 flex-grow">
          <Map routeCoords={routeCoords} />
        </main>

        {/* Transportation Options */}
        {showOptions && (
          <footer className="bg-[#90C67C] p-4 flex justify-between">
            <div className="flex justify-around ml-10 gap-10">
              <div
                onClick={() => optClick('car', 500)}
                className={`w-30 h-20 pt-3 flex flex-col items-center rounded cursor-pointer ${
                  selectedOption === 'car' ? 'border-4 border-green-700' : 'bg-[#90C67C]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faCar} />
                </div>
                <p>E-Car</p>
                <div className="mb-1">500</div>
              </div>
              <div
                onClick={() => optClick('bike', 300)}
                className={`w-30 h-20 pt-3 flex flex-col items-center rounded cursor-pointer ${
                  selectedOption === 'bike' ? 'border-4 border-green-700' : 'bg-[#90C67C]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faMotorcycle} />
                </div>
                <p>E-Bike</p>
                <div className="mb-1">300</div>
              </div>
              <div
                onClick={() => optClick('cycle', 200)}
                className={`w-30 h-20 pt-3 flex flex-col items-center rounded cursor-pointer ${
                  selectedOption === 'cycle' ? 'border-4 border-green-700' : 'bg-[#90C67C]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faBicycle} />
                </div>
                <p>E-Cycle</p>
                <div className="mb-1">200</div>
              </div>
              <div
                onClick={() => optClick('carpool', 150)}
                className={`w-30 h-20 pt-3 flex flex-col items-center rounded cursor-pointer ${
                  selectedOption === 'carpool' ? 'border-4 border-green-700' : 'bg-[#90C67C]'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faMotorcycle} />
                </div>
                <p>Carpool</p>
                <div className="mb-1">150</div>
              </div>
            </div>
            <div className="flex justify-items-center items-center">
              <button onClick={payOnClick} className="mx-30 p-2 border rounded">
                PAY
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default Home;
