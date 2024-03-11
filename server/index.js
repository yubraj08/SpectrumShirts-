const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv").config()
const routes = require("./src/routes/index")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const port = process.env.PORT

app.use("/api/v1", routes);


mongoose.connect(process.env.MONGO).then(() => {
  console.log("Mongodb connected");
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});

