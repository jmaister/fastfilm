$(document).ready(function() {
    var api_key = "23afca60ebf72f8d88cdcae2c4f31866";
    var api_url = "http://api.themoviedb.org/2.1/Movie.search/en/json/" + api_key + "/";
    
    app.initialize();

    $('#term').focus(function() {
        var full = $("#poster").has("img").length ? true : false;
        if (full == false) {
            app.hidePoster();
        }
    });

    var getPoster = function(film) {
        if (!film) {
            film = $('#term').val();
        }
        current_data.film = film;
        if (film != '') {
            $('#loading').show();

            $.getJSON(api_url + film + "?callback=?", function(json) {
                $('#loading').hide();

                if (json != "Nothing found.") {
                    current_data.posters = json[0].posters;
                    current_data.current = 2;
                    if (current_data.posters.length < 2) {
                        current_data.current = 0;
                    }

                    app.showPoster();

                    $('#overview').html("<p>" + json[0].released + "</p><p>" + json[0].overview + "</p>");
                    $('#term').value = json[0].original_name;
                } else {
                    $('#poster').html('<h2 class="loading">We\'re afraid nothing was found for that search.</h2>');
                    $('#overview').html("");
                }
            });

        }

        return false;
    }

    $('#search').click(getPoster);
    $('#term').keyup(function(event) {
        if (event.keyCode == 13) {
            getPoster();
        }
    });
    $('#less').click(function() {
        app.showPoster(-1);
    });
    $('#more').click(function() {
        app.showPoster(1);
    });

    $( "#term" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: api_url + request.term + "?callback=?",
                dataType: "jsonp",
                success: function( data ) {
                    response( $.map( data, function( item ) {
                        return {
                            label: item.original_name,
                            value: item.original_name
                        }
                    }));
                }
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            getPoster(ui.item.value);
        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });

});

var current_data = {
    film : null,
    posters : null,
    current : null
};

var app = {

    showPoster : function(jump) {
        if (jump) {
            current_data.current = current_data.current + jump;
        }
        current_data.current = Math.max(0, current_data.current)
        current_data.current = Math.min(current_data.posters.length-1, current_data.current)

        var img = '<img id="thePoster" src="' + current_data.posters[current_data.current].image.url + '" />';

        $('#buttons').show();
        $('#poster').html(img);
    },
    
    hidePoster: function() {
        $('#buttons').hide();
        $('#poster').empty();
    },

    showAlert : function(message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert( title ? (title + ": " + message) : message);
        }
    },

    initialize : function() {
        app.hidePoster();
    }
};

