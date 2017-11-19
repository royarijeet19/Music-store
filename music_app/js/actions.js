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

function add_click() {
    data = {"edit_type": "add"}
    $.ajax({
        url: "/api/edit_type",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(data),
        success: function(res, textStatus, xhr) {
            if(xhr.status==200){
                window.location.href="/edit_item";
            }
        },
        error: function(res) {
            alert("error adding to cart");
        }
    });
}

function edit_click() {
    data = {"edit_type": "edit"}
    $.ajax({
        url: "/api/edit_type",
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify(data),
        success: function(res, textStatus, xhr) {
            if(xhr.status==200){
                window.location.href="/edit_item";
            }
        },
        error: function(res) {
            alert("error adding to cart");
        }
    });
}

function updateEditForm(){
    $.ajax({
        url: "/api/edit_type",
        type: "GET",
        success: function(res, textStatus, xhr) {
            if (res.edit_type=="edit"){
                l=["track", "album", "artist", "price", "length", "track_no", "year", "genre", "album_art"];
                for(i=0;i<l.length;i++){
                    x=$("#"+l[i]);
                    x.val(res[l[i]]);
                };
            }
        },
        error: function(res) {
            alert("error adding to cart");
        }
    });
}

function purchase() {
    console.log("purchase");

    $.ajax({
        url: "/api/purchase",
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
         url: "/purchase_history",
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


$(document).ready(function() {
    if (window.location.pathname == '/edit_item') {
        updateEditForm();
    }
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
    if (window.location.pathname=='/edit_items'){
        fill_items_container();
    }
});