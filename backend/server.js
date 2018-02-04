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
// app.use(bodyParser.json({ type: 'application/*+json' }))

//Get all
app.get('/all', getAll);
function getAll(res, res){
	res.send(data.nodes);
}

//Route for the user to go and post from the app
app.get('/pickup', requestPickup);
function requestPickup(req, res){
	var id = data.nodes.length + 1;
	var lat = req.query.lat;
	var lng = req.query.lng;
	var nodeObj = {
		id: id,
		lat: lat,
		lng: lng
	}

	// console.log(JSON.stringify(nodeObj))

	data.nodes.push(nodeObj);
	var newData = JSON.stringify(data, null, 3);
	fs.writeFile('nodes.json', newData, function(err){
		if (err) throw err;
		return;
	});

	res.status(200);
	res.send(data.nodes);
}
