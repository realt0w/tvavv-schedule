const schedule = [
    { time: '7:45', activity: 'Lever des jeunes' },
    { time: '8:00', activity: 'Déjeuner' },
    { time: '8:30', activity: 'Retour en chambre' },
    { time: '8:45', activity: 'Quoi de neuf?' },
    { time: '9:00', activity: 'Bloc 1' },
    { time: '10:30', activity: 'Temps Libre' },
    { time: '10:45', activity: 'Bloc 2' },
    { time: '12:00', activity: 'Diner' },
    { time: '12:30', activity: 'Temp calme' },
    { time: '13:30', activity: 'Bloc 3' },
    { time: '15:00', activity: 'Temps libre' },
    { time: '15:30', activity: 'Activité' },
    { time: '17:00', activity: 'Douches' },
    { time: '18:00', activity: 'Souper & temps libre' },
    { time: '19:30', activity: 'Activité' },
    { time: '21:15', activity: 'Temps libre + cantine' },
    { time: '22:00', activity: 'Retour en chambre' },
    { time: '22:15', activity: 'Extinction des feux' }
];

let betterschedule = [];

schedule.forEach(function (item, index, array) {
    const [hour, minute] = item.time.split(':').map(Number);
    let minutes = timeToMinutes(hour, minute);

    let newvalue = { activity: item.activity, startTime: item.time };

    newvalue.startMinutes = minutes;

    const nextItem = array[(index + 1) % array.length]

    const nextMinutes = timeStringToMinutes(nextItem.time);

    newvalue.endMinutes = nextMinutes;

    newvalue.endTime = nextItem.time;

    betterschedule.push(newvalue);
})

function timeStringToMinutes(timestr) {
    const [hour, minute] = timestr.split(':').map(Number);
    return timeToMinutes(hour, minute);
}

function minutesToTimeString(minutes) {
    const hour = minutes / 60;
    const minute = minutes % 60;

    const hourStr = String(hour).padStart(2, '0')
    const minuteStr = String(minute).padStart(2, '0')

    return hourStr + ":" + minuteStr;
}

function createTable() {
    const tbody = document.querySelector('#schedule-table tbody');
    schedule.forEach((item, index) => {
        const [hour, minute] = item.time.split(':').map(Number);
        const row = document.createElement('tr');
        row.setAttribute('hour', hour);
        row.setAttribute('minute', minute);
        row.classList.add('activity');

        const hourStr = String(hour).padStart(2, '0'); // zorgt ervoor dat uur 5 -> 05
        const minuteStr = String(minute).padStart(2, '0'); // zorgt ervoor dat minuut 2 -> 02

        const timeCell = document.createElement('td');
        timeCell.classList.add("cell")
        timeCell.classList.add("cell-time")
        timeCell.innerHTML = `<span class="hour">${hourStr}</span>:<span class="minute">${minuteStr}</span>`;
        row.appendChild(timeCell);

        const activityCell = document.createElement('td');
        activityCell.classList.add("cell")
        activityCell.classList.add("cell-activity")
        activityCell.textContent = item.activity;
        row.appendChild(activityCell);

        tbody.appendChild(row);
    });
}

function timeToMinutes(hour, minute) {
    return hour * 60 + minute;
}

function highlightCurrentTime() {
    const now = new Date();
    const currentMinutes = timeToMinutes(now.getHours(), now.getMinutes());
    const rows = document.querySelectorAll('tbody tr');

    let highlighted = false;

    rows.forEach((row, index) => {
        const rowHour = parseInt(row.getAttribute('hour'));
        const rowMinute = parseInt(row.getAttribute('minute'));
        const rowMinutes = timeToMinutes(rowHour, rowMinute);

        let nextRowMinutes = Infinity;
        if (index < rows.length - 1) {
            const nextRowHour = parseInt(rows[index + 1].getAttribute('hour'));
            const nextRowMinute = parseInt(rows[index + 1].getAttribute('minute'));
            nextRowMinutes = timeToMinutes(nextRowHour, nextRowMinute);
        }

        if (currentMinutes >= rowMinutes && currentMinutes < nextRowMinutes) {
            row.classList.add('current-activity');
            highlighted = true;
        } else {
            row.classList.remove('current-activity');
        }
    });

    // If no row is highlighted and the time is after the last schedule item
    if (!highlighted) {
        const lastRow = rows[rows.length - 1];
        lastRow.classList.add('current-activity');
    }
}

function updateCurrentTime() {
    const now = new Date()
    const currentMinutes = timeToMinutes(now.getHours(), now.getMinutes())
    const currentTimeText = String(now.getHours()).padStart(2, '0') + ":" + String(now.getMinutes()).padStart(2, '0') + ":" + String(now.getSeconds()).padStart(2, '0');

    document.querySelector('#currentTime').innerHTML = currentTimeText;

    betterschedule.forEach(function (item, index, array) {
        if (currentMinutes <= item.endMinutes && currentMinutes >= item.startMinutes) {
            // this is the current item

            document.querySelector("#currentActivity").innerHTML = item.activity;
            document.querySelector("#currentActivityFrom").innerHTML = item.startTime;
            document.querySelector("#currentActivityTo").innerHTML = item.endTime;
        }

    })
}

// Generate the table on page load
createTable();

// Highlight current time on page load
highlightCurrentTime();

// Check every minute
setInterval(highlightCurrentTime, 60000);
setInterval(updateCurrentTime, 1000);
updateCurrentTime();
