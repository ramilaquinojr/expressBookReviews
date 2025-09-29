const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  return userswithsamename.length === 0;
}

// Check if username and password is valid
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Username and/or password is missing" });
  }
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];

  if (!username) {
    return res.status(401).json({ message: "You must be logged in to post a review" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews[username] = review; // Add or update review under this username

  return res.json({
    message: "Review successfully added/updated",
    reviews: book.reviews
  });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let username = req.session.authorization['username'];

  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review" });
  }
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  delete book.reviews[username];

  return res.json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
