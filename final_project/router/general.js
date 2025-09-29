const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
  let promise = new Promise((resolve, reject) => {
    axios.get('http://localhost:5000')
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
  promise
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ message: "Error fetching book list", error: error.message}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    let response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    let author = req.params.author;
    let response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Author not found", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    let title = req.params.title;
    let response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Title not found", error: error.message });
  }
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
