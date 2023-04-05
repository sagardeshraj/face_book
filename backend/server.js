const express = require("express");
const mongoose = require("mongoose");
const { readdirSync }  = require('fs');
const dotenv = require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// routes 
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));


// db
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB Connected"))
.catch((err) => console.log("DB Connection Error", err));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server is lestining...");
});
