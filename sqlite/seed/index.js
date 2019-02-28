const sqlite = require("../")

exports.initialize = async () => {
  try {
    console.log(await sqlite.open())
    await sqlite.run('CREATE TABLE IF NOT EXISTS actors(id integer NOT NULL PRIMARY KEY, login text, avatar_url text);')
    await sqlite.run('CREATE TABLE IF NOT EXISTS repos(id integer NOT NULL PRIMARY KEY, name text, url text);')
    await sqlite.run('CREATE TABLE IF NOT EXISTS events(id integer NOT NULL PRIMARY KEY, type text, actor_id integer, repo_id integer, created_at text);')
    sqlite.close()
    console.log("TABLES CREATED!!")
  }
  catch (err) {
      sqlite.close()
      throw err
  }
}

const prepoblate = async () => {
  await sqlite.run(`
  INSERT OR REPLACE 
  INTO actors (id, login, avatar_url) 
  VALUES 
    (2790311, 'daniel33', 'https://avatars.com/2790311'),
    (2907782, 'eric66', 'https://avatars.com/2907782'),
    (4276597, 'iholloway', 'https://avatars.com/4276597'),
    (3698252, 'daniel51', 'https://avatars.com/3698252'),
    (4864659, 'katrinaallen', 'https://avatars.com/4864659'),
    (3648056, 'ysims', 'https://avatars.com/3648056'),
    (4949434, 'millerlarry', 'https://avatars.com/4949434'),
    (2917996, 'oscarschmidt', 'https://avatars.com/2917996'),
    (2222918, 'xnguyen', 'https://avatars.com/2222918'),
    (3466404, 'khunt', 'https://avatars.com/3466404');
  `);
  await sqlite.run(`
  INSERT OR REPLACE 
  INTO events (id, type, actor_id, created_at) 
  VALUES 
    (4055191679, 'PushEvent', 2790311, '2015-10-03 06:13:31'),
    (2712153979, 'PushEvent', 2907782, '2014-07-13 08:13:31'),
    (4633249595, 'PushEvent', 4276597, '2016-04-18 00:13:31'),
    (1514531484, 'PushEvent', 3698252, '2013-06-16 02:13:31'),
    (1838493121, 'PushEvent', 4864659, '2013-09-28 01:13:31'),
    (1979554031, 'PushEvent', 3648056, '2013-11-11 17:13:31'),
    (1536363444, 'PushEvent', 4949434, '2013-06-23 08:13:31'),
    (4501280090, 'PushEvent', 2917996, '2016-03-05 10:13:31'),
    (3822562012, 'PushEvent', 2222918, '2015-07-15 15:13:31'),
    (1319379787, 'PushEvent', 3466404, '2013-04-17 04:13:31');
  `)
}