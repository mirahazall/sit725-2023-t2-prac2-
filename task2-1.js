let express = require('express');
let app = express();
let path = require('path'); 

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

// REST API endpoint to add two numbers
app.get('/api/add', (req, res) => {
  const { number1, number2 } = req.query;

  if (!number1 || !number2) {
      res.status(400).json({ error: 'Missing parameters. Please provide number1 and number2.' });
  } else {
      const result = parseFloat(number1) + parseFloat(number2);
      res.json({ result });
  }
});

// Serve the main HTML file
app.get('/task2-1.html', (req, res) => {
  const filePath = path.join(__dirname, 'public_html', 'task2-1.html');
  res.sendFile(filePath);
});



app.listen(3000,function(){
    console.log(`Web server running at port 3000!`)
    console.log("Type Ctrl+C to shut down the web server")
  });