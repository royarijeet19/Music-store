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
});