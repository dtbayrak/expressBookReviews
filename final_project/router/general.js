const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
const isUserExist = (uname) => {
  return users.find(u => u.username === uname) ? true : false;
};

public_users.post("/register", (req,res) => {
  
  let uname = req.body.username;
  let pwd = req.body.password;

  if(uname && pwd) {
    if(isUserExist(uname)) {
      return res.status(409).send("Username must be unique.");
    }
    else {
      users.push({"username" : uname, "password" : pwd});
      return res.status(200).send("User successfully registered.");
    }
  }
  return res.status(400).send("Username and/or password are not provided.");
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {

  let waitForData = new Promise((resolve, reject) => {
    if(books) {
      resolve(books);
    } else {
      reject("List of books is not available.");
    }
  });

  waitForData
    .then(bookList => {res.status(200).send(bookList)})
    .catch(err => { res.status(500).json({ error : err });
  })
});


// Get book details based on ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if(!isbn || !Number.isInteger(parseInt(isbn))) {
      reject("Please provide an ISBN.");
    } else if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("The book with the specified ISBN could not be found.");
    }
  }); 
}

public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(400).json({ error : err });
    });
 });
  

// Get book details based on author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    if(!author) {
      reject({ status: 400, error: "Bad request." });
    }
    
    let filteredBooks = [];
    for (let key in books) {
      if (books.hasOwnProperty(key) && books[key].author === author) {
          filteredBooks.push(books[key]);
      }
    }

    if(filteredBooks.length === 0) {
      reject({ status: 400, error: "The book with the specified author could not be found." });
    } else {
      resolve({ status: 200, data: JSON.stringify(filteredBooks) });
    }
  }); 
}

public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
    let result = await getBooksByAuthor(author);
    res.status(result.status).send(result.data);
  } catch (err) {
    res.status(err.status ? err.status : 500)
       .send(err.error ? err.error : "Internal server error.");
  }
});


// Get all books based on title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    if(!title) {
      reject({ status: 400, error: "Bad request" });
    }

    let filteredBooks = [];
    for(let key in books) {
      if(books.hasOwnProperty(key) && books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    }

    if(filteredBooks.length > 0) {
      resolve({ status: 200, data: filteredBooks });
    } else {
      reject({ status: 400, error: "The book with the specified title could not be found." });
    }
  });
}

public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  getBooksByTitle(title) 
    .then(result => res.status(result.status).send(result.data))
    .catch(err => res.status(err.status).json({ error : err.error }));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  let isbn = req.params.isbn;
  if(isbn) {
    if(isEmpty(books[isbn].reviews)) {
      res.status(200).send("No reviews have been done yet");
    }
    else {
      res.status(200).send(books[isbn].reviews);
    }
  }
  else {
    return res.status(400).send("Bad request.");
  }
});

const isEmpty = (obj) => {
  for(let prop in obj) {
    if(Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

module.exports.general = public_users;
