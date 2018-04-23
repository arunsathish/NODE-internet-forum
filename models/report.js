var mongoose    = require("mongoose");

var reportSchema = new mongoose.Schema({
    text: String
});

module.exports = mongoose.model("Report", reportSchema);