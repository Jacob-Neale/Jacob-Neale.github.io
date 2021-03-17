function drawVisualisation3(dataFileURL) {
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
    formattedData = handleVisualisation3Data(data);
    drawStackedBarChart(formattedData);
}


function handleVisualisation3Data(data) {
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
        if(value.length != 3 || !key.startsWith('<')) {
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
                    vars.push(parseFloat(list[j]['o'].split("^^")[0]));
                }
            }            
        }
        formatData.push({v1: vars[0], v2: vars[1], v3: vars[2], name: formatName(key)});
    }
    formatData.sort(compare);
    return formatData;
}

function drawStackedBarChart(data) {

    d3.select("#stacked_bar_chart").selectAll("*").remove();
    
    var titles = ["Continuing Trade", "Permanently Ceased Trading", "Temporarily Closed/Paused Trading"];

    // set the dimensions and margins of the graph
    var for_text = 600;
    var margin = {top: 100, right: 20, bottom: 400, left: 80},
        width = 800 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#stacked_bar_chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right + for_text)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
              
    // Add Y axis
    var range_y = 100;
    var y = d3.scaleLinear()
      .domain([0, 100])
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
      .text("Percentage");
      
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    x.domain(data.map(function(d) { return d.name; }));
    
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr('font-size', 11)
        .attr("transform", "rotate(-65)" );
        
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
        .html("Industry: " + i.name + "<br /><br />" + titles[0] + ": " + (i.v1 * 100.0).toPrecision(3) + "%<br />" + titles[1] + ": " + (i.v2 * 100.0).toPrecision(3) + "%<br />" + titles[2] + ": " + (i.v3 * 100.0).toPrecision(3) + "%")
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

    // colors
    var colors = [
        "rgb(104, 129, 216)",
        "rgb(193, 135, 56)",
        "rgb(184, 76, 62)"];    
    
    // append the rectangles for the bar chart
    svg.append("g").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.v1*100.0); })
        .attr("height", function(d) { return height - y(d.v1*100.0); })
        .style('fill', function (d, i) { return colors[0]; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )

    svg.append("g").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.v1*100.0 + d.v2*100.0); })
        .attr("height", function(d) { return height - y(d.v2*100.0); })
        .style('fill', function (d, i) { return colors[1]; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
        
    svg.append("g").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.v1*100.0 + d.v2*100.0 + d.v3*100.0); })
        .attr("height", function(d) { return height - y(d.v3*100.0); })
        .style('fill', function (d, i) { return colors[2]; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
     
    var range = d3.range(colors.length);
      
    svg.selectAll(".rects")
      .data(range).enter()
    	.append("rect")
    	.attr("y", (d,i)=> (i*50))
    	.attr("height", 30)
    	.attr("x", width*1.05)
    	.attr("width", 30)
    	.attr("fill", (d,i)=> colors[i] );
        
    svg.selectAll(".rects")
      .data(range).enter()
    	.append("text")
    	.attr("y", (d,i)=> (i*50) + 20)
    	.attr("x", width*1.05 + 35)
    	.attr("text-anchor", "left")
        .style("font-size", "14px")
        .text(function (d, i) { return titles[d]; });
        
    // Add title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", -(margin.top/2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Stacked bar chart showing percentages for all responding businesses' trading status with respect to industry");

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