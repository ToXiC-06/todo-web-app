const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const cors = require("cors");
var ObjectId = require("mongodb").ObjectId;

const mongoUrl = "mongodb://127.0.0.1:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");
    database
      .collection("users")
      .find({})
      .toArray()
      .then((doc) => {
        res.send(doc);
        res.end();
      });
  });
});

app.get("/get-byid/:id", (request, response) => {
  mongoClient.connect(mongoUrl).then((clientObject) => {
    var database = clientObject.db("TODODB");
    database
      .collection("appointments")
      .find({ _id: new ObjectId(request.params.id) })
      .toArray()
      .then((documents) => {
        response.send(documents);
        response.end();
      });
  });
});

app.post("/register-user", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");

    let newUser = {
      UserId: req.body.UserId,
      UserName: req.body.UserName,
      Password: req.body.Password,
      Email: req.body.Email,
      Mobile: req.body.Mobile,
    };
    database
      .collection("users")
      .insertOne(newUser)
      .then((data) => {
        console.log("Inserted Succesfully.");
      });
  });
});

app.get("/appointments/:userId", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");

    database
      .collection("appointments")
      .find({ UserId: req.params.userId })
      .toArray()
      .then((docs) => {
        res.send(docs);
        res.end();
      });
  });
});

app.post("/add-task", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");

    let newTask = {
      Title: req.body.Title,
      Date: new Date(req.body.Date),
      Description: req.body.Description,
      UserId: req.body.UserId,
    };

    database
      .collection("appointments")
      .insertOne(newTask)
      .then((x) => {
        console.log("Task Added Succesfully.");
      });

    res.end();
  });
});

app.put("/edit-task/:id", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");

    let newTask = {
      Title: req.body.Title,
      Date: new Date(req.body.Date),
      Description: req.body.Description,
      UserId: req.body.UserId,
    };

    database
      .collection("appointments")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: newTask })
      .then((x) => {
        console.log("Task Updated Succesfully.");
      });
  });
});

app.delete("/delete-task/:id", (req, res) => {
  mongoClient.connect(mongoUrl).then((clientObj) => {
    const database = clientObj.db("TODODB");

    database
      .collection("appointments")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((x) => {
        console.log("Task Deleted Succesfully.");
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
});

app.listen(4000, () => {
  console.log("server started at http://127.0.0.1:4000");
});
