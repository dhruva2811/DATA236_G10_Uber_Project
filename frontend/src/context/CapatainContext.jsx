import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Restore captain from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("captain-token");
    if (token) {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setCaptain(res.data.captain);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to restore captain:", err);
        setError("Failed to load captain.");
        setIsLoading(false);
      });
    }
  }, []);

  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain, isLoading, setIsLoading, error, setError, updateCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
