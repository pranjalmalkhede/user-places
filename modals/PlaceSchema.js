const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  "title": { type: String, required: true },
  "description": { type: String, required: true },
  "address": { type: String, required: true },
  "creator":{type:mongoose.Types.ObjectId,required:true,ref:"User"}
});

module.exports = mongoose.model('Place',PlaceSchema);