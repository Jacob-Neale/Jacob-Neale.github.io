function drawVisualisation1(dataFileURL, industry_colours) {
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
    formattedData = handleVisualisation1Data(data);
    drawPieChart(formattedData, data["<ds4>"][0]['o'], industry_colours);
}


function handleVisualisation1Data(data) {
    var formatData = [];
    for(const [key, value] of Object.entries(data)) {
        if(data[key].length > 1) {
            formatData.push({value: parseFloat(value[1]['o'].split("^^")[0]), name: formatName(value[0]['o'])});
        }
    }
    return formatData;
}

function drawPieChart(data, title, industry_colours) {
    
    d3.select("#pie_chart").selectAll("*").remove();
    
    var temp_data = data;
    temp_data.sort(compare);
    var ordered_names = [];
    for(var i = 0; i < temp_data.length; i++) {
        ordered_names.push(temp_data[i].name);
    }
    var ordered_value = data;
    ordered_value.sort(compare_value);

    // set the dimensions and margins of the graph
    var for_text = 600;
    var margin = {top: 250, right: 20, bottom: 20, left: 300},
        width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    var radius = (width / 1.5);

    // append the svg object to the body of the page
    var svg = d3.select("#pie_chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right + for_text)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
      
    var pie = d3.pie()
      .value(d => d.value);

    var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
        
    var tooltip = d3.select("#pie_chart")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
    
    var showTooltip = function(d, i) {
      d3.select(this).raise();
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html(i.data.name + " : " + (i.data.value * 100.0).toPrecision(3) + "%")
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
    
    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
        .attr("class", "bubbles")
        .attr('d', arc)
        .style('fill', function (d, i) { return industry_colours[ordered_names.indexOf(ordered_value[i].name)]; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip );
      
    svg.append("text")
      .attr("y", -(height/2)-(margin.top/2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text(title);
      
    var range = d3.range(industry_colours.length);
      
    svg.selectAll(".rects")
      .data(range).enter()
    	.append("rect")
    	.attr("y", (d,i)=> -radius + (i*30))
    	.attr("height", 20)
    	.attr("x", radius*1.25)
    	.attr("width", 20)
    	.attr("fill", (d,i)=> industry_colours[ordered_names.indexOf(ordered_value[d].name)]);
        
    svg.selectAll(".rects")
      .data(range).enter()
    	.append("text")
    	.attr("y", (d,i)=> -radius + (i*30) + 15)
    	.attr("x", radius*1.2 + 35)
    	.attr("text-anchor", "left")
        .style("font-size", "14px")
        .text(function (d, i) { return ordered_value[d].name + " : " + (ordered_value[d].value * 100.0).toPrecision(3) + "%" });
    
}

function getIndexOf(data, name) {
    for(var i = 0; i < data.length; i++) {
        if(data.name === name) {
            return i;
        }
    }
    return -1;
}

function formatName(name) {
    n = name.substring(1, name.length-1);
    newString = "";
    for(var i = 0; i < n.length; i++) {
        if(n[i] === n[i].toUpperCase()) {
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

function compare_value( a, b ) {
  if ( a.value > b.value ){
    return -1;
  }
  if ( a.value < b.value ){
    return 1;
  }
  return 0;
}