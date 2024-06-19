// console.log('EXTENSION', 'popup');
//
// const detecter = function () {
//     console.log(`[E2E HELPER] detecter`);
//     chrome.tabs.executeScript(null, {
//         file: '/src/scripts/e2e-searcher.js'
//     });
// };
//
// const clearAll = function () {
//     console.log(`[E2E HELPER] clearAll`)
//     chrome.tabs.executeScript(null, {
//         file: '/src/scripts/e2e-cleaner.js'
//     });
// };
//
//
// document.addEventListener('DOMContentLoaded', function () {
//     window.onload = function () {
//         let detectElem = document.getElementById('detect');
//         detectElem.addEventListener('click', detecter);
//
//         let clearAllElem = document.getElementById('clearAll');
//         clearAllElem.addEventListener('click', clearAll);
//
//     };
// });
