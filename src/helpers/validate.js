export function formatePrice(price){
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function validateFormField(key,value) {
  var status=true;

  if(key==='email'){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;      
    status = re.test(value);
  }

  else if(key==='mobile'){
  	status = value.length>=5
  }

  else if(key==='pinCode'){
  	status = value.length>=6 
  }

  else if(key==='number'){
  	var numberReg = /^\d+$/;
  	status = numberReg.test(value);
  }
  
  
  return  status;                          
}