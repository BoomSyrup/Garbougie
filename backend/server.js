var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise')

var fs = require('fs');
var jsonData = fs.readFileSync('nodes.json');

var data = JSON.parse(jsonData);

var app = express();
var server = app.listen(process.env.PORT || 8080, () => console.log('Server is running!'));
var tt_key = process.env.TT_KEY;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));
app.use('/static', express.static('sdk'));

//Get all
app.get('/all', getAll);
function getAll(req, res){
	res.send(data.nodes);
}

app.get('/node', getOne);
function getOne(req, res){
  var id = req.query.id;
  const uno = data.nodes.filter(node => node.id == id);
  res.send(uno);
}

app.get('/remove', removeAll);
function removeAll(req, res){
	res.send(data.nodes);
}

//Route for the user to go and post from the app
app.get('/pickup', requestPickup);
function requestPickup(req, res){
	var id = data.nodes.length + 1;
	var lat =  parseInt(req.query.lat);
	var lng =  parseInt(req.query.lng);
	var nodeObj = {
      id: id,
		  lat: lat,
		  lng: lng,
      pickedup: 0
  }

	data.nodes.push(nodeObj);
	var newData = JSON.stringify(data, null, 3);
	fs.writeFile('nodes.json', newData, function(err){
		if (err) throw err;
		return;
	});

	res.status(200);
	res.send(data.nodes);
}

//Change the status on a particular node that it has been delivered
app.get('/delivered', deliverPackage);
function deliverPackage(req, res){
  var id = req.query.id;
  var c = req.query.completed;

  const result = data.nodes.filter(node => node.id == id);

  if (result) {
    console.log(result);
    result[0].completed = c;
    console.log(result);
    res.status(200);
    res.send(result);
  } else {
    res.status(400);
  }
}
