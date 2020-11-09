const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
ipcRenderer.on('cpu',(event,data) => {
  console.log('cpu % ' + data);
});
ipcRenderer.on('mem',(event,data) => {
  console.log('mem % ' + data);
});
ipcRenderer.on('total-mem',(event,data) => {
  console.log('total mem GB ' + data);
});