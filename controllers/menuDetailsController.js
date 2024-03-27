const pool = require('../database');

class UserRoleDetailsController {
  static getMenuData(req, res) {
    // Query to select all rows from the COA_MENU table
    const sql = 'SELECT * FROM COA_MENU';

    // Execute the query
    pool.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Render the 'index.ejs' template with the retrieved data
      res.render('MenuDetails', { data: results });
    });
  }

  static updateMenuDetails(req, res) {
        const { MENU_ID, MENU_NAME, RESPONSIBILITY_NAME, DESCRIPTION } = req.body;
      
        pool.getConnection((err, connection) => {
          if (err) {
            throw err;
          }
      
          const query =
            'UPDATE COA_MENU SET MENU_NAME=?, RESPONSIBILITY_NAME=?, DESCRIPTION=? WHERE MENU_ID=?';
      
          const values = [MENU_NAME, RESPONSIBILITY_NAME, DESCRIPTION, MENU_ID];
      
          connection.query(query, values, (error, result) => {
            connection.release();
      
            if (error) {
              console.error('Error updating user role details:', error);
              res.status(500).send('Internal Server Error');
              return;
            }
            
            res.redirect('/menuDetails'); // Redirect to the page displaying all data after update
          });
        });
      }
}
module.exports = UserRoleDetailsController;

