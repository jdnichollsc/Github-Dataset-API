var express = require("express");
var router = express.Router();
var actorController = require("../controllers/actors");
var isEqual = require('lodash/isEqual');

// Routes related to actor.
router.get("/", async (req, res) => {
  try {
    const actors = await actorController.getAllActors();
    res.status(200).send(actors);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/streak", async (req, res) => {
  try {
    const actors = await actorController.getStreak();
    res.status(200).send(actors);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/", async (req, res) => {
  try {
    const actor = req.body || {};
    const findActor = await actorController.getActor(actor.id);
    if (findActor) {
      if (isEqual({
        ...actor,
        avatar_url: findActor.avatar_url
      }, findActor)) {
        await actorController.updateActor(actor);
        res.sendStatus(200);
      }
      else {
        res.sendStatus(400);
      }
    }
    else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

module.exports = router;
