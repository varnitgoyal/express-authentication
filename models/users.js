var mongoose = require('mongoose');
var usersSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
  });

  var users=mongoose.model('users',usersSchema);
  

  module.exports={
      users
  }

