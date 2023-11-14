const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 3000;
const { readdirSync } = require("fs");

readdirSync("./routes").map((file) =>
  app.use("/", require("./routes/" + file))
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
