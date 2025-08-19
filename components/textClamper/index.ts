export default function ClampText(str:string,max:number=14):string{

    return str && str?.length > max ? str.slice(0,max-3)+"..." : str
     
}