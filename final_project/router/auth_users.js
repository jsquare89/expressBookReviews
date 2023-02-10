const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const usernameExists = users.some(user => user.username === username);
    return usernameExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
   return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add/Edit a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username =  req.session.authorization.username;
    const review = req.query.review;

    if(!books[isbn].reviews[username]){
        books[isbn].reviews[username] = review;
        return res.status(300).json("Added your review!");
    }else{
        books[isbn].reviews[username] = review;
        return res.status(300).json("Modified your review!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username =  req.session.authorization.username;
    delete books[isbn].reviews[username];
    return res.status(300).json("Deleted your review!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
