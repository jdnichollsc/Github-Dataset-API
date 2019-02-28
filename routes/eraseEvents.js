var express = require("express");
var router = express.Router();
var eventController = require("../controllers/events");

// Route related to delete events

router.delete("/", async (req, res) => {
  try {
    await eventController.eraseEvents();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
