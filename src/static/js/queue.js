$(document).ready(function () {
    updateQueueCounters();
    setInterval(function () {
        updateQueueCounters();
    }, 10000)

    $(".changeStateBtn").click(function(){
        var queueName = $(this).parent().attr("id");
        $.ajax({
            url: '/queue/' + queueName,
            type: 'PATCH',
            success: function (data) {
                updateQueueCounters();
            }
        });
    });

    $(".increaseBtn").click(function(){
        var queueName = $(this).parent().attr("id");
        $.ajax({
            url: '/queue/' + queueName,
            type: 'POST',
            success: function (data) {
                updateQueueCounters();
            }
        });
    });

    $(".decreaseBtn").click(function(){
        var queueName = $(this).parent().attr("id");
        $.ajax({
            url: '/queue/' + queueName,
            type: 'DELETE',
            success: function (data) {
                updateQueueCounters();
            }
        });
    });

    $("#refreshBtn").click(function(){
        updateQueueCounters();
    });

});


function updateQueueCounters(){
    $.ajax({
        url: '/queue/all',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            for(i = 0; i < data.queues.length; i++){
                var queue = data.queues[i];
                $('#' + queue.name.toLowerCase() + " .count").text(queue.counter);
                $('#' + queue.name.toLowerCase() + " .queue-type").text(queue.name);
                if(queue.enabled){
                    $('#' + queue.name.toLowerCase()).removeClass("cancelled");
                } else {
                    $('#' + queue.name.toLowerCase()).addClass("cancelled");
                }	
            }
        }
    });
}
