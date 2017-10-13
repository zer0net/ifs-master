app.filter('timeFilter', function() {
    return function(millseconds) {
        var oneSecond = 1000;
        var oneMinute = oneSecond * 60;
        var oneHour = oneMinute * 60;
        var oneDay = oneHour * 24;

        var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
        var minutes = Math.floor((millseconds % oneHour) / oneMinute);
        var hours = Math.floor((millseconds % oneDay) / oneHour);
        var days = Math.floor(millseconds / oneDay);

        var timeString = '';
        if (days !== 0) {
            timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
        }
        if (hours !== 0) {
            timeString += (hours !== 1) ? (hours + ':') : (hours + ':');
        }
        if (minutes !== 0) {
            if (minutes < 10){
                timeString += '0';
            }
            timeString += (minutes !== 1) ? (minutes + ':') : (minutes + ':');
        } else if (minutes === 0){
            timeString += '00:'
        }
        if (seconds !== 0 || millseconds < 1000) {
            if (seconds < 10){
                timeString += '0';
            }
            timeString += (seconds !== 1) ? (seconds + '') : (seconds + '');
        } else {
            timeString += '00';
        }

        return timeString;
    };
});