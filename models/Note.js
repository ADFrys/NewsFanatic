var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var NoteSchema = new Schema({

  noteTitle: {
    type: String
  },
 
  note: {
    type: String,
    required: true
  }
  
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;