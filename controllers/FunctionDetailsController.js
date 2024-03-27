const pool = require('../database');

class UserRoleDetailsController {
  static getFunctionData(req, res) {
    // Query to select all rows from the COA_USER_ROLE_ASSIGNMENT table
    const sql = 'SELECT * FROM COA_FUNCTION';

    // Execute the query
    pool.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the 'index.ejs' template with the retrieved data
      res.render('FunctionDetails', { data: results });   //  views\FunctionDetails.ejs
    });
  }

  static updateFunctionDetails(req, res) {
        const { FUNCTION_ID, FUNCTION_NAME, MENU_NAME, DESCRIPTION } = req.body;
      
        pool.getConnection((err, connection) => {
          if (err) {
            throw err;
          }
      
          const query =
            'UPDATE COA_FUNCTION SET FUNCTION_NAME=?, MENU_NAME=?, DESCRIPTION=? WHERE FUNCTION_ID=?';
      
          const values = [FUNCTION_NAME, MENU_NAME, DESCRIPTION, FUNCTION_ID];
      
          connection.query(query, values, (error, result) => {
            connection.release();
      
            if (error) {
              console.error('Error updating user role details:', error);
              res.status(500).send('Internal Server Error');
              return;
            }
            
            res.redirect('/functionDetails'); // Redirect to the page displaying all data after update
          });
        });
      }
}
module.exports = UserRoleDetailsController;

