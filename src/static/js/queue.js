$(document).ready(function () {
    updateQueueCounters();
    setInterval(function () {
        updateQueueCounters();
    }, 10000) // Update the queue counters every 10 seconds

    // Handler for the change state button
    // that allows the admin to change the state of a queue
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

    // Handler for the increase button
    // that allows the admin to increase the counter of a queue
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
    
    // Handler for the decrease button
    // that allows the admin to decrease the counter of a queue
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

    // Handler for the refresh button
    $("#refreshBtn").click(function(){
        updateQueueCounters();
    });

});

// Function that updates the queue counters
function updateQueueCounters(){
    $.ajax({
        url: '/queue/all',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            for(i = 0; i < data.queues.length; i++){ // For each queue
                var queue = data.queues[i];
                $('#' + queue.name.toLowerCase() + " .count").text(queue.counter); // Update the counter
                $('#' + queue.name.toLowerCase() + " .queue-type").text(queue.name); // Update the queue type
                updateWaitTime( queue.name.toLowerCase(), queue.wait_time);
                if(queue.enabled){ // Update the state of the queue
                    $('#' + queue.name.toLowerCase()).removeClass("cancelled");
                } else {
                    $('#' + queue.name.toLowerCase()).addClass("cancelled");
                }	
            }
        }
    });
}

function updateWaitTime(queue_name, wait_time){
    setTimeout(function(){
        $('#' + queue_name + " .wait_time").text("ETA: " + wait_time);
    }, 1000);
}