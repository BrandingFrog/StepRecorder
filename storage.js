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

function GetFromStorage(key)
{
    return new Promise(function (resolve, reject) {
		chrome.storage.local.get([key], function (data) {
			if(Array.isArray(data[key])){
				//console.log('Storage debug :: Read array :: ' + key + ' :: size: ' + data[key].length);
			}
			resolve(data[key]);
		});
	});
}

function saveToStorage(key, val) {
	chrome.storage.local.set({ [key] : val }, function () {
		if(Array.isArray(val)){
			//console.log('Storage debug :: Save array :: ' + key + ' :: save size: ' + val.length);
		}
	});
}

//helper to append to a storage value
function appendStorageArray(key, val) {
	GetFromStorage(key).then(function (existingVal) {
		if(Array.isArray(existingVal)){
			//append with concat and save
			newarr = existingVal.concat(val);
			saveToStorage(key, newarr);
		}
		else {
			//just save the array neat
			saveToStorage(key, val);
		}
	});
}

//helper to move a string to array and store it
function appendStorageArrayWithNewVal(key,val)
{
	var arr = [];
	arr.push(val);
	appendStorageArray(key, arr);
}

function clearStorageArrays(){
	var empty = [];
	saveToStorage("actions", empty);
	saveToStorage("identifiers", empty);
	saveToStorage("urls", empty);
	saveToStorage("titles", empty);
	saveToStorage("screenshot", empty);
	saveToStorage("elementObject", empty);
}