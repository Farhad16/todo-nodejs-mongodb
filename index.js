const express = require("express");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const uri =
  "mongodb+srv://node-mongo:farhad16@cluster0.neh82.mongodb.net/tododDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const todoCollection = client.db("tododDb").collection("to-do");

  app.post("/addToDo", (req, res) => {
    const todo = req.body;
    todoCollection.insertOne(todo).then((result) => {
      res.redirect("/");
    });
  });

  app.get("/todos", (req, res) => {
    todoCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.get("/todo/:id", (req, res) => {
    todoCollection
      .find({
        _id: ObjectID(req.params.id),
      })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.patch("/update/:id", (req, res) => {
    todoCollection
      .updateOne(
        {
          _id: ObjectID(req.params.id),
        },

        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    todoCollection
      .deleteOne({
        _id: ObjectID(req.params.id),
      })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
  //end of mongo connection
});

app.listen(4000, () => console.log("App listening to 4000"));
