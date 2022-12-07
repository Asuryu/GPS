$(document).ready(function () {
    tippy('[data-tippy-content]');
    get_user_intents();
    $("#type").change(function () {
        var type = $(this).val();
        if (type == 1) type = "Peixe";
        else if (type == 2) type = "Carne";
        else if (type == 3) type = "Vegetariano";

        $.ajax({
            url: "/menu?type=" + type,
            type: "GET",
            success: function (data) {
                $(".menu-wrap").empty();
                console.log(data);
                for (var i = 0; i < data.menu.length; i++) {
                    var item = data.menu[i];
                    if(item[3] == "Almoço"){
                        $("#menu .menu-wrap#almoco").append(
                            "<div id='" + item[0] + "' class='menu-item' data-tippy-content='Click to change meal intent'>" +
                                "<h>" + item[1] + "</h>" + 
                                "<p>" + item[2] + "</p>" + 
                            "</div>"
                        )
                    }
                    else if(item[3] == "Jantar"){
                        $("#menu .menu-wrap#jantar").append(
                            "<div id='" + item[0] + "' class='menu-item' data-tippy-content='Click to change meal intent'>" +
                                "<h>" + item[1] + "</h>" + 
                                "<p>" + item[2] + "</p>" + 
                            "</div>"
                        )
                    }
                }
                tippy('[data-tippy-content]');
                get_user_intents();
                $(".menu-item").on("click", function () {
                    var id = $(this).attr("id");
                    if($(this).hasClass("selected")) delete_meal_intent(id);
                    else register_meal_intent(id);
                });
            }
        });
    });

    $(".menu-item").on("click", function () {
        var id = $(this).attr("id");
        if($(this).hasClass("selected")) delete_meal_intent(id);
        else register_meal_intent(id);
    });
});

function register_meal_intent(id){
    swal({
        title: "Tem a certeza?",
        text: "A sua intenção será registada",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: "/intent",
                type: "POST",
                data: {
                    meal_id: id
                },
                success: function (data) {
                    swal("Meal intent registered", {
                        icon: "success",
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

function delete_meal_intent(id){
    swal({
        title: "Tem a certeza?",
        text: "A sua intenção será removida",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: "/intent",
                type: "DELETE",
                data: {
                    meal_id: id
                },
                success: function (data) {
                    swal("Meal intent deleted", {
                        icon: "success",
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

function get_user_intents(){
    $.ajax({
        url: "/intent",
        type: "GET",
        success: function (data) {
            console.log(data);
            for (var i = 0; i < data.intents.length; i++) {
                var intent = data.intents[i];
                $(".menu-item" + "#" + intent).addClass("selected");
            }
        }
    });
}