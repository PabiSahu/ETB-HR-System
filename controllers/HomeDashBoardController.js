// controllers/HomeDashBoardController.js

const database = require('../models/LeaveDashBoardModal');  
const homeChartModalDB = require('../models/homeChartModal');
const { getTimecard } = require('./HomeDashBoardTimecardController');   // controllers/HomeDashBoardTimecardController.js

async function getLeaveData(req, res) {
  const { timePeriod } = req.query;
  let startDate, endDate;

  // Determine the start and end dates based on the selected time period
  switch (timePeriod) {
    case 'currentWeek':
      startDate = 'CURDATE() - INTERVAL 7 DAY';
      endDate = 'CURDATE()';
      break;
    case 'lastWeek':
      startDate = 'CURDATE() - INTERVAL 14 DAY';
      endDate = 'CURDATE() - INTERVAL 7 DAY';
      break;
    case 'nextWeek':
      startDate = 'CURDATE() + INTERVAL 7 DAY';
      endDate = 'CURDATE() + INTERVAL 14 DAY';
      break;
    default:
      // Handle invalid time periods
      res.status(400).json({ error: 'Invalid time period' });
      return;
  }

  const leaveQuery = `
    SELECT EMPLOYEE_NAME, SUM(DAYS_OF_LEAVE) AS totalDays
    FROM ETB_HR_EMPLOYEE_LEAVE_APPROVAL
    WHERE LEAVE_FROM_DATE >= ${startDate} AND LEAVE_FROM_DATE < ${endDate}
    GROUP BY EMPLOYEE_NAME;
  `;

  try {
    const leaveResults = await database.executeQuery(leaveQuery);
    res.json(leaveResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getEmployeeData(req, res) {
  const queryEmployeeData = 'SELECT DEPARTMENT, COUNT(*) as NUM_EMPLOYEES FROM ETB_HR_EMPLOYEE_DETAILS1 GROUP BY DEPARTMENT';

  // Fetch additional information
  const queryAdditionalInfo = 'SELECT COUNT(*) as totalEmployees, SUM(CASE WHEN JOB_POSITION = "Intern" THEN 1 ELSE 0 END) as totalInterns, SUM(CASE WHEN END_DATE IS NULL THEN 1 ELSE 0 END) as workingEmployees, SUM(CASE WHEN END_DATE IS NOT NULL THEN 1 ELSE 0 END) as resignedEmployees FROM ETB_HR_EMPLOYEE_DETAILS1';

  homeChartModalDB.query(queryEmployeeData, (err, resultsEmployeeData) => {
    if (err) {
      console.error('Error querying MySQL database for employee data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    homeChartModalDB.query(queryAdditionalInfo, (err, resultsAdditionalInfo) => {
      if (err) {
        console.error('Error querying MySQL database for additional information:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const totalEmployees = resultsAdditionalInfo[0].totalEmployees;
      const totalInterns = resultsAdditionalInfo[0].totalInterns;
      const workingEmployees = resultsAdditionalInfo[0].workingEmployees;
      const resignedEmployees = resultsAdditionalInfo[0].resignedEmployees;

      res.render('home', {
        employeeData: resultsEmployeeData,
        totalEmployees: totalEmployees,
        totalInterns: totalInterns,
        workingEmployees: workingEmployees,
        resignedEmployees: resignedEmployees,
        absentemployees: []
      });
    });
  });
}

// const employeeModel = require('../models/employeeModel');

async function getAbsentEmployees(req, res) {
  const query = `
    SELECT DISTINCT EMPLOYEE_NAME
    FROM ETB_HR_EMPLOYEE_LEAVE_APPROVAL
    WHERE LEAVE_FROM_DATE <= CURDATE()
    AND LEAVE_TO_DATE >= CURDATE();
  `;

  employeeModel.query(query, (error, results) => {
    if (error) throw error;

    res.render('absent-employees', { absentemployees: results });
  });
}




module.exports = {
  getLeaveData,
  getEmployeeData,
  getAbsentEmployees,
  getTimecard,   // Add the new function to export
  
};

