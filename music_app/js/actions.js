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