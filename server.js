import router from './api/router';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = 3000;

// Add json parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use((request, response, next) => {
	// logging
	console.log('Router triggered');
	next();
});

// Healthcheck
app.get('/', (request, response) => {  
  response.send('Hello from Express!');
});

// Register Router
app.use('/api', router);

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`)
});