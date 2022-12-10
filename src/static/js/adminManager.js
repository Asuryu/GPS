$(document).ready(function () {
    $("#searchBtn").on("click", function () { // When the search button is clicked
        var email = $("#searchInput").val(); // Get the email from the input
        if(email != "") get_user_role_by_email(email); // If the email is not empty, get the user by role
    });
});


// Function to get a user's role by email
// This function is called when the search button is clicked
// It makes an ajax call to the server to get the user's role
// If the user is found, it displays the user's role and information
// If the user is not found, it displays a message saying that the user was not found
function get_user_role_by_email(email){
    $.ajax({ // Make an ajax call to the server
        url: "/users/get_user_by_id/" + email,
        type: "GET",
        success: function (data) {
            // In this section of the code, we are creating the html for the user's information
            // We are also creating a button that allows the admin to change the user's role
            // If the user is an admin, the button will say "Remove Admin"
            // If the user is a user, the button will say "Make Admin"
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

            $("#changeRoleBtn").on("click", function () { // When the change role button is clicked
                var email = $(".searchResults .email h").text(); // Get the email from the input
                var role = $(".searchResults .role h").text().toLowerCase(); // Get the role from the input
                if (role == "admin") role = "user"; // If the role is admin, change it to user
                else if (role == "user") role = "admin"; // If the role is user, change it to admin
                else role = "user"; // If the role is anything else, change it to user
                change_user_role(email, role); // Change the user's role
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

// Function to change a user's role
// This function is called when the change role button is clicked
// It makes an ajax call to the server to change the user's role
// If the user is found, it displays the user's new role and information
// If the user is not found, it displays a message saying that the user was not found
function change_user_role(email, role){
    $.ajax({ // Make an ajax call to the server
        url: "/users/update_user",
        type: "POST",
        data: {
            user_id: email,
            new_role: role
        },
        success: function (data, status, xhr) {
            if(xhr.status == 201) window.location.href = "/login"; // If a user was an admin and was demoted, redirect them to the login page
            get_user_role_by_email(email); // Update the user's information
        },
        error: function (data) {
            if(data.status == 404){
                $(".searchResults").empty();
                $(".searchResults").append("<h>No user with that email was found</h>")
            }
        }
    });
}