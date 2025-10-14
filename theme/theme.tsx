import { useColorScheme } from "react-native"

type Theme = {
    colors : {
        primary:string,
        primaryDisabled:string,
        secondary: string,
        neutral: string,
        neutral2: string,
        strokeNeutral:string,
        info:{
            text : string,
            info : string
        },
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
        form : number,
        info: number
    },
    shadow: {
        text:string
    }
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
        },
        note:{
            fontSize:number
        }
    },
    paddings:{
        screen : number,
        page: number,
        card:number
    },
    button:{
        primary : {
            fontSize : number,
            padding:number
        }
    },
    
}


const darkTheme = {
  colors: {
    primary: "#f47928",
    primaryDisabled: "#fab073",
    secondary: "#111114",
    neutral: "#555555",
    neutral2: "#202020",
    strokeNeutral: "#858282",
    section: "#ffffff",
    info: {
      info: "#ff7800",
      text: "#ff7800",
    },
    danger: {
      danger: "#e4002d",
      text: "#e4002d",
    },
    success: {
      success: "#1a7f39",
      text: "#1a7f39",
    },
    text: "#fdfcff",
    input: "#ffffff",
  },
  shadow: {
    text: "#00000048",
  },
};

const lightTheme = {
  colors: {
    primary: "#03045e",
    primaryDisabled: "#b1b2c9",
    secondary: "#111114",
    neutral: "#555555",
    neutral2: "#202020",
    strokeNeutral: "#858282",
    section: "#48cae4",
    info: {
      info: "#ff7800",
      text: "#caf0f8",
    },
    danger: {
      text: "#caf0f8",
      danger: "#e4002d",
    },
    success: {
      success: "#1a7f39",
      text: "#caf0f8",
    },
    text: "#0077b6",
    input: "#03045e",
  },
  shadow: {
    text: "blue",
  },
};

const getTheme = (colorScheme:string):Theme=>{
    const baseTheme = colorScheme==='dark'?darkTheme:lightTheme
    let theme: Theme = {
      ...baseTheme,
      border: {
        radius: 5,
        borderWidth: 1,
        color: "#555555",
        padding: 15,
      },
      text: {
        section: {
          heading: {
            color: "#ffffff",
            fontSize: 24,
          },
          label: {
            color: "#ffffff",
            fontSize: 14,
          },
        },
        note: {
          fontSize: 11,
        },
      },

      gaps: {
        form: 15,
        info: 3,
      },
      paddings: {
        screen: 50,
        page: 20,
        card: 15,
      },
      button: {
        primary: {
          fontSize: 18,
          padding: 10,
        },
      },
    };

    return theme
}

export {getTheme,Theme};