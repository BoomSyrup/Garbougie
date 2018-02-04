var places = []; //puts points into a format that the API can understand
var dataArr = []; //stores dataArred data from API
var route = []; //route to send back to user in sorted order

var input;
$.getJSON("http://f7c43a95.ngrok.io/all", function(json) {
  input = json;
  for (i = 0; i < json.length; i++)
  {
  // console.log(json[i].lat+" "+json[i].lng);
    places.push({
      "point": {"latitude": json[i].lat, "longitude": json[i].lng}
    });
  }
}).done(function() {
  // var data = JSON.stringify(data);
  // console.log(content);
  var url = "https://api.tomtom.com/routing/1/matrix/json?key=iKNkC5W8ARvRHaAbiVUE5kT3P45IGXtF&routeType=shortest&travelMode=truck";

  var content = {
    "origins": places,  "destinations": places
  };

  data = JSON.stringify(content);

  $.ajax({
    'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    'type': "POST",
    'url': url,
    'data': data,
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
          console.log(dataArr[start]);
          for(time in dataArr[start]["times"])
          {
            console.log(time);
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
            if(route[id] == input[node].id)
            {
              routeObjects.push(input[node]);
            }
          }
        }

        var sortedData = routeObjects;
        var newData = JSON.stringify(sortedData, null, 3);
        // console.log(newData);
        $.ajax({
          'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          'type': "POST",
          'url': "http://f7c43a95.ngrok.io/write",
          'data': newData,
          'dataType': 'json'
        }).done(function(){
          console.log("Complete!")
        });
      });

});


  //gets data from the Tom Tom API
