var clock;

var timeUnits = [
    "сек.",
    "мин.",
    "ч.",
    "дн.",
    "нед."
];

function argToTime(count, num, check) {
    if (check === undefined) {
        check = true;
    }
    if (!check || count > 0) {
        return count + " " + timeUnits[num] + " ";
    }
    return "";
}

function argsToTime(rawSeconds) {
    var DAY  = 24 * 60 * 60;
    var days = Math.floor(rawSeconds / DAY);
    var date = new Date(0, 0, 0, 0, 0, rawSeconds);

    var res =
        argToTime(Math.floor(days / 7), 4) +
        argToTime(days % 7, 3) +
        argToTime(date.getHours()  , 2) +
        argToTime(date.getMinutes(), 1, false) +
        argToTime(date.getSeconds(), 0, false);

    return res;
}

function appendToClock(seconds) {
    var date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    var info = clock.innerHTML;
    if (seconds > 0) {
        info += "<p>ОКОНЧАНИЕ: " + date.toLocaleString() + "</p>";
        info += "<p>ОСТАЛОСЬ:  " + argsToTime(seconds)   + "</p>";
        clock.innerHTML = info;
    }
}

var oldValue = undefined;

function update() {
    if (oldValue != clock.innerHTML) {
        var arr = clock.innerHTML.match(/\d+/g);
        if (arr.length === 4) {
            appendToClock(
                parseInt(arr[2]) * 60 + parseInt(arr[3]) -
                parseInt(arr[0]) * 60 - parseInt(arr[1])
            );
        }
        oldValue = clock.innerHTML;
    }
}

var observer = new MutationObserver(update);

function enableObserver() {
    clock = document.getElementById("running-clock");

    if (clock != undefined) {
        observer.observe(clock, {
            childList: true
        });
        update();
    }
}

function disableObserver() {
    observer.disconnect();
}

chrome.storage.local.get('isRunning', function(result) {
    if (result.isRunning) {
        enableObserver();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.isRunning == undefined) {
        return;
    }
    if (request.isRunning) {
        enableObserver();
    } else {
        disableObserver();
    }
});
