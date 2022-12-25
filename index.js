const express = require("express");

const app = express();
const port = 3001;
const fs = require("fs");
const { parse } = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { json } = require("express");
const { Buffer } = require("node:buffer");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // <= Accept credentials (cookies) sent by the client
  })
);

app.get("/", (req, res) => {
  res.send("Bismillahir Rahmanir Rahim");
});

app.get("/books", (req, res) => {
  fs.readFile("databaseofbooks", "utf8", (err, data) => {
    const allData = JSON.parse(data);
    console.log(allData);
    res.send(`${JSON.stringify(allData.books)} added`);
  });
});

app.post("/create-book", (req, res) => {
  fs.readFile("databaseofbooks", "utf8", (err, data) => {
    const allData = JSON.parse(data);
    if (req.body.name.length < 5) {
      res.status(400).send(
        JSON.stringify({
          error: "Name must be contain atleast 5 Characters",
        })
      );
    }
    if (req.body.writer.length < 5) {
      res.status(400).send(
        JSON.stringify({
          error: "Name must be contain atleast 5 Characters",
        })
      );
    }
    if (req.body.death.length < 4) {
      res.status(400).send(
        JSON.stringify({
          error: "Name must be contain atleast 5 Characters",
        })
      );
      return;
    }
    const rawImageString = req.body.image.replace(
      /^data:image\/jpg;base64,/,
      ""
    );
    const buffer = Buffer.from(rawImageString, "base64");
    req.body.id = allData.books.length + 1;
    fs.writeFile(`public/${req.body.id}.jpeg`, buffer, () => { });
    req.body.image = `${req.body.id}.jpeg`;
    allData.books.push(req.body);
    fs.writeFile("databaseofbooks", JSON.stringify(allData), () => { });
    res.send(`${req.body.name} added`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
