// var input =
// [
//     {
//        "id": "A",
//        "latitude": 37.17429363,
//        "longitude": -122.01100554
//     },
//     {
//        "id": "B",
//        "latitude": 38.07514282,
//        "longitude": -122.32189978
//     },
//     {
//        "id": "C",
//        "latitude": 38.756443,
//        "longitude": -123.55355851
//     }
//
// ];

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
    console.log(data);
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
            delete dataArr[element].key;//delete all values of next point so that it won't be added to route multiple times
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
      console.log(route);
    });
