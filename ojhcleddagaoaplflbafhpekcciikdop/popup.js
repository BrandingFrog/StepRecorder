// Copyright (C) 2021 - Shift Left Group Limited
// Author - Richard Edwards

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

try {
	importScripts("process.js");
} catch (e) {
	console.log(e);
}



let NewTab = document.getElementById('NewTab');
NewTab.onclick = function ShowInNewWindow() {
    const viewTabUrl = chrome.runtime.getURL('results.html')
    let targetId = null;

    chrome.tabs.create({ url: viewTabUrl }, (tab) => {
        targetId = tab.id;
        
       // tab.runMain(); // from process
    });
}

let clearSteps = document.getElementById('clearSteps');
clearSteps.onclick = function clearStorage() {
    clearStorageArrays();
    runMain(); // from process
};


let CaptureNow = document.getElementById('CaptureNow');
CaptureNow.onclick = function RunCaptureNow() {
    chrome.tabs.query({ active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getPageInfo", body: "Current state capture", identifiers: "" }, function (response) {
                 alert(response.text);
                 //runMain();
             });
    });
};

let StartStop = document.getElementById('StartStop');
StartStop.onclick = function ToggleStartStop() {

    if (StartStop.checked) {
        chrome.runtime.sendMessage({ type: "TurnOn" });
    }
    if (!(StartStop.checked)) {
        chrome.runtime.sendMessage({ type: "TurnOff" });
    }
}

window.onload = function setStorageValue() {
    GetFromStorage("isTurnedOn").then(function (isOn) {
        if (isOn) {
            StartStop.checked = true;
        }
        else {
            StartStop.checked = false;
        }
    });

}


