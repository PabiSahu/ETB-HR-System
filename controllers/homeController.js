// controllers/homeController.js

const homeModel = require('../models/homeModel'); // Make sure to include this line


const getHomePage = async (req, res) => {
  try {
    const data = await homeModel.getHomePageData();
    res.render('home', { ...data, employeeDetails: req.employeeDetails }); // Pass employeeDetails to the view
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

module.exports = {
  getHomePage,
};
