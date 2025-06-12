import { useColorScheme } from "react-native"

type Theme = {
    colors : {
        primary:string,
        secondary:string,
        info:string,
        danger:{
            text : string,
            danger : string
        },
        success:{
            text : string,
            success : string
        },
        section:string,
        text:string,
        input :string,
    }
    border : {
        color:string,
        radius : number,
        borderWidth: number,
        padding:number
    },
    gaps:{
        form : number
    },
    text:{
        section:{
            heading:{
                fontSize:number,
                color:string
            },
            label:{
                fontSize:number,
                color:string
            }
        }
    },
    paddings:{
        screen : number
    },
    button:{
        primary : {
            fontSize : number,
            padding:number
        }
    }
}


const darkTheme = {
    colors : {
        primary:"#caf0f8",
        secondary:"#03045e",
        section:"#023e8a",
        info:"",
        danger:{
            danger : "#e4002d",
            text : "#e4002d"
        },
        success:{
            success :"#1a7f39",
            text:"#1a7f39"
        },
        text : "#90e0ef",
        input : "#caf0f8"
    }
}

const lightTheme = {
    colors : {
        primary:"#03045e",
        secondary:"#caf0f8",
        info:"",
        section:"#48cae4",
        danger:{
            text:"#caf0f8",
            danger : "#e4002d"
        },
        success:{
            success :"#1a7f39",
            text:"#caf0f8"
        },
        text:"#0077b6",
        input:"#03045e"
    } ,
   
}

const getTheme = (colorScheme:string):Theme=>{
    const baseTheme = colorScheme==='dark'?darkTheme:lightTheme
    let theme:Theme = {
        ...baseTheme,
        border:{
            radius:5,
            borderWidth:1,
            color:"#0077b6",
            padding:15
        },
         text:{
        section:{
            heading:{
                color:'#caf0f8',
                fontSize:24
            },
            label:{
                color:"#caf0f8",
                fontSize:14
            }
        }}
        ,
        gaps:{
            form:15
        },
        paddings:{
            screen : 50
        },
        button:{
            primary:{
                fontSize:18,
                padding:10
            }
        }
        }

    return theme
}

export {getTheme,Theme};