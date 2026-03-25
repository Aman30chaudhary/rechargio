/**
 * IP Whitelist Middleware
 * Restricts access to routes based on the client's IP address.
 */

const allowedIPs = ["127.0.0.1", "::1", "::ffff:127.0.0.1"]; // Add your public IP here if needed

const ipWhitelistMiddleware = (req, res, next) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  
  // Normalize IP (handle IPv6-mapped IPv4)
  const normalizedIP = clientIP.startsWith("::ffff:") ? clientIP.substring(7) : clientIP;

  if (allowedIPs.includes(normalizedIP)) {
    next();
  } else {
    console.warn(`[SECURITY] Blocked unauthorized access attempt from IP: ${clientIP} to ${req.originalUrl}`);
    res.status(403).json({ 
      error: "Access Denied: Unauthorized IP",
      message: "Your IP address is not whitelisted for this administrative area."
    });
  }
};

module.exports = ipWhitelistMiddleware;
