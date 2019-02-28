var sqlite = require("../sqlite");

var getAllEvents = async () => {
  try {
    await sqlite.open();
    const events = await sqlite.all("SELECT * FROM events ORDER BY id ASC");
    const fullEvents = await Promise.all(events.map(event => getEvent(event)));
    await sqlite.close();
    return fullEvents;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

var addEvent = async ({ id, type, actor = {}, repo = {}, created_at }) => {
  try {
    await sqlite.open();

    await sqlite.run(
      "INSERT INTO events(id, type, actor_id, repo_id, created_at) VALUES(?,?,?,?,?)",
      [id, type, actor.id, repo.id, created_at]
    );

    await Promise.all([
      sqlite.run("INSERT OR REPLACE INTO actors(id, login, avatar_url) VALUES(?,?,?)", [
        actor.id,
        actor.login,
        actor.avatar_url
      ]),
      sqlite.run("INSERT OR REPLACE INTO repos(id, name, url) VALUES(?,?,?)", [
        repo.id,
        repo.name,
        repo.url
      ])
    ]);
    await sqlite.close();
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

const getEvent = async (event) => {
  try {
    await sqlite.open();
    const actor = await sqlite.get(
      "SELECT * FROM actors WHERE id=?",
      event.actor_id
    );
    const repo = await sqlite.get(
      "SELECT * FROM repos WHERE id=?",
      event.repo_id
    );
    delete event.actor_id
    delete event.repo_id
    await sqlite.close();
    return {
      ...event,
      actor,
      repo
    };
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

var getByActor = async (id) => {
  try {
    await sqlite.open();
    const events = await sqlite.all(
      "SELECT * FROM events WHERE actor_id=? ORDER BY id ASC", [id]
    );
    const fullEvents = await Promise.all(events.map(e => getEvent(e)));
    await sqlite.close();
    return fullEvents;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

var eraseEvents = async () => {
  try {
    await sqlite.open();
    const res = await sqlite.run("DELETE FROM events;");
    await sqlite.close();
    return res;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents
};
