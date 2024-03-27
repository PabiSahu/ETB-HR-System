

// UserRoleController.js

const db = require('../database');

class UserRoleController {
  static renderInsertForm(req, res) {
    res.render('RoleAssign'); // views\RoleAssign.ejs
  }

  static insertUserRole(req, res) {
    const { username, roleName, description, createdBy } = req.body;

    const query = 'INSERT INTO COA_USER_ROLE_ASSIGNMENT (USERNAME, ROLE_NAME, DESCRIPTION, CREATED_BY) VALUES (?, ?, ?, ?)';
    const values = [username, roleName, description, createdBy];

    db.query(query, values, (error, results) => {
      if (error) throw error;
      res.redirect('/UserRole');
    });
  }

  // Add a static method to fetch usernames from ETB_HR_REGISTER_FORM
  static getUsernames(req, res) {
    const query = 'SELECT USERNAME FROM ETB_HR_REGISTER_FORM';

    db.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  }

  // Add a static method to fetch role names from COA_USER_ROLE_ASSIGNMENT
  static getRoleNames(req, res) {
    const query = 'SELECT ROLE_NAME FROM COA_ROLES';

    db.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  }
}

module.exports = UserRoleController;
