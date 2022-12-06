$(document).ready(function () {
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
            }
        });
    });
});
