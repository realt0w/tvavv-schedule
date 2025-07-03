// --- LOGIQUE D'AFFICHAGE DE L'HORAIRE ---

const schedule = [
    { time: '07:45', activity: 'Réveil' }, 
    { time: '08:00', activity: 'Déjeuner' },
    { time: '08:30', activity: 'Retour en chambre - Brossage de dents' }, 
    { time: '08:45', activity: 'Quoi de neuf ?' },
    { time: '09:00', activity: 'Bloc 1' }, 
    { time: '10:30', activity: 'Temps libre' },
    { time: '10:45', activity: 'Bloc 2' }, 
    { time: '11:45', activity: 'Temps libre' },
    { time: '12:00', activity: 'Diner' }, 
    { time: '12:30', activity: 'Temps calme' },
    { time: '13:30', activity: 'Bloc 3' }, 
    { time: '15:00', activity: 'Temps libre' },
    { time: '15:30', activity: 'Activité' }, 
    { time: '17:00', activity: 'Douches + Temps libre' },
    { time: '18:00', activity: 'Souper' },
    { time: '18:30', activity: 'Douches + Temps libre' },
    { time: '19:30', activity: 'Activité du soir' },
    { time: '21:15', activity: 'Temps libre + Cantine' },
    { time: '22:00', activity: 'Retour en chambre' },
    { time: '22:15', activity: 'Au lit ! (Extinction des feux)' }
];
let processedSchedule = [];

function timeStringToMinutes(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    return hour * 60 + minute;
}

function processSchedule() {
    processedSchedule = schedule.map((item, index, array) => {
        const endTime = (index < array.length - 1) ? array[index + 1].time : array[0].time;
        return { ...item, startTime: item.time, endTime: endTime };
    });
}

function createTable() {
    const tbody = document.querySelector('#schedule-table tbody');
    tbody.innerHTML = '';
    schedule.forEach(item => {
        const row = document.createElement('tr');
        row.setAttribute('data-time', item.time);
        const timeCell = document.createElement('td');
        timeCell.classList.add("cell", "cell-time");
        timeCell.textContent = item.time;
        row.appendChild(timeCell);
        const activityCell = document.createElement('td');
        activityCell.classList.add("cell", "cell-activity");
        activityCell.textContent = item.activity;
        row.appendChild(activityCell);
        tbody.appendChild(row);
    });
}

function updateDisplay() {
    const now = new Date();
    document.querySelector('#currentTime').innerHTML = now.toLocaleTimeString('fr-FR');
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let currentActivity = null;

    for (const item of processedSchedule) {
        const startMinutes = timeStringToMinutes(item.startTime);
        const endMinutes = timeStringToMinutes(item.endTime);
        if (startMinutes > endMinutes) {
            if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
                currentActivity = item;
                break;
            }
        } else {
            if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                currentActivity = item;
                break;
            }
        }
    }
    
    if (currentActivity) {
        document.querySelector("#currentActivity").innerHTML = currentActivity.activity;
        document.querySelector("#currentActivityFrom").innerHTML = currentActivity.startTime;
        document.querySelector("#currentActivityTo").innerHTML = currentActivity.endTime;
        document.querySelectorAll('#schedule-table tbody tr').forEach(row => {
            row.classList.toggle('current-activity', row.getAttribute('data-time') === currentActivity.startTime);
        });
    } else {
         document.querySelector("#currentActivity").innerHTML = "Temps libre / Nuit";
    }
}

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', () => {
    processSchedule();
    createTable();
    updateDisplay();
    setInterval(updateDisplay, 1000);
});