const pool = require('../database');

class UserRoleDetailsController {
  static getData(req, res) {
    // Query to select all rows from the COA_USER_ROLE_ASSIGNMENT table
    const sql = 'SELECT * FROM COA_USER_ROLE_ASSIGNMENT';

    // Execute the query
    pool.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the 'index.ejs' template with the retrieved data
      res.render('assignUserRoleDetails', { data: results });
    });
  }

  static updateUserRoleDetails(req, res) {
        const { USER_ROLE_ASSIGNMENT_ID, USERNAME, ROLE_NAME, DESCRIPTION } = req.body;
      
        pool.getConnection((err, connection) => {
          if (err) {
            throw err;
          }
      
          const query =
            'UPDATE COA_USER_ROLE_ASSIGNMENT SET USERNAME=?, ROLE_NAME=?, DESCRIPTION=? WHERE USER_ROLE_ASSIGNMENT_ID=?';
      
          const values = [USERNAME, ROLE_NAME, DESCRIPTION, USER_ROLE_ASSIGNMENT_ID];
      
          connection.query(query, values, (error, result) => {
            connection.release();
      
            if (error) {
              console.error('Error updating user role details:', error);
              res.status(500).send('Internal Server Error');
              return;
            }
            
            res.redirect('/userRoleDetails'); // Redirect to the page displaying all data after update
          });
        });
      }
}
module.exports = UserRoleDetailsController;

