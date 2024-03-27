const db = require('../database');
 
// Controller function to insert data into the child table
exports.insertChildData = (req, res) => {
  const {  masterLookupValues, lookupValues } = req.body;
  const sql = 'INSERT INTO Child_Lookup (Master_Lookup_values, Lookup_Values) VALUES (?, ?)';
  const values = [ masterLookupValues, lookupValues];
 
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting child data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Data inserted successfully' });
  });
};
 
// // Define the getFunction
// exports.getFunction = (req, res) => {
//   // Assuming masterValue is retrieved from somewhere in your application
//   const masterValue = req.query.masterValue; // Replace "YourMasterValue" with the actual value
 
//   // Render the childlookup.ejs template with masterValue
//   res.render('childlookup', { username: 'YourUsername', masterValue: masterValue });
// };
 
// Define the getFunction
exports.getFunction = (req, res) => {
  // Assuming masterValue is retrieved from somewhere in your application
  const masterValue = req.query.masterValue; // Replace "YourMasterValue" with the actual value
 
  const employeeDetails = req.employeeDetails;

  // Query the database to fetch description and status based on masterValue
  db.query('SELECT descriptions, status FROM master_lookup WHERE Master_Lookup_values = ?', [masterValue], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Internal Server Error: ' + err.message); // Send error message
    }
 
    // if (result.length === 0) {
    //   // No data found for the given masterValue
    //   return res.status(404).send('Data not found');
    // }
 
    // const description = result[0].descriptions;
    // const status = result[0].status;
 
    let description = null;
    let status = null;
 
    if (result.length !== 0) {
      // Data found for the given masterValue
      description = result[0].descriptions;
      status = result[0].status;
    }
 
    // Render the childlookup.ejs template with masterValue, description, and status
    res.render('childlookup', {
      masterValue: masterValue,
      descriptions: description,
      status: status,
      employeeDetails: employeeDetails
    });
  });
};
 
 
 
exports.getChildDataByMasterValue = (req, res) => {
  const masterValue = req.params.masterValue;
  const sql = 'SELECT * FROM child_lookup WHERE Master_Lookup_values = ?';
 
  db.query(sql, masterValue, (err, rows) => {
    if (err) {
      console.error('Error fetching child data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
};
 
 
// Controller function to delete a single row
exports.deleteChild = (req, res) => {
  const childId = req.params.childId;
  const sql = 'DELETE FROM child_lookup WHERE Child_Id = ?';
 
  db.query(sql, childId, (err, result) => {
      if (err) {
          console.error('Error deleting child:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Row deleted successfully' });
  });
};
 
// Controller function to delete multiple rows
exports.deleteMultipleChildren = (req, res) => {
  const childIds = req.body.childIds;
  const sql = 'DELETE FROM child_lookup WHERE Child_Id IN (?)';
 
  db.query(sql, [childIds], (err, result) => {
      if (err) {
          console.error('Error deleting children:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Rows deleted successfully' });
  });
};
 
 
// Function to handle form submission
exports.submitForm = (req, res) => {
  const { masterValue, descriptions, status } = req.body;
 
  // Insert data into master_lookup table
  const sql = 'INSERT INTO master_lookup (Master_lookup_values, descriptions, status) VALUES (?, ?, ?)';
  db.query(sql, [masterValue, descriptions, status], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Error inserting data');
      }
      console.log('Data inserted successfully!');
     
      // Redirect to the same page
      res.redirect('/childlookup?masterValue=' + masterValue);
  });
};
 
 
// Update your controller function
exports.deleteMaster = (req, res) => {
  const masterValue = req.params.masterValue;
  const sql = 'DELETE FROM master_lookup WHERE Master_Lookup_values = ?';
 
  db.query(sql, masterValue, (err, result) => {
      if (err) {
          console.error('Error deleting master:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Data deleted successfully!');
      // Redirect to the lookup page after successful deletion
     
  });
};
 
// Controller function to update data in the master_lookup table
exports.updateMaster = (req, res) => {
  const { masterValue, descriptions, status } = req.body;
 
  // Update data in master_lookup table
  const sql = 'UPDATE master_lookup SET descriptions = ?, status = ? WHERE Master_Lookup_values = ?';
  db.query(sql, [descriptions, status, masterValue], (err, result) => {
      if (err) {
          console.error('Error updating data:', err);
          return res.status(500).send('Error updating data');
      }
      console.log('Data updated successfully!');
     
      // Send response indicating success
      res.json({ message: 'Data updated successfully' });
  });
};
 
// Controller function to update data in the master_lookup table
exports.updateMaster = (req, res) => {
  const { masterValue, descriptions, status } = req.body;
 
  // Update data in master_lookup table
  const sql = 'UPDATE master_lookup SET descriptions = ?, status = ? WHERE Master_Lookup_values = ?';
  db.query(sql, [descriptions, status, masterValue], (err, result) => {
      if (err) {
          console.error('Error updating data:', err);
          return res.status(500).send('Error updating data');
      }
      console.log('Data updated successfully!');
     
      // Send response indicating success
      res.json({ message: 'Data updated successfully' });
  });
};
 
const mysql = require('mysql');
 
exports.updateChild = async (req, res) => {
    try {
        const { childId, masterLookupValues, lookupValues } = req.body;
 
        // Create a MySQL connection
       
 
        // Construct the SQL update query
        const sql = `UPDATE Child_Lookup
                     SET Master_Lookup_values = ?, Lookup_Values = ?
                     WHERE Child_Id = ?`;
 
        // Execute the SQL query with the provided parameters
        db.query(sql, [masterLookupValues, lookupValues, childId], (error, results) => {
            if (error) {
                console.error('Error updating child data:', error);
                res.status(500).send({ error: 'An error occurred while updating child data.' });
            } else {
                res.status(200).send({ message: 'Child data updated successfully.' });
            }
        });
 
        // Close the database connection
   
    } catch (error) {
        console.error('Error updating child data:', error);
        res.status(500).send({ error: 'An error occurred while updating child data.' });
    }
};
 