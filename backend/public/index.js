var input =
[
    {
       "id": 1,
       "latitude": 37.17429363,
       "longitude": -122.01100554
    },
    {
       "id": 2,
       "latitude": 38.07514282,
       "longitude": -122.32189978
    },
    {
       "id": 3,
       "latitude": 38.756443,
       "longitude": -123.55355851
    }

];

//puts points into a format that the API can understand
var places = [];

for (var obj in input)
{
  places.push({
    "point": {"latitude": input[obj].latitude, "longitude": input[obj].longitude}
  });
}

var prim = [];//will apply prim's Algorithm on the graph


var url = "https://api.tomtom.com/routing/1/matrix/json?key=iKNkC5W8ARvRHaAbiVUE5kT3P45IGXtF&routeType=shortest&travelMode=truck";

var data = {
  "origins": places,  "destinations": places
};

//gets information from the Tom Tom API
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
    //parses data to create graph
    for(row in data.matrix)
    {
      var point;
      var from = {}
      for(column in data.matrix)
      {
        var id = input[column].id
        if(column != row)
        {
          from[id] = (data.matrix[row][column].response.routeSummary.travelTimeInSeconds + data.matrix[row][column].response.routeSummary.trafficDelayInSeconds);
        }
        else
        {
          point = id.toString();
        }
      }
      prim.push({
        point: point,
        from : from
      });
    }
    console.log(prim);
  }).done(function()
    {


    });
