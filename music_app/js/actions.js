function add_to_cart(x) {
    console.log("add_to_cart: " + x);
    data = {
        "track_id": x
    };

    $.ajax({
        url: "add_to_cart",
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