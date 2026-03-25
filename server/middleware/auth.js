const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// Initialize firebase admin (requires service account file)
// admin.initializeApp({
//   credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
// });

exports.userAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify firebase token (commented out for now)
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
