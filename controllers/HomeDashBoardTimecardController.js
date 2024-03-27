// timecardController.js

const { getTimecardData } = require('../models/TimecardDashBoardModal');   

// Controller function to handle requests for timecard data
function getTimecard(req, res) {
  getTimecardData((err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Format data for the chart
    let labels = [];
    let data = [];

    results.forEach(row => {
      labels.push(row.FIRST_NAME + ' ' + row.LAST_NAME);
      data.push(row.TOTAL_HOURS);
    });

    res.json({ labels: labels, data: data });
  });
}



module.exports = { getTimecard };
