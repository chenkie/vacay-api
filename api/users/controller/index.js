const queries = require('./../query');
const util = require('./../util');
const { createToken } = require('./../../authenticate/util');
const jwtDecode = require('jwt-decode');

const postUser = async (req, res) => {
  try {
    const hashedPassword = await util.hashPassword(req.body.password);

    const userData = {
      email: req.body.email.toLowerCase(), // email is case insensitive but lowercasing makes our lives easier
      username: req.body.username,
      password: hashedPassword
    };

    const existingEmail = await queries.getUserByEmail(userData.email);
    const existingUsername = await queries.getUserByUsername(userData.username);

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Pass the userData to the query responsible for
    // creating the user
    const user = await queries.createUser(userData);
    if (user) {
      req.session.user = user;
      req.session.isAuthenticated = true;

      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const userInfo = {
        email: user.email,
        username: user.username,
        role: user.role
      };

      res.cookie('token', token, { maxAge: 360000, httpOnly: true });

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res
        .status(400)
        .json({ message: 'There was a problem creating your account' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'There was a problem creating your account' });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.query.email.toLowerCase();
    const existingEmail = await queries.getUserByEmail(email);
    if (existingEmail) {
      return res.json({ emailTaken: true });
    }
    return res.json({ emailTaken: false });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'There was a problem checking the email' });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const username = req.query.username;
    const existingUsername = await queries.getUserByUsername(username);
    if (existingUsername) {
      return res.json({ usernameTaken: true });
    }
    return res.json({ usernameTaken: false });
  } catch (err) {
    return res
      .status(400)
      .json({ message: 'There was a problem checking the username' });
  }
};

module.exports = { postUser, getUserByEmail, getUserByUsername };
