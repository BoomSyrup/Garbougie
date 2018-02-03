var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs');
var jsonData = fs.readFileSync('nodes.json');

var data = JSON.parse(jsonData);

var app = express();
var server = app.listen(process.env.PORT || 8080, () => console.log('Server is running!'));
var tt_key = process.env.TT_KEY;

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
	var latitude = req.query.latitude;
	var longitude = req.query.longitude;
	var nodeObj = {
		id: id,
		latitude: latitude,
		longitude: longitude
	}

	console.log(JSON.stringify(nodeObj))

	data.nodes.push(nodeObj);
	var newData = JSON.stringify(data, null, 3);
	fs.writeFile('nodes.json', newData, function(err){
		if (err) throw err;
		return;
	});
	res.status(200);
	res.send(data.nodes);
}
