import db from '../../../modules/db';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT name, email, picture, description FROM users WHERE name LIKE ? OR email LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for users' });
  }
}
