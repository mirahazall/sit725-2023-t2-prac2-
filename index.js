let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('userDB');
let express = require('express');
let app = express();
const bcrypt = require('bcrypt');
const saltRounds = 15;

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(express.static('public_html'));
app.use(express.urlencoded({extended:false}));

app.post('/registration', function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;

  console.log("Just received POST data for registration endpoint!");

  // Validate the inputs
  if (!firstname || !lastname || !username || !password) {
    return res.status(400).send("All fields are required.");
  }

  // Hash the password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      // Handle hashing error
      console.error(err);
      return res.status(500).send("Server error");
    }

    // Insert data into the database
    db.run(`INSERT INTO Register (firstname, lastname, username, password) VALUES (?, ?, ?, ?)`, [firstname, lastname, username, hash], function (err) {
      if (err) {
        // Handle database insertion error
        console.error(err);
        return res.status(500).send("Server error");
      }

      // Data inserted successfully
      console.log(`User ${username} registered successfully.`);

      let message = `<div class="container">
        <div class="text-center">
          <h1>REGISTRATION CONFIRMATION</h1>
          <h3> Hi ${firstname} ${lastname}, you successfully registered to our webpage! </h3>
          <ul>
          <li><em> The data collected from the user is stored in the database I created. 
          I first created a createDBjs file to create and initialize the database as well as the 
          "Register" table in the database to store the user data that we are collecting 
          in this form. Then in a seperate js file(index.js), I retrieved the data that the user 
          provided using post method and inserted that user data into the "Register" table 
          that I created. </em></li>
          <li><em>I've implemented more involved error handling methods while developing the registration logic.
           I check if all required fields are provided, and if any of them are missing, 
           I return a 400 Bad Request response with the message "All fields are required."
          When hashing the password using bcrypt, I handle any errors that might occur during 
          hashing and return a 500 Internal Server Error response with the message 
          "Server error" if an error occurs.
          When inserting the user data into the database, I also handle any errors 
          that might occur during the insertion process. If an error occurs, 
          I return a 500 Internal Server Error response with the message "Server error."</em></li>
          <li><em>The password is not stored in its original plain text form 
          within the database. Instead, it undergoes encryption using a 
          secure hashing algorithm "bcrypt" before being stored. you use the bcrypt
           library to hash the password. The bcrypt.hash function takes three 
           parameters: the password to be hashed (password), the number of 
           salt rounds (saltRounds), and a callback function that handles the result. 
           This means that even if someone gains access to the database, they won't 
           find the actual passwords, but rather a cryptographic representation of them. 
           This enhances the security of user data by ensuring that sensitive 
           information remains protected.</em></li>
          <li><em> To conclude; when a user submits the registration form, their 
          provided data (firstname, lastname, username, and hashed password) is 
          inserted into a local SQLite database. The password is hashed using 
          bcrypt for security.</em</li>
          </ul>
        </div>
      </div>`;

      res.status(200).send(message);
    });
  });
});

  app.post('/loginInfo', function(req,res){
    let username = req.body.username;
    let password = req.body.password;

    db.get("SELECT * FROM Register WHERE username = ? ", [username],
    (err, user) => {
    if (err) 
    {
      console.error(err);
      return res.status(500).send("Server error");
    }
    if (!user) 
    {
        return res.status(401).send("<h1>LOGIN FAILED</h1><h3>The <i>username</i> or <i>password</i> provided doesn't match our records.</h3>");
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
      if (result) {
        // Passwords match, user is authenticated
        let message = `<div class="container">
          <div class="text-center">
            <h1>LOGIN SUCCESSFUL</h1>
            <h3>Welcome, ${username}!</h3>
            <ul>
            <li><em> I've integrated registration and login processes. During 
            registration, user data is inserted into the "Register" table.
             During login, the system checks if the provided username exists 
             in the database. If a matching username is found, the system compares the 
             provided password with the stored hashed password. If the passwords match, 
             the login is considered successful; otherwise, it fails. </em></li>
            <li><em> When a user submits the login form, the code checks if the 
            provided username exists in the database. If the username exists, it 
            compares the hashed password with the user's input to determine if the 
            login is successful.</em</li>
            <li><em>I've implemented more involved error handling methods while 
            developing the login logic. I check if a user with the provided 
            username exists in the database. If the user doesn't exist, I return a 401 
            Unauthorized response with a message indicating a login failure.
            When comparing the provided password with the hashed password retrieved 
            from the database, I handle errors that might occur during the comparison 
            process. If an error occurs, I return a 500 Internal Server Error response 
            with the message "Server error."
            If the comparison is successful (passwords match), I return a 200 OK response 
            with a success message. If the comparison fails (passwords don't match), I return 
            a 401 Unauthorized response with a message indicating a login failure.
            </em></li>
            </ul>
          </div>
        </div>`;

    res.status(200).send(message);
      }else{
        res.status(401).send("<h1>LOGIN FAILED</h1> <p>The <i>username</i> or <i>password</i> provided doesn't match our records.</p>");
      }
   });
 });
});

  app.listen(3000,function(){
    console.log(`Web server running at port 3000!`)
    console.log("Type Ctrl+C to shut down the web server")
  });