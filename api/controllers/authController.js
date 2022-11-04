const auth = require('../utils/auth');
const userModel = require('../models/userModel');

async function register(req, res) {
  
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      throw new Error('incomplete signup');
    }

    const userExists = await userModel.userEmailExists(email);
    if (userExists) {
      throw new Error('email address already exists');
    }

    const user = await userModel.registerUser(email, password);
    if (!user) {
      throw new Error();
    }
    const token = await auth.createToken({id: user, email, role: '1'});
    res.status(201).json({
      status: 'sucess',
      data: {
        message: 'registered!',
        user,
      },
      token,
    });
    
  } catch (error) {
    const signupError = {
      status: 'failed',
      data: {
        message: error.message,
      },
    };
    return res.status(400).json(signupError);
  }
}

async function login(req, res) {
  
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error('incomplete login attempts');
    }

    const user = await userModel.loginUser(email, password);
    if (!user) {
      throw new Error('those details are not correct');
    }

    const token = await auth.createToken(user);
    res.status(201).json({
      status: 'sucess',
      data: {
        message: 'user logged in',
        user,
      },
      token,
    });

  } catch (error) {
    const signupError = {
      status: 'failed',
      data: {
        message: error.message,
      },
    };
    return res.status(401).json(signupError);
  }
}

module.exports = { register, login };