var express = require("express");
var router = express.Router();
var actorController = require("../controllers/actors");
var eventController = require("../controllers/events");

// Routes related to event
router.post("/", async (req, res) => {
  try {
    const event = req.body;
    await eventController.addEvent(event);
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await eventController.getAllEvents();
    res.status(200).send(events);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/actors/:actorId", async (req, res) => {
  try {
    const id = req.params.actorId;
    const findActor = await actorController.getActor(id);
    if (findActor) {
      const events = await eventController.getByActor(id)
      res.status(200).send(events);
    }
    else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
