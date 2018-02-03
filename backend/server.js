var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var jsonData = fs.readFileSync('nodes.json');
var data = JSON.parse(jsonData);

var app = express();
var server = app.listen(process.env.PORT || 8080, () => console.log('Server is running!'));
var tt_key = process.env.TT_KEY;

app.use(express.static('public'));

//Get all
app.get('/all', getAll);
function getAll(res, res){
	res.send(data.nodes);
}

//Route for the user to go and post from the app
app.post('/pickup/:', requestPickup);
function requestPickup(res, res){
  var node =  req.body;

  if (typeof node.id == 'undefined' ||
      typeof node.latitude == 'undefined' ||
      typeof node.longitude == 'undefined') {
        res.status(400);
				return;
  }

  data.nodes.push(node);
  var newData = JSON.stringify(data, null, 3);
  fs.writeFile('questions.json', newData, function(err){
    if (err) throw err;
		return;
  });

  res.status(200);
}
