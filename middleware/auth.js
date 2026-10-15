const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

async function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['admin', 'ad_manager', 'store_manager'].includes(decoded.role)) return res.status(403).json({ error: 'Admin access required' });

    const db = getDB();
    const admin = await db.collection('admins').findOne({ _id: require('mongodb').ObjectId.createFromHexString(decoded.id) }, { projection: { password: 0 } });
    if (!admin || admin.active === false) return res.status(401).json({ error: 'Admin account is inactive' });

    const role = admin.role || 'admin';
    const path = req.originalUrl.split('?')[0];
    const canManageStore = path === '/api/upload' || path === '/api/upload/multiple' || path.startsWith('/api/admin/products') || path.startsWith('/api/admin/categories') || path.startsWith('/api/admin/subcategories') || path.startsWith('/api/admin/brands') || path.startsWith('/api/admin/orders') || path === '/api/admin/dashboard/stats';
    const canManageAdvertising = path === '/api/auth/admin/me' || path === '/api/admin/settings' || path === '/api/settings' || path === '/api/admin/change-password';
    if (role === 'ad_manager' && !canManageAdvertising) return res.status(403).json({ error: 'Advertising manager access required' });
    if (role === 'store_manager' && !(canManageStore || path === '/api/auth/admin/me' || path === '/api/admin/change-password')) return res.status(403).json({ error: 'Store manager access required' });

    req.admin = { ...admin, role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function generateToken(user, role = 'user') {
  return jwt.sign({ id: user._id.toString(), role }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { adminAuth, generateToken };
