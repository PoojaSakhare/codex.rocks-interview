const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', function(req, res) {
  res.json({
    message: 'welcome to api'
  });
});

app.post('/api/posts', verifyToken, function(req, res) {
  jwt.verify(req.token, 'passwordkey', function(err, authData) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'post created',
        authData
      });
    }
  });

});

app.post('/api/login', function(req, res) {
  //mock user
  const user = {
    id: 1,
    username: 'newuser',
    email: 'user@gmail.com'
  }
  jwt.sign({
    user: user
  }, 'passwordkey', {
    expiresIn: '3000s'
  }, function(err, token) {
    res.json({
      token: token
    });
  });
});
//Format of token
//Authorization: Bearer <access_token>


// verify token

function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //split at the space
    const bearer = bearerHeader.split(' ');
    // get token from array
    const bearerToken = bearer[1];
    // set the token
    req.token = bearerToken;
    // next middleware
    next();
  } else {
    //forbidden
    res.sendStatus(403);
  }
}






app.listen(3000, function() {
  console.log("server is running on port 3000");
})
