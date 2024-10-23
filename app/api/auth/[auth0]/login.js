// pages/api/auth/login.js
import { handleAuth, handleLogin, getSession } from '@auth0/nextjs-auth0';
import db from '../../../lib/db'; // Importa tu conexión a la base de datos

const loginHandler = async (req, res) => {
  await handleLogin(req, res, async (session) => {
    if (session) {
      const { user } = session;

      // Verificar si el usuario ya existe en la base de datos
      const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [user.email]);

      if (!existingUser) {
        // Crear un nuevo usuario si no existe
        await db.query('INSERT INTO Users (email, name, picture) VALUES (?, ?, ?)', [user.email, user.name, user.picture]);
      }

      // Redirigir o devolver una respuesta
      res.redirect('/profile'); // Redirige a la página de perfil después de iniciar sesión
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
};

export default handleAuth({
  login: loginHandler,
});
