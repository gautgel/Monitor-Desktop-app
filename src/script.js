const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

var i = 0;
var cpuValues = [];
var labels = [];

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: '# Utilisation Cpu',
            data: cpuValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: { 
        legend: {
            display: false,
        },
        maintainAspectRatio : false,
        scales: {
            xAxes:[{
                gridLines: {
                    display:false
                }   
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },   
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

ipcRenderer.on('mem',(event,data) => {
    document.getElementById('mem').innerHTML = data.toFixed(2);
});
ipcRenderer.on('total-mem',(event,data) => {
    document.getElementById('total-mem').innerHTML = data.toFixed(2);
});

ipcRenderer.on('free-mem',(event,data) => {
    document.getElementById('free-mem').innerHTML = data.toFixed(2);
});

ipcRenderer.on('cpu',(event,data) => {
    document.querySelector('.span_cpu').innerHTML = data.toFixed(2);
    cpuValues.push(data.toFixed(2));
    labels.push (i++);

    if ( labels.length >= 20 ) {
        labels = labels.slice(Math.max(labels.length - 20, 1))
        myChart.data.labels = labels;
    }

    if ( cpuValues.length >= 20 ) {
        cpuValues = cpuValues.slice(Math.max(labels.length - 20, 1))
        myChart.data.datasets[0].data = cpuValues
    }

    myChart.update();
});

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const closeButton = document.getElementById('close-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

restartButton.addEventListener("click", ()=>{
    restartApp();
});
closeButton.addEventListener("click", ()=>{
    closeNotification();
})