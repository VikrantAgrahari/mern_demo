const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MongoURI');

const connection = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true });
    console.log('Mongoose Connected Succesfully!');
  } catch (err) {
    console.log(`Error in Db connection ${err.message}`);
    //Exit process with faliure
    process.exit(1);
  }
};

module.exports = connection;
