var sqlite = require("../sqlite");

var getActor = async (id) => {
  try {
    await sqlite.open();
    const actor = await sqlite.get("SELECT * FROM actors WHERE id=?;", [id]);
    await sqlite.close();
    return actor;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

var getAllActors = async () => {
  try {
    await sqlite.open();
    const actors = await sqlite.all(`
    SELECT
      id, login, avatar_url
    FROM (
      SELECT
        MAX(DATE(E.created_at)) AS last_day,
        COUNT(DATE(E.created_at)) as total,
        A.*
      FROM actors AS A
      INNER JOIN events AS E
      ON A.id = E.actor_id
      GROUP BY login
    )
    ORDER BY total DESC, last_day DESC, login ASC;
    `);
    await sqlite.close();
    return actors;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

var updateActor = async ({ id, login, avatar_url }) => {
  try {
    await sqlite.open();
    await sqlite.run(`
      UPDATE actors 
        SET 
          login = $login, 
          avatar_url = $avatar_url 
       WHERE id = $id`, {
      $id: id,
      $login: login,
      $avatar_url: avatar_url
    })
    await sqlite.close();
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

/* Maximum number of non-consecutive days
SELECT
  id, login, avatar_url
FROM (
  SELECT
    MAX (DATE(E.created_at)) AS last_day,
    COUNT(DISTINCT DATE(E.created_at)) AS maximum_streak,
    A.*
  FROM actors AS A
  LEFT JOIN events AS E
  ON A.id = E.actor_id
  GROUP BY login
)
ORDER BY maximum_streak DESC, last_day DESC, login ASC;
*/

var getStreak = async () => {
  try {
    await sqlite.open();
    const actors = await sqlite.all(`
    SELECT 
      id, login, avatar_url
    FROM (
    SELECT
      evt_st.*, MAX(evt.created_at) as last_day
    FROM (
      SELECT 
        *,
        COUNT(*) as streak
      FROM (
        SELECT 
          at.*,
          t1.created_at,
          DATE(
            t1.created_at,
            -(
              SELECT COUNT(*)
                FROM actors AS at
                INNER JOIN events AS t2 
                  ON at.id = t2.actor_id 
                AND t1.actor_id = t2.actor_id
              WHERE t2.created_at <= t1.created_at
            ) || ' day') as grp
        FROM actors AS at
        INNER JOIN events t1
        ON at.id = t1.actor_id
      )
      GROUP by grp
    ) AS evt_st
    INNER JOIN events AS evt
    ON evt.actor_id = evt_st.id
    GROUP BY evt_st.id
    )
    ORDER BY streak DESC, last_day DESC, login ASC;
    `);
    await sqlite.close();
    return actors;
  } catch (err) {
    await sqlite.close();
    throw err;
  }
};

module.exports = {
  getActor,
  updateActor,
  getAllActors,
  getStreak
};
