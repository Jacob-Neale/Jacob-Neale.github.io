function drawVisualisation2(dataFileURL, industry_colours) {
    $.ajax({
      type: "GET",
      url: dataFileURL,
      dataType: "text",
      async: false,
      success: function(response)
      {
        data = JSON.parse(response);
      }
    });
    formattedData = handleVisualisation2Data(data);
    drawBubbleChart(formattedData, industry_colours);
}


function handleVisualisation2Data(data) {
    var formatData = [];
    industryToDPMap = {};
    for(const [key, value] of Object.entries(data)) {
        for(var i = 0; i < value.length; i++) {
            if(value[i]['o'] in industryToDPMap) {
                list = industryToDPMap[value[i]['o']];
                list.push(key);
                industryToDPMap[value[i]['o']] = list;
            } else {
                list = [];
                list.push(key);
                industryToDPMap[value[i]['o']] = list;
            }
        }
    }
    for(const [key, value] of Object.entries(industryToDPMap)) {
        if(value.length != 3) {
            delete industryToDPMap[key];
        } else {
            value.sort();
        }
    }
    for(const [key, value] of Object.entries(industryToDPMap)) {
        var vars = [];
        for(var i = 0; i < value.length; i++) {
            list = data[value[i]];
            for(var j = 0; j < list.length; j++) {
                if(list[j]['p'] === "http://www.w3.org/1999/02/22-rdf-syntax-ns#value") {
                    if(i <= 1) {
                        vars.push(parseInt(list[j]['o'].split("^^")[0]));
                    } else {
                        vars.push(parseFloat(list[j]['o'].split("^^")[0]));
                    }
                }
            }            
        }
        formatData.push({x: vars[0], y: vars[1], z: vars[2], name: formatName(key)});
    }
    formatData.sort(compare);
    return formatData;
}

function drawBubbleChart(data, industry_colours) {
    
    d3.select("#bubble_chart").selectAll("*").remove();

    // set the dimensions and margins of the graph
    var for_text = 600;
    var margin = {top: 50, right: 20, bottom: 50, left: 80},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#bubble_chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right + for_text)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
              
    var min = [data[0]['x'], data[0]['y'], data[0]['z']];
    var max = [data[0]['x'], data[0]['y'], data[0]['z']];
    for(var i = 1; i < data.length; i++) {
        if(data[i]['x'] < min[0])
            min[0] = data[i]['x'];
        if(data[i]['x'] > max[0])
            max[0] = data[i]['x'];
        if(data[i]['y'] < min[1])
            min[1] = data[i]['y'];
        if(data[i]['y'] > max[1])
            max[1] = data[i]['y'];
        if(data[i]['z'] < min[2])
            min[2] = data[i]['z'];
        if(data[i]['z'] > max[2])
            max[2] = data[i]['z'];
    }
    
    // Add X axis
    var range_x = max[0] - min[0];
    var x = d3.scaleLinear()
      .domain([min[0] - (range_x * 0.1), max[0] + (range_x * 0.1)])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add X axis title
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top - 15) + ")")
      .style("text-anchor", "middle")
      .text("Total Number of Surveys Sent Out");
      
    // Add Y axis
    var range_y = max[1] - min[1];
    var y = d3.scaleLinear()
      .domain([min[1] - (range_y * 0.1), max[1] + (range_y * 0.1)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    // Add Y axis title
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Responses");
      
      
    var lower_z = 5;
    var higher_z = 85;
    // Add a scale for bubble size
    var z = d3.scaleLinear()
      .domain([lower_z, higher_z])
      .range([lower_z, higher_z]);
      
    
    for(var i = 0; i < data.length; i++) {
        data[i]['z_real'] = data[i]['z'];
        data[i]['z'] = (data[i]['z'] + lower_z) + (data[i]['z'] * (higher_z - lower_z));
    }

    // Add title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", -(margin.top/2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Bubble chart showing the relationship between surveys sent out and responses");
     
    // Define tooltip     
    var tooltip = d3.select("#bubble_chart")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d, i) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Industry: " + i.name + "<br /><br />Total Number of Surveys Sent Out: " + i.x + "<br />Total Number of Responses: " + i.y + "<br />Proportion of Responses: " + (i.z_real * 100.0).toPrecision(3) + "%")
        .style("left", (d3.pointer(d, svg)[0]+30) + "px")
        .style("top", (d3.pointer(d, svg)[1]+30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.pointer(d, svg)[0]+30) + "px")
        .style("top", (d3.pointer(d, svg)[1]+30) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
      tooltip
        .html("")
        .style("left", "0px")
        .style("top", "0px")
    }  
    
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", function (d) { return z(d.z); } )
        .style('fill', function (d, i) { return industry_colours[i]; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
      
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append('text')
        .text(function (d) { return d.name; })
        .attr('x', function (d) { return x(d.x); } )
        .attr('y', function (d) { return y(d.y); } )
        .attr("text-anchor", "middle")
        .attr('color', 'black')
        .attr('font-size', 12)
}

function formatName(name) {
    n = name.substring(1, name.length-1);
    newString = "";
    for(var i = 0; i < n.length; i++) {
        if(n[i] === n[i].toUpperCase() && i != 0) {
            newString += " " + n[i];
        } else {
            newString += n[i];    
        }
    }
    return newString;
}

function compare( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}