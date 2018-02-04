var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise')

var fs = require('fs');
var jsonData = fs.readFileSync('nodes.json');

const $ = require('jquery');
const ajax = require('jquery-ajax');

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
      completed: 0
  }

	data.nodes.push(nodeObj);
	// var newData = JSON.stringify(data, null, 3);
	// fs.writeFile('nodes.json', newData, function(err){
	// 	if (err) throw err;
	// 	return;
	// });

  var sortedData = calculateRoute(data.nodes);
  var newData = JSON.stringify(sortedData, null, 3);
  fs.writeFile('nodes.json', sortedData, function(err){
    if (err) throw err;
    return;
  });

	res.status(200);
	res.send(nodeObj);
}

//Change the status on a particular node that it has been delivered
app.get('/delivered', deliverPackage);
function deliverPackage(req, res){
  var id = req.query.id;
  var c = req.query.completed;

  const result = data.nodes.filter(node => node.id == id);

  if (result) {
    result[0].completed = c;
    res.status(200);
    res.send(result);
  } else {
    res.status(400);
  }
}

function calculateRoute(input){
  var places = []; //puts points into a format that the API can understand
  var dataArr = []; //stores dataArred data from API
  var route = []; //route to send back to user in sorted order
  for (var obj in input)
  {
    places.push({
      "point": {"latitude": input[obj].latitude, "longitude": input[obj].longitude}
    });
  }

  var url = "https://api.tomtom.com/routing/1/matrix/json?key=iKNkC5W8ARvRHaAbiVUE5kT3P45IGXtF&routeType=shortest&travelMode=truck";

  var data = {
    "origins": places,  "destinations": places
  };

  //gets data from the Tom Tom API
    $.ajax({
      'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      'type': "POST",
      'url': url,
      'data': JSON.stringify(data),
      'dataType': 'json'
    }).done(function(data) {
      //parse data
      for(row in data.matrix)
      {
        var point;
        var times = {};
        for(column in data.matrix)
        {
          var id = input[column].id
          if(column != row)
          {
            times[id] = (data.matrix[row][column].response.routeSummary.travelTimeInSeconds + data.matrix[row][column].response.routeSummary.trafficDelayInSeconds);
          }
          else {
            point = id;
          }
        }
        dataArr.push(
          JSON.stringify({
          id : point,
          times : times
        }));
      }
    }).done(function()
      {
        for(obj in dataArr)
        {
          dataArr[obj] = JSON.parse(dataArr[obj]);
        }
        var start = 0, //whenever given input, the first point is the starting location of the truck
            next = 0,
            min = Number.MAX_VALUE;
        for(element in dataArr)
        {
          for(key in element)
          if (dataArr[element].hasOwnProperty(key))
          {
            if(key == dataArr[start].id)
            {
              delete dataArr[element].key;//delete the first point because we don't want any location to come back to start point
            }
          }
        }
        while(dataArr.length > 0)
        {
          //find closest stop
            for(time in dataArr[start].times)
            {
              if(dataArr[start]["times"][time] < min )
              {
                min = dataArr[start]["times"].time;
                next = time;
              }
            }
            route.push(dataArr[start].id);
            dataArr.splice(start, 1); //delete old starting point from available points
            for(el in dataArr)
            {
              if(dataArr[el]['id'] == next)
                next = el;
            }
            start = next;
            for(element in dataArr)
            {
              for(key in element)
              if (dataArr[element].hasOwnProperty(key))
              {
                if(key == next)
                {
                  delete dataArr[element].key;//delete all values of next point so that it won't be added to route multiple times
                }
              }
            }
          }
          var routeObjects = [];
          for(id in route)
          {
            for(node in input)
            {
              if(route[id].localeCompare(input[node].id) == 0)
              {
                routeObjects.push(input[node]);
              }
            }
          }
          return routeObjects;
      });
    }
