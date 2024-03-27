/// ResponsibilityController.js
const connection = require('../database'); // Make sure this is correctly pointing to your database connection

class ResponsibilityController {
  static async createResponsibility(req, res) {
    const { RESPONSIBILITY_NAME, ROLE_NAME, DESCRIPTION } = req.body;

    const query = `
      INSERT INTO COA_RESPONSIBILITY (RESPONSIBILITY_NAME, ROLE_NAME, DESCRIPTION)
      VALUES (?, ?, ?);
    `;

    try {
      await connection.execute(query, [RESPONSIBILITY_NAME, ROLE_NAME, DESCRIPTION]);
      res.redirect(req.get('referer') || '/responsibility');
    } catch (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
static async renderRolePage(req, res) {
  connection.query('SELECT ROLE_NAME FROM COA_ROLES', (error, results) => {
    if (error) throw error;

    const roleNames = results.map(result => result.ROLE_NAME);

    console.log('roleNames:', roleNames);

    res.render('responsibility', { roleNames: roleNames,  employeeDetails: req.employeeDetails } );
  });
}
}
module.exports = ResponsibilityController;
