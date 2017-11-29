class vCardBuilder {

    constructor(album_art, track, artist, album, track_no, length, year, genre, price) {
        if (track.length < 20) {
            this.track = track;
        } else {
            this.track = track.slice(0, 20) + '...';
        }
        length = length.split(":");

        genre = genre[0];
        this.card = '<div class="vcard">' +
            '<div class="vcard_left">' +
            '<img src="' + album_art + '">' +
            '</div>' +
            '<div class="vcard_right">' +
            '  <h1>' + this.track + '</h1>' +
            '  <h2>' + artist + '</h2>' +
            '</div>  </div>';
    }


    get cardHTML() {
        this.card = this.card.replace('replace_placeholder', '');
        return this.card;
    }
}

class CardBuilder {

    constructor(track_id, album_art, track, artist, album, track_no, length, year, genre, price) {
        this.track = track;
        this.track_id = track_id;
        length = length.split(":");
        genre = genre[0];
        this.card = '<div class="card" id="'+this.track_id+'">' +
            '<div class="card_left">' +
            '<img src="' + album_art + '">' +
            '</div>' +
            '<div class="card_right">' +
            '  <h1>' + track.slice(0, 25) + '</h1>' +
            '  <h2>' + artist + '</h2>' +
            '  <h2>' + album + '</h2>' +
            '  <div class="card_right__details">' +
            '    <ul>' +
            '      <li>#' + track_no + '</li>' +
            '      <li>' + length[0] + ' min ' + length[1] + ' sec</li>' +
            '      <li>' + year + '</li>' +
            '      <li>' + genre + '</li>' +
            '    </ul>' +
            '  </div>' +
            '  <span>' +
            '    <div class="card_right__cost">$' + price + '</div>' +
            'replace_placeholder' +
            '  </span>' +
            '</div>  </div><br>';
    }

    editable() {
        var ebutton = '    <div class="card_right__ebutton">' +
            "      <a onclick='edit_item(\"" + this.track + "\")'>" +
            '        <i class="fa fa-cog" aria-hidden="true"></i>' +
            '        EDIT' +
            '      </a>' +
            '    </div> replace_placeholder';
        this.card = this.card.replace('replace_placeholder', ebutton);
    }
    deletable() {
        var ebutton = '    <div class="card_right__dbutton">' +
            "      <a onclick='delete_track(\"" + this.track_id + "\")'>" +
            '        <i class="fa fa-trash" aria-hidden="true"></i>' +
            '        DELETE' +
            '      </a>' +
            '    </div> replace_placeholder';
        this.card = this.card.replace('replace_placeholder', ebutton);
    }
    cartable() {
        var button = '    <div class="card_right__button"> ' +
            "      <a  id='cbtn"+this.track_id+"'' onclick='add_to_cart(\"" + this.track_id + "\")'>" +
            '        <i class="fa fa-shopping-cart" aria-hidden="true"></i>' +
            '        ADD TO CART' +
            '      </a>' +
            '    </div> replace_placeholder';
        this.card = this.card.replace('replace_placeholder', button);
    }
    get cardHTML() {
        this.card = this.card.replace('replace_placeholder', '');
        return this.card;
    }
}

function userType(callback) {
    $.ajax({
        url: "/api/user_type",
        type: "GET",
        success: function(data) {
            callback(data.user_type);
        },
        error: function(data) {
            fixBar("guest");
        }
    });
}

function populateSearch(user_type) {
    $.ajax({
        url: "/api/search_track",
        dataType: "JSON",
        success: function(data) {
            $(data).each(function(i, el) {
                var c = new CardBuilder(el.track_id, el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
                if (user_type == 'user') {
                    c.cartable();
                }
                if (user_type=='admin'){
                    c.cartable();
                    c.editable();
                    c.deletable();
                }
                $('#result_container').append(c.cardHTML);

            })
        },
        error: function(data) {
            alert("error loading file");
        }
    });
}



function populateTop(identifier, index){
  $.ajax({
        url: "/other/metadata.json",
        dataType: "JSON",
        success: function(data) {
            data = data.slice(index, index+8);
            $(data).each(function(i, el) {
                var c = new vCardBuilder(el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
                $(identifier).append(c.cardHTML);

            })
        },
        error: function(data) {
            alert("error loading file");
        }
    });
}




$(document).ready(function() {
    if(window.location.pathname=='/'){
      populateTop('#top_container1',0);
      populateTop('#top_container2',8);
      populateTop('#top_container3',16);
    }
    if(window.location.pathname=='/search'){
        userType(populateSearch);
    }
});