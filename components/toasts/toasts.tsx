import Toast from "react-native-toast-message"

const SomethingWentWrong = ()=>{
    return(
        Toast.show({
            type:'info',
            text1:'Something Went Wrong'
        })
    )
}

export {SomethingWentWrong};