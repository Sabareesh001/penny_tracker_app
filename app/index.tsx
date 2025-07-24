import { useLoginCtx } from "@/store/loginContext";
import axios from "axios";
import { Redirect } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";


export default function Index() {
  const { loggedIn, setLoggedIn } = useLoginCtx();
  axios.interceptors.response.use(
    async function (config) {
      return config;
    },
    async function (error) {
      if (error.response?.status == 401) {
        await SecureStore.deleteItemAsync("authToken");
        setLoggedIn && setLoggedIn(false);
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(
    async function (config){
      config.headers.Authorization = `Bearer `+  SecureStore.getItem("authToken")
      return config
    },
    async function (error){

    }
  )


  return (
    <>
      <Redirect href={loggedIn?"./userpanel":"/login"}/>
    </>
  );
}
