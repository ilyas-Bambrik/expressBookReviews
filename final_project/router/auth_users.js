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
    const {isbn} = req.params
    const {review} = req.query
    const {username} = req.session.authorization
    if(!books[isbn])
        return res.status(404).json({message:`Book with ISBN ${isbn} not found.`})
    books[isbn].reviews[username]=review
    return res.status(200).json(JSON.stringify({message:"New review added.",reviews:books[isbn].reviews},null,2));
  
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params
    const {username} = req.session.authorization
    if(!books[isbn])
        return res.status(404).json({message:`Book with ISBN ${isbn} not found.`})
    delete books[isbn].reviews[username]
    return res.status(200).send({message:`Review for book with ISBN ${isbn} deleted.`});
  
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
