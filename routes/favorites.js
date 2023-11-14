const express = require("express");
const router = express.Router();

router.get("/favorites", (req, res) => {
  res.send("Favoritos");
});

module.exports = router;
