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

setUpHooks();

var observer = new MutationObserver(function (mutations) {
	setUpHooks();
});

// configuration of the observer:
var config = { 
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
};
observer.observe(document.body, config);

function newProcessEvent(event) {
	//everything we want to store from 	the event
	let EventObject = {};
	EventObject.type = event.type;
	EventObject.tagName = event.currentTarget.tagName
	EventObject.textContent = event.currentTarget.textContent;
	EventObject.value = event.currentTarget.value;
	EventObject.id = event.currentTarget.id;
	EventObject.alt = event.currentTarget.alt;
	EventObject.name = event.currentTarget.name;
	EventObject.title = event.currentTarget.title;
	EventObject.className = event.currentTarget.className;
	EventObject.timingsObject = performance.getEntriesByType('navigation')[0];
	EventObject.tabUrl = document.URL;
	EventObject.tabTitle = document.title;

	//go deeper into a nested image.
	nestedImage = event.currentTarget.getElementsByTagName("img")[0];
	if (nestedImage != undefined) {
		EventObject.NestedImage_title = nestedImage.title;
		EventObject.NestedImage_alt = nestedImage.alt;
	}
	else {
		EventObject.NestedImage_title = "";
		EventObject.NestedImage_alt = "";
	}
	//if it's a password - remove some key giblets
	if (event.currentTarget.type == "password") {
		EventObject.textContent = "[[password values not recorded]]";
		EventObject.value = "[[password values not recorded]]";
	}

	chrome.runtime.sendMessage({ type: "captureElementObject", elementObject: EventObject });
}

function setUpHooks() {
	GetFromStorage("isTurnedOn").then(function (isOn) {
		if (isOn) {
			//configured for most web pages
			//clickable items
			configureListener('click', 'a');
			configureListener('click', 'button');
			configureListener('click', 'input');

			//change items
			configureListener('change', 'input');
			configureListener('change', 'select');
		}
	});
}
function configureListener(listenerType, tag) {
	for (i = 0; i < document.getElementsByTagName(tag).length; i++) {
		//remove first to prevent duplicate
		document.getElementsByTagName(tag)[i].removeEventListener(listenerType, newProcessEvent);
		document.getElementsByTagName(tag)[i].addEventListener(listenerType, newProcessEvent);
	}
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if(message.type == "getPageInfo")
	{
		let EventObject = {};
		EventObject.tabUrl = document.URL;
		EventObject.tabTitle = document.title;
		EventObject.timingsObject = performance.getEntriesByType('navigation')[0];
		EventObject.type = message.body;
		chrome.runtime.sendMessage({ type: "captureSnapshot", elementObject: EventObject });

		sendResponse({ text: 'Content Captured' });
	}
	return true;
});
