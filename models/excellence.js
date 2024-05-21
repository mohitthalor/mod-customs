const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excellenceSchema = new Schema({

  garageName: String,

  image: {
    url: String,
    filename: String,
  },

  location: String,

});



const Excellence = mongoose.model("Excellence", excellenceSchema);

module.exports = Excellence;