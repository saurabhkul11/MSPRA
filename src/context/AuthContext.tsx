import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userID: string | null;
  token: string | null;
  username: string | null;
  loading: boolean;
  isProfileComplete: string | null;
  voterCount: string | null;
  villagePeopleCount: string | null;
  familyCount: string | null;
  farmerCount: string | null;
  login: (
    userID: string,
    token: string,
    username: string,
    isProfileComplete: string,
    voterCount?: string,
    villagePeopleCount?: string,
    familyCount?: string,
    farmerCount?: string,
  ) => void;
  updateCounts: (
    voterCount: string,
    villagePeopleCount: string,
    familyCount: string,
    farmerCount: string,
  ) => void; // ✅ add this
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProfileComplete, setIsProfileComplete] = useState<string | null>(
    null,
  );
  const [voterCount, setVoterCount] = useState<string | null>(null);
  const [villagePeopleCount, setVillagePeopleCount] = useState<string | null>(
    null,
  );
  const [familyCount, setFamilyCount] = useState<string | null>(null);
  const [farmerCount, setFarmerCount] = useState<string | null>(null);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const voter = await AsyncStorage.getItem('voterCount');
        const villagePeople = await AsyncStorage.getItem('villagePeopleCount');
        const family = await AsyncStorage.getItem('familyCount');
        const farmer = await AsyncStorage.getItem('farmerCount');

        if (voter) setVoterCount(voter);
        if (villagePeople) setVillagePeopleCount(villagePeople);
        if (family) setFamilyCount(family);
        if (farmer) setFarmerCount(farmer);
      } catch (e) {
        console.log('❌ Failed to load counts', e);
      }
    };

    loadCounts();
  }, []);

  const login = (
    userID: string,
    token: string,
    username: string,
    profileComplete: string,
  ) => {
    setLoading(true);
    setUserID(userID);
    setToken(token);
    setUsername(username);
    setLoading(false);
    setIsProfileComplete(profileComplete);
  };
  console.log('isProfileCompleteauth', isProfileComplete);

  // const updateCounts = (voterCountVal: string, villagePeopleCountVal: string) => {
  //   setVoterCount(voterCountVal);
  //   setVillagePeopleCount(villagePeopleCountVal);
  // };

  const updateCounts = async (
    voter: string,
    villagePeople: string,
    family: string,
    farmer: string,
  ) => {
    try {
      setVoterCount(voter);
      setVillagePeopleCount(villagePeople);
      setFamilyCount(family);
      setFarmerCount(farmer);

      await AsyncStorage.setItem('voterCount', voter);
      await AsyncStorage.setItem('villagePeopleCount', villagePeople);
      await AsyncStorage.setItem('familyCount', family);
      await AsyncStorage.setItem('farmerCount', farmer);

      console.log('✅ Counts saved in AsyncStorage');
    } catch (e) {
      console.log('❌ Failed to save counts', e);
    }
  };

  console.log('voterCount', voterCount);
  console.log('villagePeopleCount', villagePeopleCount);
  console.log('familyCountauth', familyCount);
  console.log('farmerCountauth', farmerCount);
  const logout = () => {
    setUserID(null);
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userID,
        token,
        username,
        isProfileComplete,
        loading,
        voterCount,
        villagePeopleCount,
        familyCount,
        farmerCount,
        login,
        logout,
        updateCounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
