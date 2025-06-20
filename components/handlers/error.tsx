import Toast from "react-native-toast-message";

const FormErrorHandler = (name:string,type : string)=>{
     switch (type) {
        case 'required':
            Toast.show({
                type:'error',
                text1:`${name} is Required`
            })
            break;
        case 'maxLength':{
            Toast.show({
                type:'error',
                text1:`${name} exceeds Max Length`
            })
            break;
        }
        case 'pattern':{
            Toast.show({
                type:'error',
                text1:`${name} is Invalid`
            })
            break;
        }
        default:
            break;
     }
}

export {FormErrorHandler}