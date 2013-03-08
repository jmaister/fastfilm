$(document).ready(function() {

    app.initialize();

    $('#term').focus(function() {
        var full = $("#poster").has("img").length ? true : false;
        if (full == false) {
            app.hidePoster();
        }
    });

    var doSearch = function() {
        var value = $('#term').val();
        if (value) {
            app.fillResults($('#term').val());
        }
    };

    $('#search').click(doSearch);
    $('#clear').click(app.clearResults);

    $('#term').keyup(doSearch);

    $('#less').click(function() {
        app.showPoster(-1);
    });
    $('#more').click(function() {
        app.showPoster(1);
    });



    $( "#listview" ).bind( "click", function(event, ui) {
       debugger;
    });
});

var current_data = {
    film : null,
    posters : null,
    current : null
};

var config = {
    api_key: "23afca60ebf72f8d88cdcae2c4f31866",
    api_url: "http://api.themoviedb.org/2.1/Movie.search/en/json/23afca60ebf72f8d88cdcae2c4f31866/",
};

var app = {

    fillResults: function(film) {
        $.ajax({
            url: config.api_url + film + "?callback=?",
            dataType: "jsonp",
            success: function( data ) {
                var s = "<li data-role='list-divider'>Films Found</li>";
                for (var i=0; i<data.length; i++) {
                    /*
                    s += "<li><a href='#posterpage' onclick='app.getPosters(\"" + data[i].original_name +"\")'>"
                        + data[i].original_name
                        + "</a></li>";
                    */
                    s += "<li><a href='#posterpage' onclick='app.getPosters(\"" + data[i].original_name +"\")'>"
                        + "    <p class='ui-li-aside ui-li-desc'><strong>" + data[i].rating + "</strong> / 10</p>"
                        + "    <h3 class='ui-li-heading'>" + data[i].original_name + "</h3>"
                        + "    <p class='ui-li-desc'>" + data[i].name + " - " + data[i].released + "</p>"
                        + "</a></li>";
                }
                var list = $('#resultlist');
                list.html(s);
                list.listview('refresh');
            }
        });
    },

    clearResults: function() {
        var list = $('#resultlist');
        list.html("");
        list.listview('refresh');
    },


    getPosters : function(film) {
        current_data.film = film;
        if (film != '') {
            $('#loading').show();

            $.getJSON(config.api_url + film + "?callback=?", function(json) {
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
    },

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

