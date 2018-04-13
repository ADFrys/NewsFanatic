
$.getJSON("/headlines", function(data) {

  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /> https://www.newyorker.com" + data[i].url + "</p>");
  };

});


$(document).on("click", "p", function() {

  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.getJSON("/headlines/", function(data) {

      console.log(data);

      $("#notes").append("<h2>Article Id: " + thisId + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {

        $("#title").val(data.note.noteTitle);

        $("#note").val(data.note.note);
      }
    });
});

$("#savenote").on("click", function() {
  var title = $("#titleinput").val().trim();
  var note = $("#bodyinput").val().trim();
});


