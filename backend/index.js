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
        const type = req.query.type;

        console.log('Received type:', type);  // Verifica que el tipo es correcto
        console.log('UserID:', userID);      // Verifica que el userID es correcto

        let query = `
            SELECT t.*, 
                   u.name AS name,                -- Alias 'name' para el nombre del usuario
                   u.picture AS picture,          -- Alias 'picture' para la foto de perfil del usuario
                   COALESCE((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID), 0) AS likesCount,
                   COALESCE((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID), 0) AS retweetsCount,
                   COALESCE((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID), 0) AS savesCount,
                   COALESCE((SELECT COUNT(*) FROM CommentsOwl c WHERE c.tweetID = t.tweetID), 0) AS commentsCount,
                   IF((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID AND l.userID = ?), true, false) AS isLiked,
                   IF((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID AND r.userID = ?), true, false) AS isRetweeted,
                   IF((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID AND s.userID = ?), true, false) AS isSaved
            FROM TweetsOwl t
            LEFT JOIN UsersOwl u ON t.userID = u.sub    -- Unir con la tabla de usuarios para obtener 'name' y 'picture'
        `;

        if (type === 'followees') {
            console.log('Type is followees'); // Verifica si entra en el bloque de followees
            query += `
                WHERE t.userID IN (SELECT followeeID FROM FollowsOwl WHERE followerID = ?)
            `;
        }

        query += ` ORDER BY t.creation DESC`;

        console.log('Executing query:', query);  // Verifica la consulta generada

        // Ejecutar la consulta con los parámetros correctos
        let tweets;
        if (type === 'followees') {
            tweets = await MySQL.makeQuery(query, [userID, userID, userID, userID]);
        } else {
            tweets = await MySQL.makeQuery(query, [userID, userID, userID]);
        }

        console.log('Tweets fetched:', tweets);  // Verifica los resultados obtenidos

        if (tweets.length === 0) {
            console.log('No tweets found, returning empty array');
            return res.send({ status: "ok", tweets: [] });  // Devuelve un array vacío si no hay tweets
        }

        res.send({ status: "ok", tweets });
    } catch (error) {
        console.error('Error fetching tweets:', error);  // Loguea el error detalladamente
        res.status(500).send({ status: "error", message: "An error occurred while fetching tweets." });
    }
});

app.get('/tweet/:tweetID', async function (req, res) {
    try {
        const { tweetID } = req.params;  // Obtén el tweetID de los parámetros de la URL
        console.log(req.query)
        const { userID } = req.query;   // Obtén el userID de los parámetros de la consulta

        // Verifica que tweetID y userID no sean undefined o null
        if (!tweetID || !userID) {
            return res.status(400).send({ status: "error", message: "tweetID and userID are required" });
        }

        console.log("Received tweetID:", tweetID);
        console.log("Received userID:", userID);

        let query = `
            SELECT t.*, 
                   u.name AS name,
                   u.picture AS picture,
                   COALESCE((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID), 0) AS likesCount,
                   COALESCE((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID), 0) AS retweetsCount,
                   COALESCE((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID), 0) AS savesCount,
                   COALESCE((SELECT COUNT(*) FROM CommentsOwl c WHERE c.tweetID = t.tweetID), 0) AS commentsCount,
                   IF((SELECT COUNT(*) FROM LikesOwl l WHERE l.tweetID = t.tweetID AND l.userID = ?), true, false) AS isLiked,
                   IF((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.tweetID = t.tweetID AND r.userID = ?), true, false) AS isRetweeted,
                   IF((SELECT COUNT(*) FROM SavesOwl s WHERE s.tweetID = t.tweetID AND s.userID = ?), true, false) AS isSaved
            FROM TweetsOwl t
            LEFT JOIN UsersOwl u ON t.userID = u.sub
            WHERE t.tweetID = ?
        `;

        // Ejecutar la consulta con los parámetros correctos
        const tweet = await MySQL.makeQuery(query, [userID, userID, userID, tweetID]);

        if (tweet.length === 0) {
            return res.status(404).send({ status: "error", message: "Tweet not found" });
        }

        console.log(tweet[0])
        res.send({ status: "ok", tweet: tweet[0] });
    } catch (error) {
        console.error('Error fetching tweet:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching tweet." });
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

  app.get('/tweets/:tweetID/comments', async function (req, res) {
    try {
        const { tweetID } = req.params;
        const { userID } = req.query; // Obtener el userID del usuario actual que realiza la petición

        // Verificar si tweetID y userID existen
        if (!tweetID || !userID) {
            return res.status(400).send({ status: "error", message: "tweetID and userID are required" });
        }

        // Verificar si el tweet existe
        const tweetExists = await MySQL.makeQuery(`SELECT tweetID FROM TweetsOwl WHERE tweetID = ?`, [tweetID]);
        if (tweetExists.length === 0) {
            return res.status(404).send({ status: "error", message: "Tweet not found." });
        }

        // Obtener todos los comentarios asociados al tweet, junto con la información del usuario y métricas adicionales
        const comments = await MySQL.makeQuery(
            `
            SELECT c.*, 
                   u.given_name AS givenName,
                   u.nickname AS nickname,
                   u.picture AS picture,
                   COALESCE((SELECT COUNT(*) FROM LikesOwl l WHERE l.commentID = c.commentID), 0) AS likesCount,
                   COALESCE((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.commentID = c.commentID), 0) AS retweetsCount,
                   COALESCE((SELECT COUNT(*) FROM SavesOwl s WHERE s.commentID = c.commentID), 0) AS savesCount,
                   COALESCE((SELECT COUNT(*) FROM CommentsOwl cc WHERE cc.parentCommentID = c.commentID), 0) AS commentsCount,
                   IF((SELECT COUNT(*) FROM LikesOwl l WHERE l.commentID = c.commentID AND l.userID = ?), true, false) AS isLiked,
                   IF((SELECT COUNT(*) FROM RetweetsOwl r WHERE r.commentID = c.commentID AND r.userID = ?), true, false) AS isRetweeted,
                   IF((SELECT COUNT(*) FROM SavesOwl s WHERE s.commentID = c.commentID AND s.userID = ?), true, false) AS isSaved
            FROM CommentsOwl c
            LEFT JOIN UsersOwl u ON c.userID = u.sub
            WHERE c.tweetID = ?
            ORDER BY c.creation DESC
            `,
            [userID, userID, userID, tweetID]
        );

        res.send({ status: "ok", comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send({ status: "error", message: "An error occurred while fetching comments." });
    }
});



  app.post('/comment', async function (req, res) {
    try {
        const { userID, tweetID, content } = req.body;

        // Validar que todos los campos requeridos están presentes
        if (!userID || !tweetID || !content) {
            return res.status(400).send({ status: "error", message: "All fields (userID, tweetID, content) are required." });
        }

        // Verificar si el tweet existe
        const tweetExists = await MySQL.makeQuery(`SELECT tweetID FROM TweetsOwl WHERE tweetID = ?`, [tweetID]);
        if (tweetExists.length === 0) {
            return res.status(404).send({ status: "error", message: "Tweet not found." });
        }

        // Insertar el nuevo comentario en la base de datos
        const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await MySQL.makeQuery(
            `INSERT INTO CommentsOwl (tweetID, userID, content, creation) VALUES (?, ?, ?, ?)`,
            [tweetID, userID, content, creationDate]
        );

        res.send({ status: "ok", message: "Comment added successfully!" });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send({ status: "error", message: "An error occurred while adding the comment." });
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
            return res.send({ status: "ok", message: "Retweet removed successfully!", action: "removed" });
        } else {
            // Insertar un nuevo retweet
            const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await MySQL.makeQuery(
                `INSERT INTO RetweetsOwl (tweetID, userID, creation) VALUES (?, ?, ?)`,
                [body.tweetID, body.userID, creationDate]
            );
            return res.send({ status: "ok", message: "Tweet retweeted successfully!", action: "added" });
        }
    } catch (error) {
        console.error('Error retweeting the tweet:', error);
        res.status(500).send({ status: "error", message: "An error occurred while retweeting the tweet." });
    }
  });
  
  app.post('/save', async function (req, res) {
    try {
        let body = req.body;

        console.log('Received POST body:', body);  // Añadir console.log aquí para ver el body recibido

        // Validación de los campos requeridos
        if (!body.userID || !body.tweetID) {
            console.log('ME FUI ACA: VALIDACION CAMPOS');
            return res.status(400).send({ status: "error", message: "User 'userID' and 'tweetID' are required." });
        }

        // Verificar si el tweet existe
        let tweetExists = await MySQL.makeQuery(`SELECT tweetID FROM TweetsOwl WHERE tweetID = ?`, [body.tweetID]);

        if (tweetExists.length === 0) {
            console.log('ME FUI ACA: VALIDACION TWEET');
            return res.status(404).send({ status: "error", message: "Tweet not found" });
        }

        // Verificar si el usuario ya guardó el tweet
        let saveExists = await MySQL.makeQuery(`SELECT * FROM SavesOwl WHERE tweetID = ? AND userID = ?`, [body.tweetID, body.userID]);

        if (saveExists.length > 0) {
            // Eliminar el save existente
            await MySQL.makeQuery(`DELETE FROM SavesOwl WHERE tweetID = ? AND userID = ?`, [body.tweetID, body.userID]);
            console.log('Save removed');
            return res.send({ status: "ok", message: "Save removed successfully!", action: "removed" });
        } else {
            // Insertar un nuevo save
            const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await MySQL.makeQuery(
                `INSERT INTO SavesOwl (tweetID, userID, creation) VALUES (?, ?, ?)`,
                [body.tweetID, body.userID, creationDate]
            );
            console.log('Tweet saved');
            return res.send({ status: "ok", message: "Tweet saved successfully!", action: "added" });
        }
    } catch (error) {
        console.log('ME FUI ACA: ERROR CATCH');  // Imprimir el error
        console.error('Error saving the tweet:', error);
        res.status(500).send({ status: "error", message: "An error occurred while saving the tweet." });
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
