function PriorityQueue () {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  };
  this.dequeue = function () {
    return this._nodes.shift().key;
  };
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  this.isEmpty = function () {
    return !this._nodes.length;
  };
}

/**
 * Pathfinding starts here
 */
function Graph(){
  var INFINITY = 1/0;
  this.vertices = {};

  this.addVertex = function(name, edges){
    this.vertices[name] = edges;
  };

  this.shortestPath = function (start, finish) {
    var nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [],
        smallest, vertex, neighbor, alt;

    for(vertex in this.vertices) {
      if(vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      }
      else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while(!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if(smallest === finish) {
        path = [];

        while(previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      for(neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if(alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return path;
  };
}

var g = new Graph();

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
       "latitude": 37.47966804,
       "longitude": -123.03159302
    }
];

var places = [];

for (var obj in input)
{
  places.push({
    "point": {"latitude": input[obj].latitude, "longitude": input[obj].longitude}
  });
}

var url = "https://api.tomtom.com/routing/1/matrix/json?key=iKNkC5W8ARvRHaAbiVUE5kT3P45IGXtF&routeType=shortest&travelMode=truck";

var data = {
  "origins":[
  {
      "point": {"latitude": 52.36006,"longitude": 4.85106}
  },
  {
      "point": {"latitude": 52.36187,"longitude": 4.85056}
  }
],  "destinations": [
    {
        "point": {"latitude": 52.36006,"longitude": 4.85106}
    },
    {
        "point": {"latitude": 52.36187,"longitude": 4.85056}
    }
  ]
};

function success(response)
{
  console.log(response)
}

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
  });


g.addVertex('A', {B: 7, C: 8});
g.addVertex('B', {A: 7, F: 2});
g.addVertex('C', {A: 8, F: 6, G: 4});
g.addVertex('D', {F: 8});
g.addVertex('E', {H: 1});
g.addVertex('F', {B: 2, C: 6, D: 8, G: 9, H: 3});
g.addVertex('G', {C: 4, F: 9});
g.addVertex('H', {E: 1, F: 3});

// Log test, with the addition of reversing the path and prepending the first node so it's more readable
g.shortestPath('A', 'H').concat(['A']).reverse();
