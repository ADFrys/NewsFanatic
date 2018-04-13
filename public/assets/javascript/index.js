
$.getJSON("/headlines", function(data) {

  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /> https://www.newyorker.com" + data[i].url + "</p>");
    
  };

});


$(document).on("click", "p", function() {

  var thisId = $(this).attr("data-id");
  console.log(thisId);
  var thisTitle = $(this).attr("data-title")

  $.getJSON("/headlines", function(data) {

      $("#notes").append("<h2>Article Id: " + thisId + "</h2>");

      $("#notes").append("<input id='titleinput' name='title'>");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea><br>");

      $("#notes").append("<button data-id='" + thisId + "' id='savenote'>Save Note</button>");
       
    });
});

$("#savenote").on("click", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
      noteTitle: $("#titleinput").val(),
      note: $("#bodyinput").val()
    }
  })
  .then(function(data) {
    console.log(data);
    $("#notes").empty();
  })

});


