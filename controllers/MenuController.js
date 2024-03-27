// FunctionController.js

const connection = require('../database');

class MenuController {
  static async createMenu(req, res) {
    const { MENU_NAME, RESPONSIBILITY_NAME, DESCRIPTION} = req.body;

    const query = `
      INSERT INTO COA_MENU (MENU_NAME, RESPONSIBILITY_NAME, DESCRIPTION)
      VALUES (?, ?, ?);
    `;

    try {
      await connection.execute(query, [MENU_NAME, RESPONSIBILITY_NAME, DESCRIPTION]);
      res.redirect(req.get('referer') || '/Menu');
    } catch (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

static async renderMenuPage(req, res) {
  connection.query('SELECT RESPONSIBILITY_NAME FROM COA_RESPONSIBILITY', (error, results) => {
    if (error) throw error;

    const responsibilityNames = results.map(result => result.RESPONSIBILITY_NAME);

    console.log('responsibilityNames:', responsibilityNames);

    res.render('Menu', { responsibilityNames: responsibilityNames,  employeeDetails: req.employeeDetails  });
  });
}
}


module.exports = MenuController;
