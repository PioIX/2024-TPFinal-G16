require('dotenv').config({ path: '../.env.local' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const MySQL = require('./modules/mysql');

const app = express();
const port = 5001;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors()); // Permitir todas las solicitudes de origen cruzado

// Middleware para analizar JSON en solicitudes entrantes
app.use(express.json());

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

app.get('/', (req, res) => {
  res.send({ message: 'API working successfully' });
});

app.post('/register', async function (req, res) {
  try {
      let body = req.body;

      // Validación de los campos requeridos
      if (!body.given_name || !body.family_name || !body.nickname || !body.name || !body.picture || !body.updated_at || !body.sub || !body.sid) {
          return res.status(400).send({ status: "error", message: "All fields are required." });
      }

      // Formatear el campo updated_at
      const formattedUpdatedAt = formatDate(body.updated_at);

      // Verificar si el usuario ya existe en la base de datos
      let userExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [body.sub]);

      if (userExists.length === 0) {
          // Insertar un nuevo usuario si no existe
          await MySQL.makeQuery(
              `INSERT INTO UsersOwl (sub, given_name, family_name, nickname, name, picture, updated_at, sid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [body.sub, body.given_name, body.family_name, body.nickname, body.name, body.picture, formattedUpdatedAt, body.sid]
          );
          res.send({ status: "ok", message: "User registered successfully!", id_user: body.sub });
      } else {
          // Si el usuario ya existe, actualizar los datos
          await MySQL.makeQuery(
              `UPDATE UsersOwl SET given_name = ?, family_name = ?, nickname = ?, name = ?, picture = ?, updated_at = ?, sid = ? WHERE sub = ?`,
              [body.given_name, body.family_name, body.nickname, body.name, body.picture, formattedUpdatedAt, body.sid, body.sub]
          );
          res.send({ status: "ok", message: "User updated successfully!", id_user: body.sub });
      }
  } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).send({ status: "error", message: "An error occurred during registration." });
  }
});

app.get('/user/:sub', async function (req, res) {
    try {
        const sub = decodeURIComponent(req.params.sub); // Decodifica el sub recibido en la URL
        let user = await MySQL.makeQuery(`SELECT * FROM UsersOwl WHERE sub = ?`, [sub]);

        if (user.length === 0) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }

        res.send({ status: "ok", user: user[0] });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching user." });
    }
});


app.post('/tweet', async function (req, res) {
  try {
      let body = req.body;
        console.log(body)
      // Validación de los campos requeridos
      if (!body.sub || !body.content) {
          return res.status(400).send({ status: "error", message: "User 'sub' and 'content' are required." });
      }

      // Verificar si el usuario existe
      let userExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [body.sub]);

      if (userExists.length === 0) {
          return res.status(404).send({ status: "error", message: "User not found" });
      }

      // Insertar el nuevo tweet
      const formattedCreationDate = formatDate(new Date());
      await MySQL.makeQuery(
          `INSERT INTO TweetsOwl (userID, content, mediaURL, creation) VALUES (?, ?, ?, ?)`,
          [body.sub, body.content, body.mediaURL || null, formattedCreationDate]
      );

      res.send({ status: "ok", message: "Tweet created successfully!" });
  } catch (error) {
      console.error('Error creating tweet:', error);
      res.status(500).send({ status: "error", message: "An error occurred while creating the tweet." });
  }
});

app.get('/user/:sub/tweets', async function (req, res) {
    try {
        const { sub } = req.params;
        console.log('Fetching tweets for user with sub:', sub); // Log para verificar el valor de sub

        // Verificar si el usuario existe
        let userExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [sub]);
        console.log('User existence check result:', userExists);

        if (userExists.length === 0) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }

        // Obtener todos los tweets del usuario
        let tweets = await MySQL.makeQuery(`SELECT * FROM TweetsOwl WHERE userID = ? ORDER BY creation DESC`, [sub]);
        res.send({ status: "ok", tweets });
    } catch (error) {
        console.error('Error fetching user tweets:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching user tweets." });
    }
});



app.get('/tweets', async function (req, res) {
    try {
        const userID = req.query.userID;  // Asumimos que el userID se pasa como parámetro de consulta
  
        // Obtener los tweets con la cantidad de likes, retweets, saves, comments y estado de interacción (booleano)
        let tweets = await MySQL.makeQuery(`
          SELECT t.*, 
                 COALESCE((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID), 0) AS likesCount,
                 COALESCE((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID), 0) AS retweetsCount,
                 COALESCE((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID), 0) AS savesCount,
                 COALESCE((SELECT COUNT(*) FROM CommentsOwl c WHERE c.tweetID = t.tweetID), 0) AS commentsCount,
                 IF((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID AND l.userID = ?), true, false) AS isLiked,
                 IF((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID AND r.userID = ?), true, false) AS isRetweeted,
                 IF((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID AND s.userID = ?), true, false) AS isSaved
          FROM TweetsOwl t
          ORDER BY t.creation DESC
        `, [userID, userID, userID]);
  
        if (tweets.length === 0) {
            return res.status(404).send({ status: "error", message: "No tweets found" });
        }
  
        // Enviar los tweets con la cantidad de interacciones y el estado de interacción del usuario
        res.send({ status: "ok", tweets });
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching tweets." });
    }
  });
  
  
  
  
  

app.post('/like', async function (req, res) {
    try {
        let body = req.body;
  
        // Validación de los campos requeridos
        if (!body.sub || !body.tweetID) {
            return res.status(400).send({ status: "error", message: "User 'sub' and 'tweetID' are required." });
        }
  
        // Verificar si el tweet existe
        let tweetExists = await MySQL.makeQuery("SELECT tweetID FROM TweetsOwl WHERE tweetID = ?", [body.tweetID]);
  
        if (tweetExists.length === 0) {
            return res.status(404).send({ status: "error", message: "Tweet not found" });
        }
  
        // Verificar si el usuario ya le dio like al tweet
        let likeExists = await MySQL.makeQuery("SELECT * FROM LikesOwl WHERE tweetID = ? AND userID = ?", [body.tweetID, body.sub]);
  
        if (likeExists.length > 0) {
            // Eliminar el like existente
            await MySQL.makeQuery("DELETE FROM LikesOwl WHERE tweetID = ? AND userID = ?", [body.tweetID, body.sub]);
            return res.send({ status: "ok", message: "Like removed successfully!", action: "removed" });
        } else {
            // Insertar un nuevo like
            const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await MySQL.makeQuery(
                "INSERT INTO LikesOwl (tweetID, userID, creation) VALUES (?, ?, ?)",
                [body.tweetID, body.sub, creationDate]
            );
            return res.send({ status: "ok", message: "Tweet liked successfully!", action: "added" });
        }
    } catch (error) {
        console.error('Error liking the tweet:', error);
        res.status(500).send({ status: "error", message: "An error occurred while liking the tweet." });
    }
  });
  

app.get('/user/:sub/likes', async function (req, res) {
    try {
        const sub = decodeURIComponent(req.params.sub);
        const likedTweets = await MySQL.makeQuery(
            `SELECT t.* FROM TweetsOwl t 
             INNER JOIN LikesOwl l ON t.tweetID = l.tweetID 
             WHERE l.userID = ? ORDER BY l.creation DESC`, 
            [sub]
        );

        res.send({ status: "ok", likes: likedTweets });
    } catch (error) {
        console.error('Error fetching liked tweets:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching liked tweets." });
    }
});



app.post('/retweet', async function (req, res) {
    try {
        let body = req.body;
  
        // Validación de los campos requeridos
        if (!body.userID || !body.tweetID) {
            return res.status(400).send({ status: "error", message: "User 'userID' and 'tweetID' are required." });
        }
  
        // Verificar si el tweet existe
        let tweetExists = await MySQL.makeQuery(`SELECT tweetID FROM TweetsOwl WHERE tweetID = ?`, [body.tweetID]);
  
        if (tweetExists.length === 0) {
            return res.status(404).send({ status: "error", message: "Tweet not found" });
        }
  
        // Verificar si el usuario ya hizo retweet del tweet
        let retweetExists = await MySQL.makeQuery(`SELECT * FROM RetweetsOwl WHERE tweetID = ? AND userID = ?`, [body.tweetID, body.userID]);
  
        if (retweetExists.length > 0) {
            // Eliminar el retweet existente
            await MySQL.makeQuery(`DELETE FROM RetweetsOwl WHERE tweetID = ? AND userID = ?`, [body.tweetID, body.userID]);
            return res.send({ status: "ok", message: "Retweet removed successfully!" });
        } else {
            // Insertar un nuevo retweet
            const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await MySQL.makeQuery(
                `INSERT INTO RetweetsOwl (tweetID, userID, creation) VALUES (?, ?, ?)`,
                [body.tweetID, body.userID, creationDate]
            );
            return res.send({ status: "ok", message: "Tweet retweeted successfully!" });
        }
    } catch (error) {
        console.error('Error retweeting the tweet:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retweeting the tweet." });
    }
  });
  

app.get('/user/:sub/retweets', async function (req, res) {
    try {
        const sub = decodeURIComponent(req.params.sub);
        const retweets = await MySQL.makeQuery(
            `SELECT t.* FROM TweetsOwl t 
             INNER JOIN RetweetsOwl r ON t.tweetID = r.tweetID 
             WHERE r.userID = ? ORDER BY r.creation DESC`, 
            [sub]
        );

        res.send({ status: "ok", retweets });
    } catch (error) {
        console.error('Error fetching retweets:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching retweets." });
    }
});



app.post('/follow', async function (req, res) {
    try {
        let body = req.body;
        console.log("follow:", body)
        // Validación de los campos requeridos
        if (!body.followerID || !body.followeeID) {
            return res.status(400).send({ status: "error", message: "Both 'followerID' and 'followeeID' are required." });
        }
  
        // Verificar si los usuarios existen
        let followerExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [body.followerID]);
        let followeeExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [body.followeeID]);
  
        if (followerExists.length === 0 || followeeExists.length === 0) {
            return res.status(404).send({ status: "error", message: "One or both users not found" });
        }
  
        // Verificar si el usuario ya está siguiendo al otro
        let followExists = await MySQL.makeQuery(`SELECT * FROM FollowsOwl WHERE followerID = ? AND followeeID = ?`, [body.followerID, body.followeeID]);
  
        if (followExists.length > 0) {
            // Eliminar el follow existente
            await MySQL.makeQuery(`DELETE FROM FollowsOwl WHERE followerID = ? AND followeeID = ?`, [body.followerID, body.followeeID]);
            return res.send({ status: "ok", message: "Unfollowed successfully!" });
        } else {
            // Insertar una nueva relación de seguimiento
            const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await MySQL.makeQuery(
                `INSERT INTO FollowsOwl (followerID, followeeID, creation) VALUES (?, ?, ?)`,
                [body.followerID, body.followeeID, creationDate]
            );
            return res.send({ status: "ok", message: "User followed successfully!" });
        }
    } catch (error) {
        console.error('Error following the user:', error);
        res.status(500).send({ status: "error", message: "An error occurred while following the user." });
    }
  });
  

app.get('/user/:sub/followers', async function (req, res) {
    try {
        const { sub } = req.params;
  
        // Verificar si el usuario existe
        let userExists = await MySQL.makeQuery(`SELECT sub FROM UsersOwl WHERE sub = ?`, [sub]);
  
        if (userExists.length === 0) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
  
        // Obtener todos los seguidores del usuario
        let followers = await MySQL.makeQuery(
            `SELECT followerID FROM FollowsOwl WHERE followeeID = ?`, [sub]
        );
  
        res.send({ status: "ok", followers });
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching followers." });
    }
  });
  


// Iniciar el servidor
const server = app.listen(port, () => {
  console.log(`API Server listening on port ${port}`);
});

// Manejar la señal de interrupción (CTRL+C) para cerrar el servidor
process.on('SIGINT', () => server.close());
