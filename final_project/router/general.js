const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password}=req.body
  if(!username || !password)
    return res.status(404).json({message: "Missing username and/or password"});    
  if(!isValid(username))
    return res.status(404).json({message: `User ${username} already exists!`});    
  users.push({username,password})
  return res.status(200).json({message: `User ${username} successfully registered`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books,null,2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params
  if(!books[isbn])
    return res.status(404).json({message:`Book with ISBN ${isbn} not found`})
  return res.status(200).json(JSON.stringify(books[isbn],null,2));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {auhor:athorName} = req.params
  const author=athorName.toLowerCase()
  const authorBooks= []
  Object.keys(books).forEach(isbn=>{
    if(books[isbn].author.toLowerCase()===author)
      authorBooks.push({isbn,...books[isbn]})
  })
  if(!authorBooks.length)
    return res.status(200).json({message:`No books from author "${athorName}" were found`})
  return res.status(200).json(JSON.stringify(authorBooks,null,2));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title:bookTitle} = req.params
  const title=bookTitle.toLowerCase()
  const correspondingBooks= []
  Object.keys(books).forEach(isbn=>{
    if(books[isbn].title.toLowerCase()===title)
    correspondingBooks.push({isbn,...books[isbn]})
  })
  if(!correspondingBooks.length)
    return res.status(200).json({message:`No books with title "${bookTitle}" were found`})
  return res.status(200).json(JSON.stringify(correspondingBooks,null,2));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params
  if(!books[isbn])
      return res.status(404).json({message:`Book with ISBN ${isbn} not found`})
  if(!Object.keys(books[isbn]).length)
      return res.status(200).json(JSON.stringify({message:`No reviews for the book with ISBN ${isbn}`,reviews:books[isbn].reviews},null,2));

  return res.status(200).json(JSON.stringify(books[isbn].reviews,null,2));
 });

module.exports.general = public_users;
