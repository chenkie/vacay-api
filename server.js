require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const csrf = require('csurf');
const jwtDecode = require('jwt-decode');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Required if we serve our API at a
// different origin than the Angular app
app.use(cors()); // Cross-Origin Resource Sharing

const limiter = new rateLimit({
  windowMs: 15 * 60 * 1000, // set window to 15 minutes
  max: 100,
  delayMs: 0 // don't require a delay disabled
});

app.use(limiter);
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
  })
);

app.use(cookieParser());

const attachUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
  const decodedToken = jwtDecode(token);

  if (!decodedToken) {
    return res
      .status(401)
      .json({ message: 'There was a problem authorizing the request' });
  } else {
    req.user = decodedToken;
    next();
  }
};

app.get('/ping', (req, res) => {
  res.send('Hello world!');
});

const checkSession = (req, res, next) => {
  if (req.session.user && req.session.isAuthenticated) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// const checkJwt = expressJwt({ secret: process.env.JWT_SECRET });

const checkJwt = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: 'api.vacay.com',
      issuer: 'api.vacay.com'
    });
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Access denied' });
  }
};

const makeCsrfToken = (req, res, next) => {
  res.cookie('csrf-token', req.csrfToken());
  next();
};
// ----- Routes Not Requring Auth ------ //
// User routes
app.use('/api/users', require('./api/users'));

// Auth routes
app.use('/api/authenticate', require('./api/authenticate'));
app.use('/api/logout', require('./api/logout'));

// ----- Routes Requring Auth ------ //
app.use(csrf({ cookie: true }));
app.use(makeCsrfToken);
app.use(attachUser);
// The authentication middleware is applied before
// the destinations endpoint so that it can be protected
app.use(checkJwt);

// Destination routes
app.use('/api/destinations', require('./api/destinations'));

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MLAB_URL);
  } catch (err) {
    console.log('Mongoose error', err);
  }
  app.listen(3000);
  console.log('API listening on localhost:3000');
}

connect();
