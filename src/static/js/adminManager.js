$(document).ready(function () {
    $("#searchBtn").on("click", function () {
        var email = $("#searchInput").val();
        if(email != "") get_user_by_role(email);
    });
});

function get_user_by_role(email){
    $.ajax({
        url: "/users/get_user_by_id/" + email,
        type: "GET",
        success: function (data) {
            var htmlButton;
            if(data.role == "Admin") htmlButton = "<button class='button-negative'>Remove Admin</button>";
            else htmlButton = "<button class='button-positive'>Make Admin</button>";
            $(".searchResults").empty();
            $(".searchResults").append("<div class='result'>" + 
                                            "<div class='email'><h>" + data.email + "</h></div>" +
                                            "<div class='role'><h>" + (data.role) + "</h></div>" +
                                            "<div id='changeRoleBtn' class='button'>" + htmlButton + "</div>" +
                                        "</div>"
            );
            $("#changeRoleBtn").on("click", function () {
                var email = $(".searchResults .email h").text();
                var role = $(".searchResults .role h").text().toLowerCase();
                if (role == "admin") role = "user";
                else if (role == "user") role = "admin";
                else role = "user";
                change_user_role(email, role);
            });
        },
        error: function (data) {
            if(data.status == 404){
                $(".searchResults").empty();
                $(".searchResults").append("<h>No user with that email was found</h>")
            }
        }
    });
}

function change_user_role(email, role){
    $.ajax({
        url: "/users/update_user",
        type: "POST",
        data: {
            user_id: email,
            new_role: role
        },
        success: function (data, status, xhr) {
            if(xhr.status == 201) window.location.href = "/login";
            get_user_by_role(email);
        },
        error: function (data) {
            if(data.status == 404){
                $(".searchResults").empty();
                $(".searchResults").append("<h>No user with that email was found</h>")
            }
        }
    });
}