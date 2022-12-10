const WEEKDAY = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira"];

$(document).ready(function () {

    // Check if the user is an admin
    // If the user is an admin he can edit the meals
    var admin = role == "admin" ? true : false;

    if(admin){
        tippy(".menu-item", { // Add a tippy to each menu item (admin)
            // two tipps, one saying that you can change the intent, and another saying that you can edit the meal
            content: "Click to change meal intent<br>Right click to edit meal",
            allowHTML: true,
        });
    } else {
        tippy(".menu-item", { // Add a tippy to each menu item
            content: "Click to change meal intent",
            allowHTML: true,
        });
    }

    get_user_intents(); // Get the user intents to update the UI initially
    $("#type").val(1); // Set the select to the first option
    change_meal_type("Peixe", admin); // Get the meals for the selected type

    // Handler for when the user selects a option in the select
    $("#type").change(function () {
        var type = $(this).val();
        if (type == 1) type = "Peixe";
        else if (type == 2) type = "Carne";
        else if (type == 3) type = "Vegetariano";
        change_meal_type(type);
    });

    $(".menu-item").on("click", function () { // When user clicks on a meal
        var id = $(this).attr("id");
        // Check if the meal is selected
        // If it is selected, delete the intent
        // If it is not selected, register the intent
        if($(this).hasClass("selected")) delete_meal_intent(id);
        else register_meal_intent(id);
    });

    $(".menu-item").on("contextmenu", function (e) { // When user right clicks on a meal
        if(admin){ // If the user is an admin
            e.preventDefault();
            var id = $(this).attr("id");
            edit_meal(id) // Edit the meal
        }
    })
});


function change_meal_type(type, admin){
    $.ajax({ // Make GET request to the server to get the meals for the selected type
        url: "/menu?type=" + type,
        type: "GET",
        success: function (data) {
            $(".menu-wrap").empty();
            for (var i = 0; i < data.menu.length; i++) { // For each meal
                var item = data.menu[i];
                if(item[3] == "Almoço"){ // If the meal is for lunch
                    $("#menu .menu-wrap#almoco").append( // Create a div with the meal info
                        "<div id='" + item[0] + "' class='menu-item'>" +
                            "<p1>" + WEEKDAY[parseInt(item[5]) - 1] + "</p1><br>" +
                            "<h>" + item[1] + "</h>" + 
                            "<p>" + item[2] + "</p>" + 
                        "</div>"
                    )
                }
                else if(item[3] == "Jantar"){ // If the meal is for dinner
                    $("#menu .menu-wrap#jantar").append( // Create a div with the meal info
                        "<div id='" + item[0] + "' class='menu-item'>" +
                            "<p1>" + WEEKDAY[parseInt(item[5]) - 1] + "</p1><br>" +
                            "<h>" + item[1] + "</h>" + 
                            "<p>" + item[2] + "</p>" + 
                        "</div>"
                    )
                }
            }
        
            if(admin){
                tippy(".menu-item", { // Add a tippy to each menu item (admin) [reapplying the tippy]
                    content: "Click to change meal intent<br>Right click to edit meal",
                    allowHTML: true,
                });
            } else {
                tippy(".menu-item", { // Add a tippy to each menu item [reapplying the tippy]
                    content: "Click to change meal intent",
                    allowHTML: true,
                });
            }

            get_user_intents(); // Get the user intents to refresh the UI
            $(".menu-item").on("click", function () { // When user clicks on a meal
                var id = $(this).attr("id");
                // Check if the meal is selected
                // If it is selected, delete the intent
                // If it is not selected, register the intent
                if($(this).hasClass("selected")) delete_meal_intent(id);
                else register_meal_intent(id);
            });

            $(".menu-item").on("contextmenu", function (e) { // When user right clicks on a meal
                if(admin){ // If the user is an admin
                    e.preventDefault();
                    var id = $(this).attr("id");
                    edit_meal(id) // Edit the meal
                }
            })
        }
    });
}

// Function to register meal intent
// This function consists in a POST request to the server
// The server will register the intent in the database
// If the request is successful, the UI will be updated
// If the request fails, the user will be notified
function register_meal_intent(id){
    swal({
        title: "Are you sure?",
        text: "Your meal intent will be registered",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({ // Make POST request to the server to register the intent
                url: "/intent",
                type: "POST",
                data: {
                    meal_id: id
                },
                success: function (data) {
                    swal("Meal intent registered", {
                        icon: "success",
                        button: false,
                        timer: 2000
                    });
                    $(".menu-item" + "#" + id).addClass("selected");
                },
                error: function (data) {
                    swal("An error has occurred while registering intent", {
                        icon: "error",
                    });
                }
            });
        }
    });
}

// Function to delete meal intent
// This function consists in a DELETE request to the server
// The server will delete the intent in the database
// If the request is successful, the UI will be updated
// If the request fails, the user will be notified
function delete_meal_intent(id){
    swal({
        title: "Are you sure?",
        text: "Your meal intent will be deleted",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({ // Make DELETE request to the server to delete the intent
                url: "/intent",
                type: "DELETE",
                data: {
                    meal_id: id
                },
                success: function (data) {
                    swal("Meal intent deleted", {
                        icon: "success",
                        button: false,
                        timer: 2000
                    });
                    $(".menu-item" + "#" + id).removeClass("selected");
                },
                error: function (data) {
                    swal("An error has occurred while deleting the intent", {
                        icon: "error",
                    });
                }
            });
        }
    });
}

// Function to edit meal
// This function consists in bunch of swal modals
// The user will be asked to insert the new meal name and the new meal description
// If the request is successful, the UI will be updated
// If the request fails, the user will be notified
function edit_meal(id){
    swal({ // First modal to insert the new meal name
        title: "Edit meal details",
        text: "Insert the new meal name",
        input: "text",
        content: {
            element: "input",
            attributes: {
                placeholder: "Meal name",
                type: "text",
                value: $(".menu-item" + "#" + id + " h").text(),
            },
        },
        buttons: {
            cancel: "Cancel",
            confirm: {
                text: "Next",
                value: null,
                visible: true,
                closeModal: true,
            }
        }
    }).then((value) => {
        if(value == "") value = $(".menu-item" + "#" + id + " h").text(); // If the user clicks on next without inserting a value, use the old value
        if(value == null) return; // If the user clicks on cancel, return
        if(isBlank(value)){ // If the user inserts a blank value, notify the user
            swal({
                // error
                title: "Error",
                text: "The meal name cannot be empty",
                icon: "error"
            })
        }
        if(!isBlank(value)){ // If the user inserts a valid value, ask for the new meal description
            swal({ // Second modal to insert the new meal description
                title: "Edit meal details",
                text: "Insert the new meal description",
                input: "text",
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Meal description",
                        type: "text",
                        value: $(".menu-item" + "#" + id + " p").text(),
                    },
                },
                buttons: {
                    cancel: "Cancel",
                    confirm: {
                        text: "Next",
                        value: null,
                        visible: true,
                        closeModal: true,
                    }
                }
            }).then((value2) => {
                if(value2 == "") value2 = $(".menu-item" + "#" + id + " p").text(); // If the user clicks on next without inserting a value, use the old value
                if(value2 == null) return; // If the user clicks on cancel, return
                if(isBlank(value2)){ // If the user inserts a blank value, notify the user
                    swal({
                        // error
                        title: "Error",
                        text: "The meal description cannot be empty",
                        icon: "error"
                    })
                }
                if(!isBlank(value2)){ // If the user inserts a valid value, ask for confirmation
                    swal({
                        title: "Are you sure?",
                        text: "The meal details will be changed",
                        content: {
                            element: "div",
                            attributes: {
                                innerHTML: "<h3 style='color: #1F1F1F'>Title: " + value + "</h3><p style='color: #1F1F1F'>Description: " + value2 + "</p>"
                            }
                        },
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                        closeModal: false
                    }).then((willEdit) => {
                        if (willEdit) { // If the user confirms, make a POST request to the server to edit the meal
                            $.ajax({
                                url: "/menu",
                                type: "POST",
                                data: {
                                    menu_id: id,
                                    new_title: value,
                                    new_description: value2
                                },
                                success: function (data) {
                                    swal("Meal edited", {
                                        icon: "success",
                                        button: false,
                                        timer: 2000
                                    });
                                    $(".menu-item" + "#" + id + " h").text(value);
                                    $(".menu-item" + "#" + id + " p").text(value2);
                                    get_user_intents();
                                },
                                error: function (data) {
                                    swal("An error has occurred while editing the menu", {
                                        icon: "error",
                                    });
                                }
                            });
                        }
                    })
                }
            });
        }
    })
}

// Function to get the user intents
// This function will make a GET request to the server to get the user intents
// If the request is successful, the UI will be updated
// If the request fails, the user will be notified
function get_user_intents(){
    $.ajax({
        url: "/intent",
        type: "GET",
        success: function (data) {
            // remove all selected classes
            $(".menu-item").removeClass("selected");
            for (var i = 0; i < data.intents.length; i++) {
                var intent = data.intents[i];
                $(".menu-item" + "#" + intent).addClass("selected");
            }
        }
    });
}

// Function to check if a string is blank
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}