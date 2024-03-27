//lookupController.js
 
const db = require('../database');
 
const lookupController = {};
 
lookupController.displayLookupTables = (req, res) => {
    const queryMaster = "SELECT Master_Id, Master_lookup_values, descriptions, status FROM master_lookup";
    const queryChild = "SELECT * FROM child_lookup";
 
    // Use the pool to execute queries
    db.query(queryMaster, (err, masterDataResult) => {
        if (err) {
            console.error('Error fetching master data:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Master Data:', masterDataResult);
 
        db.query(queryChild, (err, childDataResult) => {
            if (err) {
                console.error('Error fetching child data:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Child Data:', childDataResult);
 
            const masterData = masterDataResult;
            const childData = childDataResult;
 
            res.render('lookup', { employeeDetails: req.employeeDetails, masterData, childData });
        });
    });
};
 
 
 
 
module.exports = lookupController;