var {users} = require("../models/users");

let register = (user) => {
  let newUser = users({
    username: user.username,
    password: user.password,
    email: user.email
  });

  return  newUser.save()

};

let findUser=(username,password)=>{
 return users.findOne({username:username,password:password});
}

let userExist=(username)=>{
   return  users.findOne({username:username})
}

module.exports={
    register,
    findUser,
    userExist
}
