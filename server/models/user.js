const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  fName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  lName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  desig: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  passPhrase: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  role: {
    type: Number,
    required: true,
    minlength: 1
  },
  currentRole: {
    type: Number,
    required: true,
    minlength: 1
  },
  password: {
    type: String,
    default: null
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'fName', 'lName', 'desig', 'role', 'currentRole']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'escience101').toString();
  // console.log("Token@generateAuthToken:", token);

  user.tokens = user.tokens.concat({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'escience101');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('passPhrase')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.passPhrase, salt, (err, hash) => {
        user.passPhrase = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = {User}