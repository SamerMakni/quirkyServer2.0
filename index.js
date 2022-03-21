const express = require("express");
require('express-group-routes');
require('dotenv').config();
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
var cors = require('cors');
var bodyParser = require('body-parser');

// enable cors
app.use(cors());

// enable body parser
app.use(bodyParser.json());

// new MONGO client instance
const client = new MongoClient(process.env.MONGO_URI);

// express-static middleware
app.use(express.static("public"))

// routing
app.group("/api/v1", (router) => {
  router.get("/", function (req, res) {
    res.json({ url: process.env.APP_URL, version: 1 })
  })

  // tasks crud
  // READ
  router.group("/tasks", (router) => {
    const collection = "tasks"
    router.get("/:id?", async (req, res) => {
      let data = [];
      if (req.params.id) {
        try {
          await client.connect();
          const id = req.params['id'];
          const query = { "_id": ObjectId(id) };
          await client.db("diary").collection(collection).findOne(query)
            .then((result) => {
              if (result) {
                res.json(result);
              }
              else {
                res.status(404).json({ success: false, message: 'not found' })
              }
            }).
            catch((e) => {
              res.status(404).json({ success: false, message: 'not found' })
            });
        } catch (e) {
          res.status(400).json({ success: false, message: 'bad request', error: e })
        } finally {
          await client.close();
        }
      }
      else {
        try {
          await client.connect();
          const query = { dateAdded: getThisDate() };
          const cursor = client.db("diary").collection(collection).find(query);
          await cursor.forEach((i) => {
            data.push(i);
          });
          res.json({ success: true, data });
        } catch (e) {
          res.status(400).json({ success: false, message: 'bad request', error: e })
        } finally {
          await client.close();
        }
      }
    })
    // CREATE
    router.post("/", async (req, res) => {
      try {
        let payLoad = JSON.stringify(req.body, null, 2);
        await client.connect();
        await client.db("diary").collection(collection).insertOne(Object.assign(JSON.parse(payLoad), { checked: false }))
          .then((inserted) => {
            res.status(201).json(inserted);
          }).
          catch((e) => {
            res.status(400).json({ success: false, message: 'bad request', error: e })
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e })
      } finally {
        await client.close();
      }
    })
    // UPDATE
    router.patch("/:id", async (req, res) => {
      try {
        let payLoad = JSON.stringify(req.body, null, 2);
        const id = req.params.id;
        const filter = { "_id": ObjectId(id) };
        await client.connect();
        await client.db("diary").collection(collection).updateOne(filter, { $set: JSON.parse(payLoad) })
          .then((updated) => {
            if (updated.modifiedCount) {
              res.json(updated);
            }
            else {
              res.status(404).json({ success: false, message: 'not found' })
            }
          })
          .catch((e) => {
            res.status(404).json({ success: false, message: 'not found' })
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e })
      } finally {
        await client.close();
      }
    })
    // DELETE
    router.delete("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { "_id": ObjectId(id) };
        await client.connect();
        await client.db("diary").collection(collection).deleteOne(filter)
          .then((deleted) => {
            res.json({ success: true, deleted });
          })
          .catch((e) => {
            res.status(400).json({ success: false, message: 'bad request', error: e })
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e })
      } finally {
        await client.close();
      }
    })
  })

  // notes crud
  // READ
  router.group("/notes", (router) => {
    const collection = "notes";
    router.get("/:id?", async (req, res) => {
      let data = [];
      if (req.params.id) {
        try {
          await client.connect();
          const id = req.params['id'];
          const query = { "_id": ObjectId(id) };
          await client.db("diary").collection(collection).findOne(query)
            .then((result) => {
              if (result) {
                res.json(result);
              }
              else {
                res.status(404).json({ success: false, message: 'not found' });
              }
            }).
            catch((e) => {
              res.status(404).json({ success: false, message: 'not found' });
            });
        } catch (e) {
          res.status(400).json({ success: false, message: 'bad request', error: e });
        } finally {
          await client.close();
        }
      }
      else {
        try {
          await client.connect();
          const query = { dateAdded: getThisDate() };
          const cursor = client.db("diary").collection(collection).find(query);
          await cursor.forEach((i) => {
            data.push(i);
          });
          res.json({ success: true, data });
        } catch (e) {
          res.status(400).json({ success: false, message: 'bad request', error: e });
        } finally {
          await client.close();
        }
      }
    })
    // CREATE
    router.post("/", async (req, res) => {
      try {
        let payLoad = JSON.stringify(req.body, null, 2);
        await client.connect();
        await client.db("diary").collection(collection).insertOne(Object.assign(JSON.parse(payLoad), { checked: false }))
          .then((inserted) => {
            res.status(201).json(inserted);
          }).
          catch((e) => {
            res.status(400).json({ success: false, message: 'bad request', error: e });
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e });
      } finally {
        await client.close();
      }
    })
    // UPDATE
    router.patch("/:id", async (req, res) => {
      try {
        let payLoad = JSON.stringify(req.body, null, 2);
        const id = req.params.id;
        const filter = { "_id": ObjectId(id) };
        await client.connect();
        await client.db("diary").collection(collection).updateOne(filter, { $set: JSON.parse(payLoad) })
          .then((updated) => {
            if (updated.modifiedCount) {
              res.json(updated);
            }
            else {
              res.status(404).json({ success: false, message: 'not found' });
            }
          })
          .catch((e) => {
            res.status(404).json({ success: false, message: 'not found' });
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e });
      } finally {
        await client.close();
      }
    })
    // DELETE
    router.delete("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { "_id": ObjectId(id) };
        await client.connect();
        await client.db("diary").collection(collection).deleteOne(filter)
          .then((deleted) => {
            res.json({ success: true, deleted });
          })
          .catch((e) => {
            res.status(400).json({ success: false, message: 'bad request', error: e });
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e });
      } finally {
        await client.close();
      }
    })
  })

  // ratings crud
  // READ
  router.group("/ratings", (router) => {
    const collection = "ratings"
    router.get("/", async (req, res) => {
      let data = [];
      let lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      try {
        await client.connect();
        const query = { "date": { $gte: lastWeek } };
        const cursor = client.db("diary").collection(collection).find(query);
        await cursor.forEach((i) => {
          data.push(i);
        });
        res.json({ success: true, data });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e })
      } finally {
        await client.close();
      }
    })
    // CREATE
    router.post("/", async (req, res) => {
      try {
        let payLoad = JSON.stringify(req.body, null, 2);
        await client.connect();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const query = { "date": { $gt: yesterday } };
        await client.db("diary").collection(collection).count(query).then( async (result) => {
          if (await result == 0) {
            await client.db("diary").collection(collection).insertOne(Object.assign(JSON.parse(payLoad), { date: new Date() }))
              .then((inserted) => {
                res.status(201).json(inserted);
              }).
              catch((e) => {
                res.status(400).json({ success: false, message: 'bad request while inserting', error: e })
              });
            }
          else {
            res.status(400).json({ success: false, message: 'rating already submited for today'});
          }
        })

      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e })
      } finally {
        await client.close();
      }
    })
    // DELETE
    router.delete("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { "_id": ObjectId(id) };
        await client.connect();
        await client.db("diary").collection(collection).deleteOne(filter)
          .then((deleted) => {
            res.json({ success: true, deleted });
          })
          .catch((e) => {
            res.status(400).json({ success: false, message: 'bad request', error: e });
          });
      } catch (e) {
        res.status(400).json({ success: false, message: 'bad request', error: e });
      } finally {
        await client.close();
      }
    })
  })
});

// get this date function
function getThisDate() {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${day}${month}${year}`;
}

// start server
app.listen(process.env.PORT || 3000, () => console.log(`Server is running...`));
