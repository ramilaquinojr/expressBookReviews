const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists"});
        }
    }    
    return res.status(404).json({message: "Username and/or password are not provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) { 
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(result => {
    res.send(JSON.stringify(result, null, 4));
  })
  .catch(error => {
    res.status(500).json({ message: error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(result => {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
  })
  .catch(error => {
    res.status(500).json({ message: error });
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(result => {
    let author = req.params.author.toLowerCase();
    let filtered = Object.values(books).filter(book => 
      book.author.toLowerCase() === author
    );
    res.send(JSON.stringify(filtered, null, 4));
  })
  .catch(error => {
    res.status(500).json({ message: error });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(result => {
    let title = req.params.title.toLowerCase();
    let filtered = Object.values(books).filter(book => 
      book.title.toLowerCase() === title
    );
    res.send(JSON.stringify(filtered, null, 4));
  })
  .catch(error => {
    res.status(500).json({ message: error });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  let reviews = Object.values(book.reviews);
  res.json(reviews);
});

module.exports.general = public_users;
