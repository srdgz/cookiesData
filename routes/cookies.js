const express = require("express");
const router = express.Router();

const cookieData = [
  {
    id: 1,
    name: "CHOCOLATE NEGRO",
    price: "3.50",
  },
  {
    id: 2,
    name: "CARAMELO Y NUECES",
    price: "4.00",
  },
  {
    id: 3,
    name: "DOBLE CHOCOLATE",
    price: "3.50",
  },
  {
    id: 4,
    name: "CACAHUETE Y CHOCO",
    price: "4.50",
  },
  {
    id: 5,
    name: "TOFFEE Y CHOCO",
    price: "4.00",
  },
  {
    id: 6,
    name: "CHOCO BLANCO Y NUECES",
    price: "3.50",
  },
  {
    id: 7,
    name: "COCO LOVERS",
    price: "4.50",
  },
  {
    id: 8,
    name: "NAVIDEÑAS",
    price: "5.00",
  },
];

router.get("/cookies", (req, res) => {
  res.send(cookieData);
});

module.exports = router;
