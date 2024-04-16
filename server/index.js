const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
require("dotenv").config();

let collection1, collection2, db;
const fs = require('fs');
const yaml = require('js-yaml');

let envVariables;
try {
  envVariables = yaml.load(fs.readFileSync('.env.yml', 'utf8'));
} catch (err) {
  console.log(err);
}

const app = express();
const port = envVariables.production.PORT || 4000;

app.use(express.json());
app.use(cors());

async function dbConnect() {
  const url = envVariables.production.MONGODB_URI;
  const client = new MongoClient(url);
  
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
  db = client.db(envVariables.production.DBNAME);
  collection1 = db.collection("users");
}

dbConnect();

app.get("/signin", async (request, response) => {
  await collection1
    .findOne({ email: request.query.email })
    .then((user) => {
      if (!user) {
        return response.status(400).send({
          message: "User not found",
        });
      }

      bcrypt
        .compare(request.query.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
            });
          }
          
          const token = jwt.sign(
            { userEmail: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          
          response.status(200).send({
            message: "Login Successful",
            username: user.username,
            email: user.email,
            token: token,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error comparing password",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error finding user",
        error,
      });
    });
});

app.post("/signup", async (request, response) => {
  const collection = db.collection("users");
  try {
    const { username, email, password } = request.body;
    const existingUser = await collection1.findOne({ email });

    if (existingUser) {
      return response.status(404).json({ message: "USER_ALREADY_EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };
    await collection.insertOne(newUser);
    response.status(200).json({ message: "SIGNUP_SUCCESS" });
  } catch (err) {
    console.log(err);
    response.status(500).json({ message: err });
  }
});

app.get('/savedpass', async (request, response) => {
  try {
    collection2 = db.collection(`${request.query.username}`);
    const pass = await collection2.find().toArray();
    response.status(200).json(pass);
  } catch (err) {
    console.log(err);
    response.status(500).json({ message: err });
  }
});

app.post("/savepass", async (request, response) => {
  try {
    collection2 = db.collection(`${request.body.username}`);
    const newPass = {
      website: request.body.website,
      password: request.body.password,
    };
    await collection2.insertOne(newPass);
    response.status(200).json({ message: "Password Saved" });
  } catch (err) {
    console.log(err);
    response.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port > http://localhost/${port}`);
});
