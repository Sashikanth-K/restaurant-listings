import React, { createContext, useState, useEffect } from "react";
import store from "store";

const UserContext = createContext(null);
const UserProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isDataInLocalStorage = async () => {
    let user = store.get("user");

    if (user) {
      setIsAuthenticated(true);
      setUserInfo(user);
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  };

  const setDataInLocalStorage = async (data) => {
    store.set("user", data);
    isDataInLocalStorage();
  };
  const deleteDataInLocalStorage = async (data) => {
    store.remove("user");
    isDataInLocalStorage();
  };

  useEffect(() => {
    isDataInLocalStorage();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        userInfo,
        setUserInfo,
        setDataInLocalStorage,
        deleteDataInLocalStorage,
        errorMessage,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export { UserProvider };
export { UserContext };
