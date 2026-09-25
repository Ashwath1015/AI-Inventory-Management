const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const register = async (userData) => {
  const { name, email, password, role } = userData;
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, passwordHash, role]
  );
  return result.rows[0];
};

const login = async (email, password) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = { register, login };
