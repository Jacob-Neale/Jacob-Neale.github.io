drawVisualisation1("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query1.json");
drawVisualisation2("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query2.json");
drawVisualisation3("https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/query3.json");

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