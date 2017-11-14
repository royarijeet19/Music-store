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


$(document).ready(function() {
    if (window.location.pathname == '/edit_item') {
        updateEditForm();
    }
    if (window.location.pathname == "/cart") {
        $.ajax({
            url: "other/metadata.json",
            dataType: "JSON",
            success: function(data) {
                var totalcost = 0;
                $(data).each(function(i, el) {
                    var c = new CardBuilder(el.album_art, el.track, el.artist, el.album, el.track_no, el.length, el.year, el.genre, el.price);
                    $('#result_container').append(c.cardHTML);
                    totalcost = totalcost + parseFloat(el.price);
                    $('#totalcost').text("Total Cost = $" + Math.round(totalcost * 100) / 100);
                })
            },
            error: function(data) {
                alert("error loading file");
            }
        });
    }
});