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


// bring in storage.js - V3 manifest change as only 1 service worker script allowed
try {
	importScripts("storage.js");
} catch (e) {
	console.log(e);
}


//runs when addin installed
chrome.runtime.onInstalled.addListener(
	function () {
		console.log("Chrome ext: ->  extension started");
		saveToStorage("isTurnedOn", false);//turn on on oninstall
		clearStorageArrays();
	}
);

chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		if (message.type == "captureElementObject" || message.type == "captureSnapshot") {
			//get the screenshot
			chrome.tabs.captureVisibleTab((screenshotUrl) => {
				var elementObject = message.elementObject;
				//add it to our object
				elementObject.screenshot = screenshotUrl;
				//store it for later
				appendStorageArrayWithNewVal("elementObject", elementObject);
			});
			//sendResponse({ text: 'Content Captured' });
		}

		if (message.type == "TurnOn") {
			saveToStorage("isTurnedOn", true);
			chrome.action.setIcon({ path: "icon1_rec.png" });
		}
		if (message.type == "TurnOff") {
			saveToStorage("isTurnedOn", false);
			chrome.action.setIcon({ path: "icon1.png" });
		}
		return true;
	}
);


chrome.commands.onCommand.addListener((command) => {

	if (command == "shortcut_screenshot") {

		console.log(`Command "${command}" called`);

		//This works - but doesn't capture perf timings... perf timngs come from the page...
		// chrome.tabs.captureVisibleTab((screenshotUrl) => {
		// 	let elementObject = { type: "Current state capture", body: "Current state capture", identifiers: "" };
		// 	elementObject.screenshot = screenshotUrl;
		// 	appendStorageArrayWithNewVal("elementObject", elementObject);
		// });

		//this sends a message to the content.js which then does the rest of the path.
		chrome.tabs.query({ active: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { type: "getPageInfo", body: "Current state capture", identifiers: "" }, function (response) {
					 //nothing here
				 });
		});
	}
});





// Opted not to capture URL navigations
//on updated - get the new url
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// 	if (changeInfo.status == 'complete') {
// 		console.log("going to a new url: " + changeInfo.url);
// 	}
// });

//get a new tab was created - and it's destination
// chrome.tabs.onCreated.addListener(function (tab) {
// 	console.log("new tab created: " + tab.pendingUrl);
// });

// chrome.tabs.onRemoved.addListener(function (tabId, changeInfo, tab) {
// 	console.log("Close Tab:: " + tab.url);
// });