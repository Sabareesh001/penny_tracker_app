import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getTheme, Theme } from "./theme";
import { Appearance } from "react-native";

const themeContext = createContext<{theme:Theme | undefined,backgroundColor:string | undefined,setBackground:React.Dispatch<React.SetStateAction<string>> | undefined}>({theme:undefined,backgroundColor:undefined,setBackground:undefined})

const ThemeProvider = ({children}:{children:ReactNode})=>{
    const [mode,setMode] = useState('dark')
    const [theme,setTheme] = useState(getTheme(mode));
    const [backgroundColor,setBackground] = useState("");
    useEffect(()=>{
        setTheme(getTheme(mode))
    },[mode])
    
    useEffect(()=>{
       const listener =  Appearance.addChangeListener(({colorScheme})=>{
            if(colorScheme){
                setMode(colorScheme)
            }
        })

        return ()=>{listener.remove()}
    },[])

    return(
    <themeContext.Provider value={{theme,backgroundColor,setBackground}}>
    {children}
    </themeContext.Provider>
    )
}

const useTheme = ():{theme:Theme | undefined,backgroundColor:string | undefined,setBackground:React.Dispatch<React.SetStateAction<string>>|undefined} => React.useContext(themeContext)

export {useTheme,ThemeProvider}