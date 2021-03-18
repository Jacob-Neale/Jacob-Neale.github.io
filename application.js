var industry_colours = [
    "rgba(245, 79, 82, 0.9)",
    "rgba(81, 68, 211, 0.9)",
    "rgba(255, 166, 0, 0.9)",
    "rgba(218, 52, 144, 0.9)",
    "rgba(144, 137, 250, 0.9)",
    "rgba(55, 123, 43, 0.9)",
    "rgba(39, 128, 235, 0.9)",
    "rgba(253, 187, 47, 0.9)",
    "rgba(188, 80, 144, 0.9)",
    "rgba(0, 192, 199, 0.9)",
    "rgba(38, 141, 108, 0.9)",
    "rgba(255, 107, 69, 0.9)"
];   

drawVisualisation1("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query1.json", industry_colours);
drawVisualisation2("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query2.json", industry_colours);
drawVisualisation3("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query3.json");
drawVisualisation4("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query4.json");

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

$("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));

$("input").on("change", function(){
  $("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));
});