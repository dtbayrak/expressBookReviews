const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  if (!username || typeof username !== 'string') return false;
  username = username.trim();
  /**
   * Length between 3 and 16 characters
   * Starts with a letter 
   * Only letters, numbers, underscores
   */ 
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return regex.test(username);
}

const isUserAuthenticated = (username,password) => { 
  return users.find(u => u.username === username && u.password === password) ? true : false;
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
  
  let uname = req.body.username;
  let pwd = req.body.password;

  if(!(uname && pwd)) {
    res.status(400).send("Username and/or password are not provided.");
  }

  if(!isUserAuthenticated(uname, pwd)) {
    res.status(401).send("Login failure. Check username and password.");
  }

  // The signature of the method is jwt.sign(payload, secretOrPrivateKey, [options, callback])
  let token = jwt.sign({data: pwd}, 'access', { expiresIn : '1h' });

  // Store access token and username in session
  req.session.authorization = { "accessToken" : token, "username" : uname };

  return res.status(200).send("Login successful."); //+"\n"+JSON.stringify(req.session.authorization));
});

// Add or update book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.body.review;

  if(review) {
      let isUpdated = false;
      let isAdded = false;

      for (let bKey in books) {
        if (bKey === isbn && books.hasOwnProperty(bKey)) {
          let reviews = books[bKey].reviews;
          for(let rKey in reviews) {
            if(reviews[rKey].uname === username) {
              reviews[rKey].ureview = review;
              isUpdated = true;
              break;
            }
          }  
          if(!isUpdated) {
            reviews.push({ "uname" : username, "ureview" : review });
            isAdded = true;
          }
          break;
        }
      }

      if(isUpdated) {
        return res.status(200).send("Your previous review is updated.");
      }
      else if(isAdded) {
        return res.status(200).send("Your review is added.");
      }
      else {
        return res.status(400).send("Unable to add/update review.");
      }  
  }
  else {
    return res.status(400).send("Please provide a review.");
  }
});

// Delete review based on ISBN.
regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let username = req.session.authorization.username;

  if(isbn && username) {
    for (let key in books) {
      if (key === isbn && books.hasOwnProperty(key)) {
        let reviews = books[key].reviews;
        console.log(reviews);
        for(let rKey in reviews) {
          if(reviews[rKey].uname === username) {
            reviews.splice(rKey, 1);
            break;
          }
        }
        console.log(reviews);
        break;
      }
    }
    
    return res.status(200).send("Review is deleted.");
  }

  return res.status(400).send("Unable to delete review.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
