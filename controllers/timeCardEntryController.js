// controllers/TimeCardController.js
 
const pool = require('../database');
 
class TimeCardController {
 
  static getCreateTimeCard(req, res) {
    // const username = req.session.username;
    const employeeId = req.session.employeeId;
    // Fetch data from MySQL table
    const selectQuery = 'SELECT * FROM ETB_HR_PROJECT_TIMECARD_DETAILS WHERE EMPLOYEE_ID=?';
    pool.query(selectQuery,[employeeId], (err, results) => {
      if (err) {
        console.error('Error fetching data from MySQL: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
 
      res.render('createTimeCardEntry', { employeeId,timeCardData: results,employeeDetails: req.employeeDetails });
    });
  }
 
  static postAddTimeCard(req, res) {
    // Your existing postAddTimeCard method code
       // Retrieve data from the form submission
    const {
        EMPLOYEE_ID,TIME_CARD_PERIOD, PROJECT_NAME, TASK_NAME, ACTIVITY_TYPE,
        SATURDAY, SUNDAY,MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, TOTAL_HOURS,
        PROJECT_DESC, FROM_DATE, TO_DATE, STATUS_ID,CREATION_DATE
      } = req.body;
 
 
      // const formattedEMPLOYEE_ID = EMPLOYEE_ID ? EMPLOYEE_ID : null;
      const formattedSATURDAY = SATURDAY ? SATURDAY : null;
      const formattedSUNDAY = SUNDAY ? SUNDAY : null;
      const formattedMONDAY = MONDAY  ? MONDAY : null;
      const formattedTUESDAY = TUESDAY  ? TUESDAY : null;
      const formattedWEDNESDAY = WEDNESDAY ? WEDNESDAY : null;
      const formattedTHURSDAY =THURSDAY  ? THURSDAY : null;
      const formattedFRIDAY = FRIDAY  ? FRIDAY : null;
      const formattedTOTAL_HOURS = TOTAL_HOURS  ? TOTAL_HOURS : null;
      const formattedPROJECT_DESC = PROJECT_DESC  ? PROJECT_DESC : null;
      const formattedFROM_DATE = FROM_DATE  ? FROM_DATE : null;
      const formattedTO_DATE = TO_DATE  ? TO_DATE : null;
 
     // Default STATUS_ID for submitted status
  const defaultStatusId = 7;
 
  // Fetch the STATUS_ID from Child_Lookup table with Child_Id 7
  const getStatusIdQuery = 'SELECT Child_Id FROM Child_Lookup WHERE Master_Lookup_values = "Etb Status" and Lookup_Values = "submitted"';
  pool.query(getStatusIdQuery, [defaultStatusId], (statusErr, statusResults) => {
      if (statusErr) {
          console.error('Error fetching STATUS_ID from Child_Lookup: ', statusErr);
          res.status(500).send('Internal Server Error');
          return;
      }
 
      const STATUS_ID = statusResults[0].Child_Id;
 
 
  const insertQuery = `
      INSERT INTO ETB_HR_PROJECT_TIMECARD_DETAILS (
        EMPLOYEE_ID,TIME_CARD_PERIOD, PROJECT_NAME, TASK_NAME, ACTIVITY_TYPE,
         SATURDAY, SUNDAY, MONDAY, TUESDAY, WEDNESDAY,
         THURSDAY, FRIDAY, TOTAL_HOURS,PROJECT_DESC,FROM_DATE,
          TO_DATE, STATUS_ID,CREATION_DATE)
      VALUES (?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?,?,?);
      `;
 
 
 
      pool.query(
        insertQuery,
        [
            EMPLOYEE_ID, TIME_CARD_PERIOD, PROJECT_NAME, TASK_NAME, ACTIVITY_TYPE,
            formattedSATURDAY, formattedSUNDAY,formattedMONDAY, formattedTUESDAY, formattedWEDNESDAY, formattedTHURSDAY, formattedFRIDAY, formattedTOTAL_HOURS,
            formattedPROJECT_DESC,formattedFROM_DATE, formattedTO_DATE, STATUS_ID, new Date().toISOString().split('T')[0]
        ],
       
       
            (err, results) => {
              if (err) {
                console.error('Error inserting data into MySQL: ', err);
                res.status(500).send('Internal Server Error');
                return;
              }
       
              console.log('Data inserted successfully!');
              res.redirect('/create-time-card' ); // Redirect back to the form page or wherever you want
           
            }
            );
        });
    };
 
  static postDeleteTimeCard(req, res) {
    // Your existing postDeleteTimeCard method code
    const projTimecardId = req.body.projTimecardId;
   
    // Implement the logic to delete the row with the given projTimecardId
    const deleteQuery = 'DELETE FROM ETB_HR_PROJECT_TIMECARD_DETAILS WHERE PROJ_TIMECARD_ID = ?';
    pool.query(deleteQuery, [projTimecardId], (err, results) => {
      if (err) {
        console.error('Error deleting data from MySQL: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
 
      console.log('Data deleted successfully!');
      res.json({ success: true });
    });
  };
 
  }
 
 
// Export the class
module.exports = TimeCardController;