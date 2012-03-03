$(document).ready(function(){
  var api_key = "23afca60ebf72f8d88cdcae2c4f31866";
  var api_url = "http://api.themoviedb.org/2.1/Movie.search/en/json/" + api_key + "/";

  $('#term').focus(function(){
    var full = $("#poster").has("img").length ? true : false;
    if(full == false){
      $('#poster').empty();
    }
  });

  var getPoster = function(){
    var film = $('#term').val();
    if(film != ''){
      $('#loading').show();

      $.getJSON(api_url + film + "?callback=?", function(json) {
        $('#loading').hide();

        if (json != "Nothing found.") {
          var s = "";
          var posters = json[0].posters;
          for (var i=0; i<posters.length; i++) {
            var poster = posters[i];
            s = s + '<img id="thePoster" src="' + poster.image.url + '" />';
          }
          $('#poster').html(s);
          $('#overview').html("<p>"+json[0].overview+"</p>");
        } else {
          console.log(json);
          $('#poster').html('<h2 class="loading">We\'re afraid nothing was found for that search.</h2>');
          $('#overview').html("");
        }
      });

    }

    return false;
  }

  $('#search').click(getPoster);
  $('#term').keyup(function(event){
    if(event.keyCode == 13){
      getPoster();
    }
  });

});
