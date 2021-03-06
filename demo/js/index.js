      // DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
w = 3000;
h = 1250;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;
   active = d3.select(null);
   var centered = null;
var inittransform = null;

// DEFINE FUNCTIONS/OBJECTS
// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
  .scale([w / (2 * Math.PI)]) // scale to fit group width
  .translate([w / 2, h / 2]) // ensure centred in group
;

// Define map path
var path = d3
  .geoPath()
  .projection(projection)
;

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3
    .event
    .transform
  ;
  countriesGroup
    .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")")
  ;
}

// Define map zoom behaviour
var zoom = d3
  .zoom()
  .on("zoom", zoomed)
;

function getTextBox(selection) {
  selection
    .each(function(d) {
      d.bbox = this
        .getBBox();
      })
  ;
}

// Function that calculates zoom/pan limits and sets zoom to default value 
function initiateZoom() {
  // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
  minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
  // set max zoom to a suitable factor of this value
  maxZoom = 20 * minZoom;
  // set extent of zoom to chosen values
  // set translate extent so that panning can't cause map to move out of viewport
  zoom
    .scaleExtent([minZoom, maxZoom])
    .translateExtent([[0, 0], [w, h]])
  ;
  // define X and Y offset for centre of map to be shown in centre of holder
  midX = ($("#map-holder").width() - minZoom * w) / 2;
  midY = ($("#map-holder").height() - minZoom * h) / 2;
  // change zoom transform to min zoom and centre offsets
  svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
}

function boxZoomnn(d,t,c){
  var x, y, k;

  if (d && centered !== t) {
    var centroid = c;
    x = centroid[0];
    y = centroid[1];
    k = 2;
    centered = t;
  } else {
    x = $("svg").width() / 2;
    y = $("svg").height() / 2;
    k = 1;
    centered = null;
  }

  countriesGroup.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  if (centered)
     {
  countriesGroup.transition()
      .duration(750)
      .attr("transform", "translate(" + $("svg").width() / 2 + "," + $("svg").height() / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
     }
   else
      { 
  countriesGroup.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform",inittransform);

      } 
  }

function boxZoomn(d,t){
  if (active.node() === t) return reset();
  active.classed("active", false);
  active = d3.select(t).classed("active", true);  

  var bounds = d,
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / $("svg").width(), dy / $("svg").height());
//      if (scale < 1)
//         {
//          scale = 1.2;
//         }      
      translate = [$("svg").width() / 2 - scale * x, $("svg").height() / 2 - scale * y];

  countriesGroup.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function reset() {
  if (centered)
     {
     }
   else
      { 
  countriesGroup.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform",inittransform);

      } 

}



// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, centroid, paddingPerc) {
  minXY = box[0];
  maxXY = box[1];
  // find size of map area defined
  zoomWidth = Math.abs(minXY[0] - maxXY[0]);
  zoomHeight = Math.abs(minXY[1] - maxXY[1]);
  // find midpoint of map area defined
  zoomMidX = centroid[0];
  zoomMidY = centroid[1];
  // increase map area to include padding
  zoomWidth = zoomWidth * (1 + paddingPerc / 100);
  zoomHeight = zoomHeight * (1 + paddingPerc / 100);
  // find scale required for area to fill svg
  maxXscale = $("svg").width() / zoomWidth;
  maxYscale = $("svg").height() / zoomHeight;
  zoomScale = Math.min(maxXscale, maxYscale);
  // handle some edge cases
  // limit to max zoom (handles tiny countries)
  zoomScale = Math.min(zoomScale, maxZoom);
  // limit to min zoom (handles large countries and countries that span the date line)
  zoomScale = Math.max(zoomScale, minZoom);
  // Find screen pixel equivalent once scaled
  offsetX = zoomScale * zoomMidX;
  offsetY = zoomScale * zoomMidY;
  // Find offset to centre, making sure no gap at left or top of holder
  dleft = Math.min(0, $("svg").width() / 2 - offsetX);
  dtop = Math.min(0, $("svg").height() / 2 - offsetY);
  // Make sure no gap at bottom or right of holder
  dleft = Math.max($("svg").width() - w * zoomScale, dleft);
  dtop = Math.max($("svg").height() - h * zoomScale, dtop);
  // set zoom
  svg
    .transition()
    .duration(500)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
    );
}




// on window resize
$(window).resize(function() {
  // Resize SVG
  svg
    .attr("width", $("#map-holder").width())
    .attr("height", $("#map-holder").height())
  ;
  initiateZoom();
     setTimeout(function(){
       inittransform = countriesGroup.attr("transform")
     },200);

});

// create an SVG
var svg = d3
  .select("#map-holder")
  .append("svg")
  // set to the same size as the "map-holder" div
  .attr("width", $("#map-holder").width())
  .attr("height", $("#map-holder").height())
  // add zoom functionality
  .call(zoom)
;


// get map data
d3.json(
  "https://raw.githubusercontent.com/andybarefoot/andybarefoot-www/master/maps/mapdata/custom50.json", function(json) {
    
     $('#map-holder .loadingMsg').html('');

    //Bind data and create one path per GeoJSON feature

    countriesGroup = svg.append("g").attr("id", "map");
    // add a background rectangle
    countriesGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .on("click", reset);

    // draw a path for each feature/country
    countries = countriesGroup
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d, i) {
        return "country" + d.properties.iso_a3;
      })
      .attr("class", "country")
//      .attr("stroke-width", 10)
//      .attr("stroke", "#ff0000")
      // add a mouseover action to show name label for feature/country
      .on("mouseover", function(d, i) {
          d3.select("#countryLabel" + d.properties.iso_a3).style("display", "block");
      })
      .on("mouseout", function(d, i) {
          d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");
      })
      // add an onclick action to zoom into clicked country
      .on("click", function(d, i) {
          d3.selectAll(".country").classed("country-on", false);
          d3.select(this).classed("country-on", true);

         renderCountryInfo($("#countryLabel" + d.properties.iso_a3 + " text").html())
      //boxZoom(path.bounds(d), path.centroid(d), 20);
      boxZoomnn(path.bounds(d),this,path.centroid(d),20)
//      boxZoomn(path.bounds(d),this, 20);
      });
    // Add a label group to each feature/country. This will contain the country name and a background rectangle
    // Use CSS to have class "countryLabel" initially hidden
    countryLabels = countriesGroup
      .selectAll("g")
      .data(json.features)
      .enter()
      .append("g")
      .attr("class", "countryLabel")
      .attr("id", function(d) {
        return "countryLabel" + d.properties.iso_a3;
      })
      .attr("transform", function(d) {
        return (
          "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
        );
      })
      // add mouseover functionality to the label
      .on("mouseover", function(d, i) {
          d3.select(this).style("display", "block").on('click', function(){
          // console.log( $(this).parent())
             renderCountryInfo($(this).find('text').html())
        });
      })
      .on("mouseout", function(d, i) {
           d3.select(this).style("display", "none");
     })
      // add an onlcick action to zoom into clicked country
      .on("click", function(d, i) {
          d3.selectAll(".country").classed("country-on", false);
          d3.select("#country" + d.properties.iso_a3).classed("country-on", true);
//        boxZoom(path.bounds(d), path.centroid(d), 20);
//      boxZoomn(path.bounds(d),this, 20);
      boxZoomnn(path.bounds(d),this,path.centroid(d),20)
      });
    // add the text to the label group showing country name
    countryLabels
      .append("text")
      .attr("class", "countryName")
      .style("text-anchor", "middle")
      .attr("dx", 0)
      .attr("dy", 0)
      .text(function(d) {
        return d.properties.name;
      })
      .call(getTextBox);
    // add a background rectangle the same size as the text
    countryLabels
      .insert("rect", "text")
      .attr("class", "countryLabelBg")
      .attr("transform", function(d) {
        return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
      })
      .attr("width", function(d) {
        return d.bbox.width + 4;
      })
      .attr("height", function(d) {
        return d.bbox.height;
      });

     setTimeout(function(){
       inittransform = countriesGroup.attr("transform")
     },200);
   
    initiateZoom();
  }
);
      //# sourceURL=pen.js









//country functions






//default gloabl
var latestCountry = "";
function renderCountryInfo(country){

  
  if(latestCountry != country){
   
    triggerCountryOverlays(country);

   
  }
  else{

    removeCountryOverlays(country);
  }
}

function triggerCountryOverlays(country){
   latestCountry = country;
  console.log("adding overlay" + country);
  removeBoxes();
  var listData = getCompanyList(country);
  renderBox("Crypto Finance in "+ country, listData[0], "upperleft")
   renderBox(country +" Firm Count", listData[1] , "lowerright")
}


  function getCompanyList(country){

    if(typeof cryptoFinanceData[country] != 'object'){
      return(["Currently no company information available for this country", "0"]);
    }
    else{
      var firstString = "";
      var fundList = cryptoFinanceData[country]['fundsList'];
      for (i in fundList){
         firstString= firstString+ fundList[i] +"<br><hr><br>";
      }
      var numberFunds = cryptoFinanceData[country]['numberFunds'];
      return [firstString, numberFunds];
    }
  }

function removeCountryOverlays(country){
  latestCountry="";
  console.log("removing overlay" + country);
  removeBoxes();
}

function removeBoxes(){

  $('.darkboxholder').remove();
}

function renderBox(title, content, position){
  //needs darkbox.css
  if(typeof position !="string"){
    position = "upperleft";
  }

  var boxString = '<div class="'+position+' darkboxholder"><div class="card m-b-20 text-xs-center"><div class="card-header">'+title+'</div><div class="card-body"><p class="card-text">'+content+'</p></div><div class="card-footer text-muted"></div></div></div>';
  $('html').append(boxString);

}

cryptoFinanceData= {};
function getCryptoData(){
  $.ajax({
    url:'https://map.avocado.proofsuite.com/cloud/api/beta/index.php',
    complete:function(transport){
      cryptoFinanceData = $.parseJSON(transport.responseText);


    }
  })
}


getCryptoData();


$('.spinContainer111').on('click', function(){
  $(this).hide()
})