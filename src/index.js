const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');

//Settings
app.set('port',process.env.PORT || 3000);

//MIddlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());

//Routes
//app.use('/tasks',require ('./routes/tasks'));
app.use('/usuarios',require ('./routes/usuarios'));


//Static files
app.use(express.static(__dirname + '/public'));



//Serer is listening
app.listen(app.get('port'),() => {
  console.log('Server on port',app.get('port'));
});
