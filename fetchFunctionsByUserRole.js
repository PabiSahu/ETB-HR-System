// middleware/fetchFunctionsByUserRole.js
 
const connectionPool = require('./database'); // Import your database connection
 
const fetchFunctionsByUserRole = (req, res, next) => {
  const username = req.session.username;
 
  if (!username) {
    // If username is not found in the session, move to the next middleware or route
    return next();
  }
 
  // Query to fetch allowed functions and roles based on user
  const query = `
    SELECT DISTINCT cf.FUNCTION_NAME, r.ROLE_NAME
    FROM COA_FUNCTION cf
    JOIN COA_MENU cm ON cf.menu_name = cm.menu_name
    JOIN COA_RESPONSIBILITY cr ON cm.RESPONSIBILITY_NAME = cr.RESPONSIBILITY_NAME
    JOIN COA_ROLES r ON cr.ROLE_NAME = r.role_name
    JOIN COA_USER_ROLE_ASSIGNMENT u ON r.ROLE_NAME = u.ROLE_NAME
    WHERE u.USERNAME = ?;
  `;
 
  connectionPool.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching functions and roles:', err);
      return next(err); // Move to the error handling middleware
    }
 
    const allowedFunctions = results.map(result => result.FUNCTION_NAME);
    const userRoles = results.map(result => result.ROLE_NAME);

    console.log(results);
 
    // Attach allowedFunctions and userRoles to res.locals for access in views
    res.locals.allowedFunctions = allowedFunctions;
    res.locals.userRoles = userRoles;
 
    next(); // Move to the next middleware or route
  });
};
 
module.exports = fetchFunctionsByUserRole;