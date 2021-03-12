function getFileText(url)
{
    var returnData;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async: false,
      success: function(response)
      {
        returnData = response;
      }
    });
    return returnData;
}

var ttlData = getFileText("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/data.ttl");

var industries_data = select(ttlData, null, null, "<Industry>");
var industry_ignore_key = ["<AllIndustries>"];
var industry_list = [];
var industry_names = [];
for(item in industries_data) {
    if(!industry_ignore_key.includes(item)) {
        var name = industries_data[item][1]['o'];
        name = name.substring(1, name.length-1);
        industry_list.push(item);
        industry_names.push(name);
    }
}

var surveys_sent_out = select(ttlData, null, null, "<Total_1>");

var data = [];
for(item in surveys_sent_out) {
    var accept = false;
    var industry = null;
    var value = null;
    for(index in item) {
        if(surveys_sent_out[item][index]) {
            if(industry_list.includes(surveys_sent_out[item][index]['o'])) {
                accept = true;
                industry = industry_names[industry_list.indexOf(surveys_sent_out[item][index]['o'])];
            }
            if(surveys_sent_out[item][index]['p'] == "rdf:value") {
                value = parseInt(surveys_sent_out[item][index]['o']);
            }    
        }
    }
    if(accept) {
        data.push({value: value, name: industry});
    }
}

drawPieChart(data, "Total number of surveys sent out with respect to industry");

$("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));

$("input").on("change", function(){
  $("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));
});