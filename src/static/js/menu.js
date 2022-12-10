$(document).ready(function () {

    var admin = role == "admin" ? true : false;

    if(admin){
        tippy(".menu-item", {
            // two tipps, one saying that you can change the intent, and another saying that you can edit the meal
            content: "Click to change meal intent<br>Right click to edit meal",
            allowHTML: true,
        });
    } else {
        tippy(".menu-item", {
            content: "Click to change meal intent",
            allowHTML: true,
        });
    }

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
                for (var i = 0; i < data.menu.length; i++) {
                    var item = data.menu[i];
                    if(item[3] == "Almoço"){
                        $("#menu .menu-wrap#almoco").append(
                            "<div id='" + item[0] + "' class='menu-item'>" +
                                "<h>" + item[1] + "</h>" + 
                                "<p>" + item[2] + "</p>" + 
                            "</div>"
                        )
                    }
                    else if(item[3] == "Jantar"){
                        $("#menu .menu-wrap#jantar").append(
                            "<div id='" + item[0] + "' class='menu-item'>" +
                                "<h>" + item[1] + "</h>" + 
                                "<p>" + item[2] + "</p>" + 
                            "</div>"
                        )
                    }
                }
            
                if(admin){
                    tippy(".menu-item", {
                        // two tipps, one saying that you can change the intent, and another saying that you can edit the meal
                        content: "Click to change meal intent<br>Right click to edit meal",
                        allowHTML: true,
                    });
                } else {
                    tippy(".menu-item", {
                        content: "Click to change meal intent",
                        allowHTML: true,
                    });
                }

                get_user_intents();
                $(".menu-item").on("click", function () {
                    var id = $(this).attr("id");
                    if($(this).hasClass("selected")) delete_meal_intent(id);
                    else register_meal_intent(id);
                });

                $(".menu-item").on("contextmenu", function (e) {
                    if(admin){
                        e.preventDefault();
                        var id = $(this).attr("id");
                        edit_meal(id)
                    }
                })
            }
        });
    });

    $(".menu-item").on("click", function () {
        var id = $(this).attr("id");
        if($(this).hasClass("selected")) delete_meal_intent(id);
        else register_meal_intent(id);
    });

    $(".menu-item").on("contextmenu", function (e) {
        if(admin){
            e.preventDefault();
            var id = $(this).attr("id");
            edit_meal(id)
        }
    })
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

function edit_meal(id){

    //create swal with 2 parts
    swal({
        title: "Editar refeição",
        text: "Insira o nome da refeição",
        input: "text",
        content: {
            element: "input",
            attributes: {
                placeholder: "Nome da refeição",
                type: "text",
                value: $(".menu-item" + "#" + id + " h").text(),
            },
        },
        buttons: {
            cancel: "Cancelar",
            confirm: {
                text: "Confirmar",
                value: null,
                visible: true,
                closeModal: true,
            }
        }
    }).then((value) => {
        // check if string is empty
        if(value == "") value = $(".menu-item" + "#" + id + " h").text();
        if(value == null) return;
        if(isBlank(value)){
            swal({
                // error
                title: "Erro",
                text: "O nome não pode estar vazio",
                icon: "error"
            })
        }
        if(!isBlank(value)){
            swal({
                title: "Editar refeição",
                text: "Insira a descrição da refeição",
                input: "text",
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Descrição da refeição",
                        type: "text",
                        value: $(".menu-item" + "#" + id + " p").text(),
                    },
                },
                buttons: {
                    cancel: "Cancelar",
                    confirm: {
                        text: "Confirmar",
                        value: null,
                        visible: true,
                        closeModal: true,
                    }
                }
            }).then((value2) => {
                if(value2 == "") value2 = $(".menu-item" + "#" + id + " p").text();
                if(value2 == null) return;
                if(isBlank(value2)){
                    swal({
                        // error
                        title: "Erro",
                        text: "A descrição não pode estar vazia",
                        icon: "error"
                    })
                }
                if(!isBlank(value2)){
                    swal({
                        title: "Tem a certeza?",
                        text: "Os dados da refeição serão alterados",
                        content: {
                            element: "div",
                            attributes: {
                                innerHTML: "<h3 style='color: #1F1F1F'>Título: " + value + "</h3><p style='color: #1F1F1F'>Descrição: " + value2 + "</p>"
                            }
                        },
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                        closeModal: false
                    }).then((willEdit) => {
                        if (willEdit) {
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

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}