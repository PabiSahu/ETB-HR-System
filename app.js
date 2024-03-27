
// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connectionPool = require('./database');
const nodemailer = require('nodemailer'); // Make sure to import nodemailer
const methodOverride = require('method-override');
const i18n = require('i18n');
const cookieParser = require('cookie-parser');
const fetchEmployeeId = require('./fetchEmployeeId');
const employeeDetailsMiddleware = require('./employeeDetailsMiddleware');
const fetchFunctionsByUserRole = require('./fetchFunctionsByUserRole');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// Parse application/json
app.use(bodyParser.json());


// Set EJS as the view engine
app.set('view engine', 'ejs');
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MySQLStore({

  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ashu@123",
  database: "etb_hrms_schema",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 10,
  schema: {
      tableName: 'ETB_HR_SESSIONS_TABLE',
      columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
      }
  }
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

app.use((req, res, next) => {
  res.locals.username = req.session.username; // Make username available in templates
  next();
});


//////////////
app.use(cookieParser());

// Configure i18n
i18n.configure({
  locales: ['en', 'hi', 'ka'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'locale',
});

// Use i18n middleware
app.use(i18n.init);

app.get('/employeeProfileCard2', (req, res) => {
  res.render('employeeProfileCard2', { employeeDetails: req.employeeDetails });
});

// Your routes
// Your routes
app.get('/language', (req, res) => {
  const locale = req.getLocale();
  res.send(`
    <html lang="${locale}">
      <head>
        <title>i18n Example</title>
      </head>
      <body>
        <h1>${res.__('Hello')}</h1>
        <form action="javascript:void(0);" onsubmit="changeLocale()">
          <label for="locale">${res.__('Select Language:')}</label>
          <select name="locale" id="locale">
            <option value="en">${res.__('English')}</option>
            <option value="hi">${res.__('Hindi')}</option>
            <option value="ka">${res.__('Kannada')}</option>
          </select>
          <button type="submit">${res.__('Change Language')}</button>
        </form>

        <script>
          async function changeLocale() {
            const localeSelect = document.getElementById('locale');
            const selectedLocale = localeSelect.value;

            // Make a POST request to change the locale
            const response = await fetch('/changeLocale', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ locale: selectedLocale }),
            });

            if (response.ok) {
              const { success, locale, redirectTo } = await response.json();

              if (success) {
                // Get the current URL
                const currentUrl = window.location.href;

                // Redirect to the specified page or default to the current page
                if (redirectTo) {
                  window.location.href = redirectTo;
                } else {
                  window.location.href = currentUrl;
                }
              }
            }
          }
        </script>
      </body>
    </html>
  `);
});



app.post('/changeLocale', (req, res) => {
  const { locale } = req.body;
  res.cookie('locale', locale);
  res.setLocale(locale);
 // res.json({ success: true, locale });
  res.render('login')
});

////////////
//Middleware to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
  // Check if the user is logged in by verifying the session or any other authentication method you are using
  if (req.session.loggedIn) {
    next(); // User is logged in, proceed to the next middleware or route handler
  } else {
    res.status(401).send('Unauthorized'); // You can customize the response accordingly
  }
};

// Apply the checkLoggedIn middleware to the routes you want to restrict
app.use([ '/createTimeCard', '/home', '/timecard', '/createTimeCard'], checkLoggedIn);




// Load other route files
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const UserRegisterRoutes = require('./routes/UserRegisterRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const createNewPasswordRoutes = require('./routes/createNewPasswordRoutes');

const userRoleAssignRoutes = require('./routes/userRoleAssignRoutes');  
const userRoleDetailsRoutes = require('./routes/userRoleDetailsRoutes'); 

const HomeDashBoardRoutes = require('./routes/HomeDashBoardRoutes');  
const homeRoutes = require('./routes/homeRoutes');

const TableRoutes = require('./routes/TableRoutes');
const FunctionRoutes = require('./routes/FunctionRoutes');
const FunctionDetailsRoutes = require('./routes/FunctionDetailsRoutes'); 

const MenuRoutes = require('./routes/MenuRoutes');
const MenuDetailsRoutes = require('./routes/MenuDetailsRoutes');

const ResponsibilityRoutes = require('./routes/ResponsibilityRoutes');
const UserRegisterTableRoutes = require('./routes/UserRegisterTableRoutes');
const employeeDetailsRoutes = require('./routes/employeeDetailsRoutes');
const EmployeeCreationRoutes = require('./routes/employeeCreationRoutes');
const cardTableRoutes = require('./routes/CardTableRoutes');
const updateTimeCardRoutes = require('./routes/updateTimeCardRoutes');
const timeCardEntryRoutes = require('./routes/timeCardEntryRoutes');
const educationRoutes = require('./routes/educationRoutes');
const employeeRouter = require('./routes/employeeRouter');
const employeeRouter1 = require('./routes/employeeRouter1');
const employeeDeatilsRouter1 = require('./routes/employeeDetailsRoutes1');
const childlookupRoutes = require ('./routes/childlookupRoutes');
const lookupRoutes = require('./routes/lookupRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

/********************************************* */
// Use the routes
app.use(loginRoutes);
app.use(registerRoutes); 
app.use(UserRegisterRoutes);
app.use(forgotPasswordRoutes);
app.use(createNewPasswordRoutes);
app.use(fetchEmployeeId);
app.use(fetchFunctionsByUserRole);
app.use(employeeDetailsMiddleware);

app.use(HomeDashBoardRoutes);
app.use(homeRoutes);
app.use(TableRoutes);
app.use(userRoleAssignRoutes);
app.use(userRoleDetailsRoutes);
app.use(FunctionRoutes);
app.use(FunctionDetailsRoutes);
app.use(MenuRoutes);
app.use(MenuDetailsRoutes);




app.use(ResponsibilityRoutes);
app.use(UserRegisterTableRoutes);
app.use(employeeDetailsRoutes);
app.use(EmployeeCreationRoutes);
app.use(cardTableRoutes);
app.use(updateTimeCardRoutes);
app.use(timeCardEntryRoutes);
app.use( educationRoutes);
app.use(employeeRouter);
app.use(employeeRouter1);
app.use(employeeDeatilsRouter1);
app.use(childlookupRoutes);
app.use(lookupRoutes);
app.use(leaveRoutes);



/********************************************* */
app.get('/employeeTab', (req, res) => {
  res.render('employeeTab');
});

app.get('/verify', (req, res) => {
  // Your logic for rendering the login page
  res.render('verify'); // Adjust this based on your template rendering setup
});

//----------------------------otp------------------------------------//

// Send OTP route
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const userQuery = 'SELECT * FROM register_form WHERE email = ?';
  connection.query(userQuery, [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Generate and send OTP via Nodemailer
      const otp = generateOTP(); // Implement your OTP generation logic

      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abid14.esaq@gmail.com', // Removed extra space here
          pass: 'rxmo koop jmeu kexg'
        }
      });

      // Define email options
      const mailOptions = {
        from: 'abid14.esaq@gmail.com',
        to: email, // Send OTP to the provided email, not the hardcoded one
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending OTP:', error);
          res.send('Error sending OTP');
        } else {
          console.log('Email sent: ' + info.response);
          // Save the OTP and email in the session for verification
          req.session.otp = otp;
          req.session.email = email;
          res.redirect('/verify'); // Redirect to OTP verification page
        }
      });
    } else {
      res.send('Email not found');
    }
  });
});

// OTP verification route
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;

  // Check if the entered OTP matches the stored OTP
  if (otp === req.session.otp) {
    //res.send('OTP verification successful');
    res.redirect('/createNewPassword');
    // Perform any additional actions (e.g., redirect to the home page)
  } else {
    res.send('Invalid OTP');
  }
});

// Helper function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//----------------------------------------------------------------//

app.get('/otp', (req, res) => {
  res.render('otp'); // Assuming your EJS file is named otp.ejs
});

app.post('/otp', (req, res) => {
  console.log('Request Body:', req.body);

  const email = req.body.EMAIL;
  console.log('Email received:', email);

  res.render('otp', { email }); // Adjust this according to your needs
});


// -----------home page----------------

// const homeRoutes = require('./routes/homeRoutes');
app.use('/home', homeRoutes);



app.listen(3009, () => {
  console.log('Server is running on port 3009');
  // connection.connect(function (err) {
  //   if (err) throw err;
  //   console.log('Database connected!');
  // });
});


