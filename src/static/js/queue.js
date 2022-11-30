$(document).ready(function () {
    updateQueueCounters();
    setInterval(function () {
        updateQueueCounters();
    }, 10000)
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