const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mongo_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB has been connected", process.env.MONGODB_URI)
  )
  .catch((err) => console.log(err));

module.exports = mongoose.connection;
