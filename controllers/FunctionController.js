// FunctionController.js

const connection = require('../database');

class FunctionController {
  static async createFunction(req, res) {
    const { FUNCTION_NAME, MENU_NAME, DESCRIPTION} = req.body;

    const query = `
      INSERT INTO COA_FUNCTION (FUNCTION_NAME, MENU_NAME, DESCRIPTION)
      VALUES (?, ?, ?);
    `;

    try {
      await connection.execute(query, [FUNCTION_NAME, MENU_NAME, DESCRIPTION]);
      res.redirect(req.get('referer') || '/Function');
    } catch (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

static async renderFunctionPage(req, res) {
  connection.query('SELECT MENU_NAME FROM COA_MENU', (error, results) => {
    if (error) throw error;

    const menuNames = results.map(result => result.MENU_NAME);

    console.log('menuNames:', menuNames);

    res.render('Function', { menuNames: menuNames,  employeeDetails: req.employeeDetails  });
  });
}
}

module.exports = FunctionController;
