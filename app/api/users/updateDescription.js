import db from '../../../modules/db';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res);
  const userEmail = session.user.email;

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests allowed' });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  try {
    await db.query(
      'UPDATE users SET description = ? WHERE email = ?',
      [description, userEmail]
    );
    res.status(200).json({ message: 'Description updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating description' });
  }
});
