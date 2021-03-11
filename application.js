console.log("Hello World!");
function test()
{
    var returnData;
    $.ajax({
      type: "GET",
      url: "https://raw.githubusercontent.com/Jacob-Neale/Jacob-Neale.github.io/main/resources/data.ttl",
      dataType: "text",
      async: false,
      success: function(response)
      {
        returnData = response;
      }
    });
    return returnData;
}
var ttlData = test();
$("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));

$("input").on("change", function(){
  $("#output").val(JSON.stringify(select(ttlData, $("#s").val() ? $("#s").val() : null, $("#p").val() ? $("#p").val() : null, $("#o").val() ? $("#o").val() : null), null, 4));
});