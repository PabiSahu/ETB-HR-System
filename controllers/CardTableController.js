// CardTableController.js
const database = require('../database'); // Import your database connection module

const CardTableController = {
  getCardData: (request, response) => {
    const employeeId = request.session.employeeId;
    const employeeDetails = request.employeeDetails;
    const query = 'SELECT * FROM ETB_HR_PROJECT_TIMECARD_DETAILS JOIN Child_Lookup ON ETB_HR_PROJECT_TIMECARD_DETAILS.STATUS_ID = Child_Lookup.CHILD_ID AND EMPLOYEE_ID=? ';

    database.query(query, [employeeId], (error, data) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
      } else {
        response.render('CardTable', { employeeId, data,employeeDetails});
      }
    });
  },

  deleteRecord: (request, response) => {
    const id = request.params.id;
    const query = `DELETE FROM ETB_HR_PROJECT_TIMECARD_DETAILS WHERE PROJ_TIMECARD_ID = "${id}"`;

    database.query(query, (error, data) => {
      if (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
      } else {
        response.json({ success: true });
      }
    });
  },
};

module.exports = CardTableController;
