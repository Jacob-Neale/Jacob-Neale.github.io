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
console.log(select(test(), null, null, "<Manufacturing>"));
