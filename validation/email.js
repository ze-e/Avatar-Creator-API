/* email validation rules */

export const isEmail = (email) => {
  return email.match(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
}

export const isUnique = (email, users) => {
  return !users.find( user => user.email === email);
}