const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
  return res.status(300).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const book = Object.values(books).filter(book => book.title === req.params.title);
  return res.status(300).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return res.status(300).json(book.reviews);
});

module.exports.general = public_users;


async function getAllBooks() {
    try {
        const response = await axios.get('/');
        const books = response.data;
        return books;
    } catch (error) {
        console.error(error);
    }
}

async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function getBooksByAuthor(author) {
    try {
      const response = await axios.get(`/author/${author}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  async function getBooksByTitle(title) {
    try {
      const response = await axios.get(`/title/${title}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  