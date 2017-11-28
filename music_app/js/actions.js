function add_to_cart(x) {
    console.log("add_to_cart: " + x);
    data = {
        "track_id": x
    };


    $.ajax({
        url: "/api/add_to_cart",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(data),
        success: function(res) {
            console.log(res);
            $('#'+x).css("background-color", "#f5d45c");
            $('#'+x).html("<i class='fa fa-check' aria-hidden='true'></i> ADDED");
            $('#'+x).attr("onclick","");
        },
        error: function(res) {
            alert("error adding to cart");
        }
    });
}

function signin() {
    uname = $('#uname').val();
    pwd = $('#pwd').val();
    pwd_hash = sha512(pwd);
    data = {
        "uname": uname,
        "pwd": pwd_hash
    }
    $.ajax({
        url: "/api/signin",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(data),
        success: function(data, textStatus, xhr) {
            if (xhr.status == 200) {
                window.location.href = "/";
            } else {
                alert("Couldnt login user");
            }
        },
        error: function(res) {
            alert("error signing in");
        }
    });
}



function purchase() {
    console.log("purchase");

    $.ajax({
        url: "/api/make_purchase",
        type: "GET",
        success: function(res, textStatus, xhr) {
            if (xhr.status = 200) {
                alert("purchase successful");
                window.location.href = "/";
            }
        },
        error: function(res) {
            alert("error purchasing cart");
        }
    });
}

function fill_purchases(){
    // $.ajax({
    //      url: "/get_purchases",
    //      dataType: "JSON",
    //      success: function(data) {
    //          $(data).each(function(i, purch) {
    //              $(purch).each(function(j, el) {
    //                  ts = Object.keys(el)[0];
    //                  purchs = Object.values(el)[0];
    //                  $('#purchase_container').append('<h1>Purchase on ' + ts + '</h1>');
    //                  $('#purchase_container').append("<div id='result_container" + i + "' class='result_container'></div>");
    //                  $(purchs).each(function(k, elm) {
    //                      var c = new CardBuilder(elm.track_id,elm.album_art, elm.track, elm.artist, elm.album, elm.track_no, elm.length, elm.year, elm.genre, elm.price);
    //                      c.editable();
    //                      $('#result_container' + i).append(c.cardHTML);
    //                  });
    //              });
    //          })
    //      },
    //      error: function(data) {
    //          alert("error loading file");
    //      }
    //  });
     $.ajax({
         url: "/api/purchase_history",
         type: "GET",
         success: function(data) {
             $(data).each(function(i, purch) {
                 $(purch).each(function(j, el) {
                     ts = Object.keys(el)[0];
                     purchs = Object.values(el)[0];
                     $('#purchase_container').append('<h1>Purchase on ' + ts + '</h1>');
                     $('#purchase_container').append("<div id='result_container" + i + "' class='result_container'></div>");
                     $(purchs).each(function(k, elm) {
                         var c = new CardBuilder(elm.track_id,elm.album_art, elm.track, elm.artist, elm.album, elm.track_no, elm.length, elm.year, elm.genre, elm.price);
                         c.editable();
                         $('#result_container' + i).append(c.cardHTML);
                     });
                 });
             })
         },
         error: function(data) {
             alert("error loading file");
         }
     });

}

function fill_items_container(){
    $.ajax({
         url: "/other/metadata.json",
         dataType: "JSON",
         success: function(data) {
                $(data).each(function(i, el) {
                    var c = new CardBuilder(el.track_id, el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
                    c.editable();
                    $('#items_container').append(c.cardHTML);
                })
            },
         error: function(data) {
             alert("error loading file");
         }
     });
}

function add_track(){
    data={
        "track" : $('#track').val(),
        "album" : $('#album').val(),
        "artist" : $('#artist').val(),
        "price" : $('#price').val(),
        "length" : $('#length').val(),
        "track_no" : $('#track_no').val(),
        "year" : $('#year').val(),
        "genre" : $('#genre').val(),
        "album_art" : $('#album_art').val(),
        "type": "add"
  }
    $.ajax({
        url: "/api/track",
        dataType: "JSON",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data){
            alert("Added track!");
            window.location.href="/";
        },
        error: function(data){

        }
    });
}

function delete_track(track_id){
    $.ajax({
        url: "/api/track/"+track_id,
        type: "DELETE",
        success: function(){
            alert("Deleted track!");
            $('#'+track_id).remove();
        },
        error: function(){

        }
    });
}


$(document).ready(function() {
    if (window.location.pathname == "/cart") {
        // $.ajax({
        //     url: "other/metadata.json",
        //     dataType: "JSON",
        //     success: function(data) {
        //         var totalcost = 0;
        //         $(data).each(function(i, el) {
        //             var c = new CardBuilder(el.track_id, el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
        //             $('#result_container').append(c.cardHTML);
        //             totalcost = totalcost + parseFloat(el.price);
        //             $('#totalcost').text("Total Cost = $" + Math.round(totalcost * 100) / 100);
        //         })
        //     },
        //     error: function(data) {
        //         alert("error loading file");
        //     }
        // });
            $.ajax({
        url: "/api/fetch_cart",
        type: "GET",
             success: function(data) {
                var totalcost = 0;
                $(data).each(function(i, el) {
                    var c = new CardBuilder(el.track_id, el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
                    $('#result_container').append(c.cardHTML);
                    totalcost = totalcost + parseFloat(el.price);
                    $('#totalcost').text("Total Cost = $" + Math.round(totalcost * 100) / 100);
                })
            },
        error: function(res) {
            alert("error purchasing cart");
        }
    });
    }
    if (window.location.pathname=='/purchases'){
        fill_purchases();
    }
});