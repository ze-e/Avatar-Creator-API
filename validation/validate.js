import {isEmail, isUnique} from "./email.js";

/* backend data validation */
export default function validate(data, database) {
  if(!isEmail(data.email)) return {
      valid: false, 
      msg:"Please enter a valid email",
    };
  
  if(!isUnique(data.email, database)) return {
    valid: false, 
    msg:"Email already exists. Please choose a new email",
  };

  return {
    valid: true, 
  };
}