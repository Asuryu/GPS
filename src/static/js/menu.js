const WEEKDAY = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday"];

var changed_intents = []

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
        change_meal_type(type, admin);
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
    $.ajax({ // Make POST request to the server to register the intent
        url: "/intent",
        type: "POST",
        data: {
            meal_id: id
        },
        success: function (data) {
            if(data.changed_intents.length > 0){
                // add to changed intents array
                changed_intents = [];
                for(var i = 0; i < data.changed_intents.length; i++) changed_intents.push(data.changed_intents[i]);
                Swal.fire({
                    title: "Meal intent registered",
                    text: data.changed_intents.length + " intent(s) changed",
                    icon: "success",
                    confirmButtonText: "Ok",
                    // another swal button to see changed intents
                    footer: '<a href="#" onclick="show_changed_intents()">See changed intents</a>'
                });
            } else {
                Swal.fire({
                    title: "Meal intent registered",
                    icon: "success",
                    confirmButtonText: "Ok",
                    button: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
            $(".menu-item" + "#" + id).addClass("selected");
        },
        error: function (data) {
            Swal.fire({
                title: "An error has occurred while registering intent",
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    });
}

function show_changed_intents(){
    var intents = changed_intents[0];
    Swal.fire({
        title: "Changed intents",
        html: "<h>The following intents were removed:</h><br><br><div class='menu-item-modal' style='text-align: left;'><p1 class='weekday'>" + WEEKDAY[parseInt(intents[5]) - 1] + "</p1><br><h class='meal_name'>" + intents[1] + "</h><p class='meal_description'>" + intents[2] + "</p></div>",
        icon: "info",
        confirmButtonText: "Ok"
    });
}

// Function to delete meal intent
// This function consists in a DELETE request to the server
// The server will delete the intent in the database
// If the request is successful, the UI will be updated
// If the request fails, the user will be notified
function delete_meal_intent(id){
    $.ajax({ // Make DELETE request to the server to delete the intent
        url: "/intent",
        type: "DELETE",
        data: {
            meal_id: id
        },
        success: function (data) {
            Swal.fire({
                title: "Meal intent deleted",
                icon: "success",
                confirmButtonText: "Ok",
                button: false,
                timer: 2000,
                timerProgressBar: true,
            })
            $(".menu-item" + "#" + id).removeClass("selected");
        },
        error: function (data) {
            Swal.fire({
                title: "An error has occurred while deleting intent",
                icon: "error",
                confirmButtonText: "Ok"
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

    Swal.fire({
        title:  "Edit meal details",
        text: "Insert the new meal name",
        // input with the current meal name
        input: "text",
        inputValue: $(".menu-item" + "#" + id + " h").text(),
        showCancelButton: true,
        confirmButtonText: "Next",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
            if(isBlank(name)){
                Swal.showValidationMessage("Please insert a meal name");
            }
        }
    }).then((result) => {
        if(result.isConfirmed){
            Swal.fire({
                title:  "Edit meal details",
                text: "Insert the new meal description",
                // input with the current meal description
                input: "text",
                inputValue: $(".menu-item" + "#" + id + " p").text(),
                showCancelButton: true,
                confirmButtonText: "Next",
                cancelButtonText: "Cancel",
                showLoaderOnConfirm: true,
                preConfirm: (description) => {
                    if(isBlank(description)){
                        Swal.showValidationMessage("Please insert a meal description");
                    }
                }
            }).then((result1) => {
                if(result1.isConfirmed){
                    Swal.fire({
                        // confirm modal with information about the meal
                        title: "Confirm meal details",
                        text: "The meal details will be changed to:",
                        html: "<h3>" + result.value + "</h3><p>" + result1.value + "</p>",
                        showCancelButton: true,
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        showLoaderOnConfirm: true,
                        preConfirm: () => {
                            // 1s delay before the request is sent
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve()
                                }, 600)
                            })
                        }
                    }).then((result2) => {
                        if(result2.isConfirmed){
                            $.ajax({ // Make PUT request to the server to edit the meal
                                url: "/menu",
                                type: "POST",
                                data: {
                                    menu_id: id,
                                    new_title: result.value,
                                    new_description: result1.value
                                },
                                success: function (data) {
                                    Swal.fire({
                                        title: "Meal edited",
                                        icon: "success",
                                        confirmButtonText: "Ok",
                                        button: false,
                                        timer: 2000,
                                        timerProgressBar: true,
                                    })
                                    // Update the UI
                                    $(".menu-item" + "#" + id + " h").text(result.value);
                                    $(".menu-item" + "#" + id + " p").text(result1.value);
                                    get_user_intents();
                                },
                                error: function (data) {
                                    Swal.fire({
                                        title: "An error has occurred while editing the meal",
                                        icon: "error",
                                        confirmButtonText: "Ok"
                                    });
                                }
                            });
                        }
                    })
                }
            })
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