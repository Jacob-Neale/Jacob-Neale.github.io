function drawVisualisation1(dataFileURL) {
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
    drawPieChart(formattedData, data["<ds4>"][0]['o']);
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

function drawPieChart(data, title) {
    
    d3.select("#pie_chart").selectAll("*").remove();

    var height = 400;
    var width = 400;
    var r_height = 500;
    var r_width = 500;
    var radius = (width -2) / 2;
    var svg = d3.select('#pie_chart')
      .append('svg')
      .attr('width', r_width)
      .attr('height', r_height)
      .append('g')
      .attr('transform', `translate(${r_width/2}, ${(r_height)/2})`);
      
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
        .style('fill', function (d, i) { return "grey"; } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip );
      
    svg.append("text")
      .attr("y", -r_height/2 + 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(title);
    
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