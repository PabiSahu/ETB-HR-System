// controllers/LeaveController.js
const db = require('../models/Leave_db');
const mysql = require('mysql2/promise');
 
class LeaveController {
 
    static async getLeaveDetails(req, res) {
        const username = req.session.username;
        const employeeId = req.session.employeeId;
 
        // SQL query to fetch leave data
        const sqlLeaveData = `
    SELECT *
    FROM   ETB_HR_EMPLOYEE_LEAVE_APPROVAL
    JOIN   Child_Lookup ON ETB_HR_EMPLOYEE_LEAVE_APPROVAL.LEAVE_TYPE_ID = Child_Lookup.Child_Id
    RIGHT JOIN ETB_HR_LEAVE_DETAIL_INFORMATION ON ETB_HR_EMPLOYEE_LEAVE_APPROVAL.LEAVE_ID = ETB_HR_LEAVE_DETAIL_INFORMATION.LEAVE_ID
    WHERE Child_Lookup.Master_Lookup_values = 'Etb Leaves'
    AND ETB_HR_LEAVE_DETAIL_INFORMATION.employee_id=?;
   
       
    `;
 
        try {
            // Fetch leave data using promises
            const [leaveData] = await db.query(sqlLeaveData,[employeeId]);
 
            // Fetch leave balance data from ETB_HR_LEAVE_DETAIL_INFORMATION
            const [leaveBalanceData] = await db.query('SELECT * FROM ETB_HR_LEAVE_DETAIL_INFORMATION ');
 
            // Calculate leave balance based on both tables
            const leaveBalance = LeaveController.calculateLeaveBalance(leaveData, leaveBalanceData);
 
            // Fetch LOV values for leave types using promises
            const [leaveTypeLov] = await db.query('SELECT Child_Id, Lookup_Values FROM Child_Lookup where Master_Lookup_values= "Etb Leaves"');
 
            // Mapping of status IDs to status names
            const statusIdToNameMapping = {
                4: 'Approved', // Assuming 4 corresponds to 'approved' in Child_Lookup
                5: 'Rejected', // Assuming 5 corresponds to 'rejected' in Child_Lookup
                7: 'Submitted', // Assuming 7 corresponds to 'submitted' in Child_Lookup
                // Add more mappings as needed
            };
 
            // Pass leaveData, leaveTypeLov, and statusIdToNameMapping to the view
            res.render('leaveDetails', { leaveData, leaveTypeLov, leaveBalance, statusIdToNameMapping, username,employeeId });
        } catch (error) {
            console.error('MySQL query error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
 
    // Modify the calculateLeaveBalance method to accept leaveBalanceData from ETB_HR_LEAVE_DETAIL_INFORMATION
    static calculateLeaveBalance(leaveBalanceData) {
        const leaveBalance = {
            sickLeave: { total: 0, consumed: 0, remaining: 0 },
            casualLeave: { total: 0, consumed: 0, remaining: 0 },
            plannedLeave: { total: 0, consumed: 0, remaining: 0 },
            // Add more leave types as needed
        };
 
        // Update the leave balance calculation based on leaveBalanceData
        leaveBalanceData.forEach(data => {
            switch (data.LEAVE_TYPE_ID) {
                case 9: // Sick Leave
                    leaveBalance.sickLeave.total = data.TOTAL_LEAVES || 0;
                    leaveBalance.sickLeave.consumed = isNaN(data.LEAVES_CONSUMED) ? 0 : data.LEAVES_CONSUMED;
                    leaveBalance.sickLeave.remaining = isNaN(data.LEAVES_REMAINING) ? 0 : data.LEAVES_REMAINING;
                    break;
                case 10: // Casual Leave
                    leaveBalance.casualLeave.total = data.TOTAL_LEAVES || 0;
                    leaveBalance.casualLeave.consumed = isNaN(data.LEAVES_CONSUMED) ? 0 : data.LEAVES_CONSUMED;
                    leaveBalance.casualLeave.remaining = isNaN(data.LEAVES_REMAINING) ? 0 : data.LEAVES_REMAINING;
                    break;
                case 11: // Planned Leave
                    leaveBalance.plannedLeave.total = data.TOTAL_LEAVES || 0;
                    leaveBalance.plannedLeave.consumed = isNaN(data.LEAVES_CONSUMED) ? 0 : data.LEAVES_CONSUMED;
                    leaveBalance.plannedLeave.remaining = isNaN(data.LEAVES_REMAINING) ? 0 : data.LEAVES_REMAINING;
                    break;
                // Add more cases for other leave types
            }
        });
        return leaveBalance;
    }
 
    static async getLeaveBalanceData(req, res) {
        try {
 
            // Retrieve employeeId from the session
            const employeeId = req.session.employeeId;
            const db = mysql.createPool({
                host: 'localhost',
                database: 'etb_hrms_schema',
                user: 'root',
                password: 'Ashu@123',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                port: 3306,
            });
 
            const query = 'SELECT LEAVE_TYPE_ID, SUM(LEAVES_REMAINING) AS RemainingLeaves FROM ETB_HR_LEAVE_DETAIL_INFORMATION WHERE EMPLOYEE_ID=? GROUP BY LEAVE_TYPE_ID'; //EMPLOYEE_ID
 
            const [results] = await db.query(query,[employeeId]);
 
            // Initialize variables to store the remaining leaves for each type
            let sickLeaveRemaining = 0;
            let casualLeaveRemaining = 0;
            let plannedLeaveRemaining = 0;
 
            // Process each row in the results
            results.forEach(row => {
                switch (row.LEAVE_TYPE_ID) {
                    case 9: // Sick Leave
                        sickLeaveRemaining = row.RemainingLeaves;
                        break;
                    case 10: // Casual Leave
                        casualLeaveRemaining = row.RemainingLeaves;
                        break;
                    case 11: // Planned Leave
                        plannedLeaveRemaining = row.RemainingLeaves;
                        break;
                    // Add more cases for other leave types if needed
                }
            });
 
            const leaveRemainingData = {
                sickLeave: sickLeaveRemaining,
                casualLeave: casualLeaveRemaining,
                plannedLeave: plannedLeaveRemaining,
            };
 
            res.json(leaveRemainingData);
        } catch (error) {
            console.error('Error fetching leave balance data from MySQL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
 
    //----------for apply leave------------------------
    static applyLeave(req, res) {
        // Extract data from the request body
        const {
            employeeId,
            employeeName,
            leaveId,
            approvedBy,
            approvalDate,
            leaveFromDate,
            leaveToDate,
            daysOfLeave,
            leaveTypeId,
            statusId,
            comments,
        } = req.body;
 
        const formattedLeaveFromDate = leaveFromDate ? leaveFromDate : null;
        const formattedLeaveToDate = leaveToDate ? leaveToDate : null;
        const formattedLeaveId = leaveId ? leaveId : null;
        const formattedDaysOfLeave = daysOfLeave !== '' ? daysOfLeave : null;
 
        // SQL query to insert leave data into the database
        const sqlInsertLeave = `
            INSERT INTO ETB_HR_EMPLOYEE_LEAVE_APPROVAL
            (EMPLOYEE_ID, EMPLOYEE_NAME, LEAVE_ID, APPROVED_BY, APPROVAL_DATE, LEAVE_FROM_DATE, LEAVE_TO_DATE, DAYS_OF_LEAVE, LEAVE_TYPE_ID,STATUS_ID, COMMENTS)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,7,?);
        `;
 
        // Execute the SQL query for insertion
        db.query(
            sqlInsertLeave,
            [
                employeeId,
                employeeName,
                formattedLeaveId,
                approvedBy,
                approvalDate,
                formattedLeaveFromDate,
                formattedLeaveToDate,
                formattedDaysOfLeave,
                leaveTypeId,
                statusId,
                comments,
            ],
            (err, result) => {
                if (err) {
                    console.error('MySQL query error:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                // Redirect to the leave details page after successful insertion
                res.redirect('/leaveDetails');
            }
        );
    }
 
    // ------pop-up lov values displayed in apply leave modal--------------------
 
    static async getLeaveTypeLovValues(req, res) {
        // SQL query to fetch LOV values for leave types
        const sqlLeaveTypeLov = 'SELECT Child_Id, Lookup_Values FROM Child_Lookup where Master_Lookup_values= "Etb Leaves"';
 
        // Fetch leave type LOV values
        db.query(sqlLeaveTypeLov, (err, leaveTypeLov) => {
            if (err) {
                console.error('MySQL query error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
 
            res.json(leaveTypeLov);
        });
    }
 
 
    //-------------- Method to get leave approval details-----------------
    static async getLeaveApprovalDetails(req, res) {
        // SQL query to fetch leave approval details
        const sqlLeaveApprovalData = `
        SELECT
            *
        FROM
            ETB_HR_EMPLOYEE_LEAVE_APPROVAL
        JOIN
            Child_Lookup
        ON  
         ETB_HR_EMPLOYEE_LEAVE_APPROVAL.LEAVE_TYPE_ID = Child_Lookup.Child_Id
        WHERE
            Child_Lookup.Master_Lookup_values= "Etb Leaves"
            AND ETB_HR_EMPLOYEE_LEAVE_APPROVAL.status_id = (SELECT Child_id FROM Child_Lookup WHERE Lookup_Values = 'Submitted');
    `;
 
        try {
            const [leaveApprovalData] = await db.query(sqlLeaveApprovalData);
 
 
            res.render('leaveApproval', { leaveApprovalData });
        } catch (error) {
            console.error('MySQL query error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
 
 
    //------------- Method to approve leave-------------------
    static async approveLeave(req, res) {
        const leaveApprovalId = req.params.leaveApprovalId;
 
        try {
            // Implement your logic to update the leave status to approved in the database
            // You may use a service or a database query here
 
            // Example: Update leave status to approved in the database
            // const updateQuery = 'UPDATE ETB_HR_EMPLOYEE_LEAVE_APPROVAL SET STATUS = "Approved" WHERE LEAVE_APPROVAL_ID = ?';
            // await db.query(updateQuery, [leaveApprovalId]);
 
            const updateQuery = 'UPDATE ETB_HR_EMPLOYEE_LEAVE_APPROVAL SET STATUS_ID = (SELECT Child_id FROM Child_Lookup WHERE Lookup_Values  = "approved") WHERE LEAVE_APPROVAL_ID = ?';
            await db.query(updateQuery, [leaveApprovalId]);
 
            await LeaveController.updateLeaveDetailAfterApproval(leaveApprovalId);
 
 
            res.redirect('/leaveApproval'); // Redirect to the leave approval page after approval
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
 
 
    //------- Method to reject leave--------------
    static async rejectLeave(req, res) {
        const leaveApprovalId = req.params.leaveApprovalId;
 
        try {
            // Implement your logic to update the leave status to rejected in the database
            // You may use a service or a database query here
 
            // Example: Update leave status to rejected in the database
            // const updateQuery = 'UPDATE ETB_HR_EMPLOYEE_LEAVE_APPROVAL SET STATUS = "Rejected" WHERE LEAVE_APPROVAL_ID = ?';
            // await db.query(updateQuery, [leaveApprovalId]);
 
            const updateQuery = 'UPDATE ETB_HR_EMPLOYEE_LEAVE_APPROVAL SET STATUS_ID = (SELECT Child_id FROM Child_Lookup WHERE Lookup_Values = "rejected") WHERE LEAVE_APPROVAL_ID = ?';
            await db.query(updateQuery, [leaveApprovalId]);
 
 
            res.redirect('/leaveApproval',); // Redirect to the leave approval page after rejection
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
 
    //     populated leave_id using employee_id and leeave_type_id
    static async getLeaveId1(req, res) {
        const { employeeId, leaveTypeId } = req.query;
 
        // Modify the SQL query based on your table structure
        const sql = 'SELECT LEAVE_ID FROM ETB_HR_LEAVE_DETAIL_INFORMATION WHERE EMPLOYEE_ID = ? AND LEAVE_TYPE_ID = ?';
 
        try {
            const [result] = await db.query(sql, [employeeId, leaveTypeId]);
            const leaveId = result.length > 0 ? result[0].LEAVE_ID : '';
 
            res.json({ leaveId });
        } catch (error) {
            console.error('Error fetching Leave ID from the database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
 
    static async updateLeaveDetailAfterApproval(leaveApprovalId) {
        try {
            // Fetch approved leave data
            const [approvedLeaveData] = await db.query('SELECT EMPLOYEE_ID, LEAVE_TYPE_ID, DAYS_OF_LEAVE FROM ETB_HR_EMPLOYEE_LEAVE_APPROVAL WHERE LEAVE_APPROVAL_ID = ?', [leaveApprovalId]);
 
            if (approvedLeaveData.length === 0) {
                // Handle case where no data is found
                console.error('Leave Approval data not found');
                return;
            }
 
            const employeeId = approvedLeaveData[0].EMPLOYEE_ID;
            const leaveTypeId = approvedLeaveData[0].LEAVE_TYPE_ID;
            const daysOfLeaveApproved = approvedLeaveData[0].DAYS_OF_LEAVE;
 
            // Update leave detail information
            const updateLeaveDetailQuery = `
                UPDATE ETB_HR_LEAVE_DETAIL_INFORMATION
                SET
                    LEAVES_CONSUMED = LEAVES_CONSUMED + ?,
                    LEAVES_REMAINING = LEAVES_REMAINING - ?
                WHERE
                    EMPLOYEE_ID = ?
                    AND LEAVE_TYPE_ID = ?;
            `;
 
            // Update leave balance in the database
            await db.query(updateLeaveDetailQuery, [daysOfLeaveApproved, daysOfLeaveApproved, employeeId, leaveTypeId]);
 
        } catch (error) {
            console.error('Error updating leave detail information after approval:', error);
        }
    }
}
module.exports = LeaveController;