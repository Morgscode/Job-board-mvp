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
    res.status(201).json({
      status: 'sucess',
      data: {
        message: 'registered!',
        user,
      },
      jwt: '42069',
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

function login(req, res) {
  res.status(200).json({ msg: 'login route' });
}

module.exports = { register, login };
