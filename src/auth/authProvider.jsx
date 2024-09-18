import React, { useEffect } from "react";
import axiosInstance from "../api/axios_instance";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const fetchMe = async () => {
  return axiosInstance({
    url: "/users/me",
    method: "GET",
  });
};

const AuthProvider = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const query = useQuery("me", fetchMe, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 0,
  });

  useEffect(() => {
    if (!query.isLoading) {
      if (query.isError && query.error.response.status === 401) {
        if (token) {
          setToken(null);
        }

        navigate("/login");
      }
    }
  }, [query]);

  return <>{query.isLoading ? <div>Loading</div> : <>{children}</>}</>;
};

export default AuthProvider;
