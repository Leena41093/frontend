import { toast } from 'react-toastify';

export  function infoToste(msg){
    return (toast.info(msg, {
        position: toast.POSITION.TOP_CENTER
      }))
}

export  function successToste(msg){
    return (toast.success(msg, {
        position: toast.POSITION.TOP_CENTER
      }))
}

export  function warningToste(msg){
    return (toast.warn(msg, {
        position: toast.POSITION.TOP_CENTER
      }))
}

export  function errorToste(msg){
    return (toast.error(msg, {
        position: toast.POSITION.TOP_CENTER
      }))
}

export default function infoToste(msg){
    return (toast.info(msg, {
        position: toast.POSITION.TOP_CENTER
      }))
}

  