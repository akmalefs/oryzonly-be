import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connetDB from "./utils/db.js";
import router from "./routes/index.js";

const app = express();
dotenv.config();
connetDB();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const port = 3000;

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
