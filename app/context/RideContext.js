'use client'
import React, { createContext, useState } from 'react';

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideData, setRideData] = useState({
    from: '',
    to: '',
    price: 0,
    distance: 0,
    duration: 0,
    routeCoords: []
  });

  const updateRideData = (data) => {
    setRideData(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <RideContext.Provider value={{ rideData, updateRideData }}>
      {children}
    </RideContext.Provider>
  );
};
