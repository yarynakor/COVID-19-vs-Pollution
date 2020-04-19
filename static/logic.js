function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// Retrieve data from the CSV file and execute everything below
d3.json("http://127.0.0.1:5000/data", function(covidData) {
console.log(covidData)

  covidDates = [];
  covidDatesSlider = [];
  begDate = new Date("2020-03-01");
  curDate = begDate;
  covidData.data.forEach(function(data) {

    myDate = new Date(data.Date);

    if(!covidDates.includes(data.Date) 
      && myDate.getDay() == 6 
      && myDate.getTime() >= curDate.getTime()){

      var mydate = new Date(data.Date);
      //console.log(mydate.toDateString()); 

      month = (myDate.getMonth() + 1);
      day = myDate.getDate();
      year = myDate.getYear()-100;
      if (month.length < 2) 
        month = '0' + month;
      if (day.length < 2) 
        day = '0' + day;

      dateString = month + "/" + day + "/" + year

      covidDates.push(data.Date);
      covidDatesSlider.push(dateString);
    }  
    
  });
  // covidDates.reverse();
  // covidDatesSlider.reverse();


  function getTotalCases(state, d){
    totalcases = 0;
    covidData.data.forEach(function(data) {

      dateLimit = new Date(d);

      dateLimit.setDate(dateLimit.getDate() + 7);

      dataFile = new Date(data["Date"]);
      
      if(dataFile.getTime() < dateLimit.getTime()){

        if (data.State == state){
          data["Positive_Cases"] = +data["Positive_Cases"]
          totalcases = data["Positive_Cases"]
        }
      }

    });
    return totalcases;
  }

  // Creating map object
  var map = L.map("map", {
    center: [39.09, -95.71],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);
    
  var link = "static/States.json";

  function getColor(d) {
    return d > 200000 ? '#800026' :
    d > 100000  ? '#BD0026' :
    d > 75000  ? '#E31A1C' :
    d > 50000  ? '#FC4E2A' :
    d > 25000   ? '#FD8D3C' :
    d > 10000   ? '#FEB24C' :
    d > 1000   ? '#FED976' :
               '#FFEDA0';
  } 
  
  // Function that will determine the color of the state
  function chooseColor(state, label) {

      totalcases = getTotalCases(state, label);

      return getColor(totalcases);
  }
  
  // Grabbing our GeoJSON data.
  d3.json(link, function(data) {

    // Creating a geoJSON layer with the retrieved data
    getDataAddMarkers = function( {label, value, map, exclamation} ) {

      var removeMarkers = function() {
        map.eachLayer( function(layer) {

        if ( layer.myTag &&  layer.myTag === "myGeoJSON") {
              map.removeLayer(layer)
            }
        });
      }
      
      removeMarkers();

      slider_date = label;

      L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        style: function(feature) {
          return {
            color: "white",
            // Call the chooseColor function to decide which color to color our state
            fillColor: chooseColor(feature.properties.NAME, slider_date),
            fillOpacity: 0.5,
            weight: 1.5
          };
        },
        // Called on each feature
        onEachFeature: function(feature, layer) {
          // Set mouse events to change map styling
          layer.myTag = "myGeoJSON";

          layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
            // When a feature (state) is clicked, it is enlarged to fit the screen
            click: function(event) {
            //   map.fitBounds(event.target.getBounds());
            }
          });
          // Giving each feature a pop-up with information pertinent to it needs to be fixed to attach to the CSV
          layer.bindPopup("<h3>" + feature.properties.NAME + "</h3> <hr> <h4>" + "Cases: " + numberWithCommas(getTotalCases(feature.properties.NAME, slider_date)) + "</h4>");
    
        }

      }).addTo(map);
    }

    L.control.timelineSlider({
      timelineItems: covidDatesSlider, 
      changeMap: getDataAddMarkers,
      extraChangeMapParams: {exclamation: "Extra data"} })
    .addTo(map);  

    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1000, 10000, 25000, 50000, 75000, 100000, 200000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

  });
});


d3.json('http://127.0.0.1:5000/plotly', function(data) {
  var data = data.data
  var layout = data.layout
      
  Plotly.plot('line', data,layout)

});


// d3.json('/mapCovid', function(data) {
//   var data = data.data
//   var layout = data.layout
      
//   Plotly.plot('line', data,layout)

// });