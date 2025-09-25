import { useLoginCtx } from "@/store/loginContext";
import axios from "axios";
import { Redirect } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";


export default function Index() {
  const { loggedIn, setLoggedIn } = useLoginCtx();

  return (
    <>
      <Redirect href={loggedIn?"./userpanel":"/login"}/>
    </>
  );
}
