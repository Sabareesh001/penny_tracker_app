import { createContext, useContext, useState } from "react";

type contextType = {
    fullPageLoaderOpen : boolean
    setFullPageLoaderOpen : React.Dispatch<React.SetStateAction<boolean>> | null
}

const fullPageLoaderCtx = createContext<contextType>({
    fullPageLoaderOpen:false,
    setFullPageLoaderOpen: null
})

const FullPageLoaderProvider = (props:{children:React.ReactNode})=>{
    const [fullPageLoaderOpen,setFullPageLoaderOpen] = useState(false);

    return(
        <fullPageLoaderCtx.Provider value={{fullPageLoaderOpen,setFullPageLoaderOpen}} {...props}/>
    )
}

const getFullPageLoader = ()=>{
    return useContext(fullPageLoaderCtx)
}

export {FullPageLoaderProvider,getFullPageLoader}