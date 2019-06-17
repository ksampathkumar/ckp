var mongoose = require('mongoose');

mongoose.set('findByIdAndUpdate', false);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://35.184.100.181:35000/ckp', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

});

module.exports = { mongoose };
