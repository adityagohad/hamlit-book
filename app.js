const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const ejs = require("ejs");

var fs = require("fs");

// const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url =
 'mongodb://localhost:27017';
mongoose.connect(url);

const dbName = "books";
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const initDB = function (callback) {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    callback(db, client);
  });
};

const findDocuments = function (db, docId, callback) {
  const collection = db.collection("books");
  collection.find({ id: docId }).toArray(function (err, docs) {
    assert.equal(err, null);
    collection.updateOne(
      { id: docId },
      { $set: { money_raised: docs[0].money_raised + 0.01 } },
      function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
      }
    );
    callback(docs);
  });
};

const findMoneyRaised = function (db, callback) {
  const collection = db.collection("money");
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    collection.updateOne(
      { id: 1 },
      { $set: { money_raised: docs[0].money_raised + 0.01 } },
      function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        callback(docs);
      }
    );
  });
};

app.get("/getBook", function (req, res) {
  var i = Math.floor(Math.random() * 50) + 1;
  initDB(function (db, client) {
    findDocuments(db, i, function (data) {
      findMoneyRaised(db, function (moneyData) {
        data[0].money_raised = moneyData[0].money_raised;
        res.end(JSON.stringify(data[0]));
        client.close();
      });
    });
  });
});
// my work start from here
let name = "";
let id = "";
let email = "";
// creating UserSchema
const userSchema = new mongoose.Schema({
  name: String,
  id: Number,
  remainingTab: Number,
  bookDonated: Number,
  email: String,
});
//  creating model or table by using userSchema
const User = new mongoose.model("User", userSchema);
app.get("/", function (req, res) {
  res.render("auth");
});
// this route will be execute when user logged in.
// and refresh page

app.get("/successLogin", function (req, res) {
  // checking user new or old
  User.find({ email: email }, function (err, foundUser) {
    if (!err) {
      if (foundUser.length == 0) {
        console.log("its a new user");
        // saving tab and bookDonated for newUser
        const user = new User({
          name: name,
          id: id,
          remainingTab: 225,
          bookDonated: 0,
          email: email,
        });
        user.save();
        res.render("index", {
          remainingTab: 225,
          bookDonated: 0,
        });
      } else {
        // old user
        console.log("its a old user");
        let remainingTab = foundUser[0].remainingTab;
        let bookDonated = foundUser[0].bookDonated;
        remainingTab--;
        // find and update user tab and book
        if (remainingTab == 0) {
          // find and update user tab and book when tab=0
          remainingTab = 225;
          bookDonated++;
          User.findOneAndUpdate(
            { email: email },
            { $set: { remainingTab: remainingTab } },
            function (err, updated) {
              if (!err) {
                console.log("tab updated");
              }
            }
          );
          // update book donate

          User.findOneAndUpdate(
            { email: email },
            { $set: { bookDonated: bookDonated } },
            function (err, updated) {
              if (!err) {
                console.log("book updated");
              }
            }
          );
          res.render("index", {
            remainingTab: remainingTab,
            bookDonated: bookDonated,
          });
        } else {
          // find and update user tab when tab!=0
          User.findOneAndUpdate(
            { email: email },
            { $set: { remainingTab: remainingTab } },
            function (err, updated) {
              if (!err) {
                console.log("tab updated");
              }
            }
          );
          res.render("index", {
            remainingTab: remainingTab,
            bookDonated: bookDonated,
          });
        }
      }
    }
  });
});
// getting user info from client login
app.post("/api", (req, res) => {
  id = req.body.id;
  email = req.body.email;
  name = req.body.name;
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
