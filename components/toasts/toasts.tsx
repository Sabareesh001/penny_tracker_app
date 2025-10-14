import Toast from "react-native-toast-message"

const SomethingWentWrong = ()=>{
    return(
        Toast.show({
            type:'info',
            text1:'Something Went Wrong'
        })
    )
}


const InvalidEntry = (props:{mustBe?:string}) => {
  return Toast.show({
    type: "error",
    text1: `Invalid Entry ${props.mustBe ? `must be ${props.mustBe}` : ``}`,
  });
};

export {SomethingWentWrong,InvalidEntry};