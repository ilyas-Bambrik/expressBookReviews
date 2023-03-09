const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return !users.find(user=>user.username===username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.find(user=>user.username===username&&user.password===password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password}=req.body
  if(!username || !password)
    return res.status(404).json({message: "Missing username and/or password"});    
  if(!authenticatedUser(username,password))
    return res.status(404).json({message: "Unvalid username password!"});    
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send(`User ${username} successfully logged-in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
