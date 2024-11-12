// pages/api/auth/login.js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import db from '../../../lib/db'; // Importa tu conexión a la base de datos

const loginHandler = async (req, res) => {
  console.log("ENTRE")
  await handleLogin(req, res, {
    async afterCallback(req, res, session) {
      if (session) {
        const { user } = session;
        
        // Verificar si el usuario ya existe en la base de datos
        const [rows] = await db.query('SELECT * FROM UsersOwl WHERE sub = ?', [user.sub]);

        if (rows.length === 0) {
          // Crear un nuevo usuario si no existe
          await db.query(
            'INSERT INTO UsersOwl (given_name, family_name, nickname, name, picture, updated_at, sub) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.given_name, user.family_name, user.nickname, user.name, user.picture, new Date(), user.sub]
          );
        }
        
        // Redirigir o devolver una respuesta
        res.redirect('/profile'); // Redirige a la página de perfil después de iniciar sesión
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    }
  });
};

export default handleAuth({
  login: loginHandler,
});
