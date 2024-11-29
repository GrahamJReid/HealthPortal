/* eslint-disable react/prop-types */
import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import { getUserByEmail } from '../API/userData'; // Import your user data fetching function

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve email from sessionStorage
    const email = sessionStorage.getItem('userEmail');
    const savedUser = sessionStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser)); // If user data is in sessionStorage, use it
    } else if (email) {
      // Fetch user data from backend using email
      const fetchUserData = async () => {
        try {
          const userData = await getUserByEmail(email);
          if (Array.isArray(userData)) {
            setUser(userData[0]);
            sessionStorage.setItem('user', JSON.stringify(userData[0]));
          } else if (userData) {
            setUser(userData);
            sessionStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
