// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   id: number;
//   username: string;
//   name: string;
//   role: "SUPER_ADMIN" | "ADMIN" | "MINER";
//   mineId?: number;
// }

// interface UserContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUserState] = useState<User | null>(null);

//   // Initialize user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUserState(JSON.parse(storedUser));
//     }
//   }, []);

//   // Persist user to localStorage whenever it changes
//   const setUser = (user: User | null) => {
//     setUserState(user);
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("useUser must be used within a UserProvider");
//   return context;
// };


"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MINER";
  mineId?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;

  // Loader flags
  hasSeenLoader: boolean;
  setHasSeenLoader: (value: boolean) => void;

  hasPageInitialized: boolean;
  setHasPageInitialized: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  const [hasSeenLoader, setHasSeenLoaderState] = useState<boolean>(false);
  const [hasPageInitialized, setHasPageInitializedState] = useState<boolean>(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUserState(JSON.parse(storedUser));

      const pageInit = localStorage.getItem("hasPageInitialized") === "true";
      setHasPageInitializedState(pageInit);

      const seenLoader = localStorage.getItem("hasSeenLoader") === "true";
      setHasSeenLoaderState(seenLoader);
    }
  }, []);

  // Persist user
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Persist rockfall loader flag
  const setHasSeenLoader = (value: boolean) => {
    setHasSeenLoaderState(value);
    localStorage.setItem("hasSeenLoader", value ? "true" : "false");
  };

  // Persist page initialization flag
  const setHasPageInitialized = (value: boolean) => {
    setHasPageInitializedState(value);
    localStorage.setItem("hasPageInitialized", value ? "true" : "false");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        hasSeenLoader,
        setHasSeenLoader,
        hasPageInitialized,
        setHasPageInitialized,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
