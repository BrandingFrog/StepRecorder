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

//show Results
let ShowResults = document.getElementById('ShowResults');
ShowResults.onclick = function (element) {
    runMain();
};

//buffer the infromation to save reloading.
var elementObjects = [];
function runMain() {
    GetFromStorage("elementObject").then(function (value) {
        elementObjects = value;
        WriteElementObjectToTable();
    });
}

function AddEmptyTextFieldForRow(row, elementObject)
{
    

    var textAreaHtml = "";
    textAreaHtml += "<br><br>";
    textAreaHtml += "<div class='annotation'>";
    textAreaHtml += "<textarea"; 
    textAreaHtml += " rowNum='"+row+"'";
    textAreaHtml += " class='annotation'";
    textAreaHtml += " rows='4'";
    textAreaHtml += " placeholder='User Annotation...\nTry #bug, #question or #idea to add colour'";
    if(elementObject.AnnotationType != undefined){
        textAreaHtml += " annotationType='"+elementObject.AnnotationType+"'";     
    }
    textAreaHtml += " >";
    
    //add the text if it exists
    if(elementObject.Annotation != undefined){
        textAreaHtml += elementObject.Annotation;
    }

    textAreaHtml += "</textarea>";
    
    // textAreaHtml += "<br>";
    // textAreaHtml += "<button";
    // textAreaHtml += " class='SaveNote'";
    // textAreaHtml += " rownum='"+row+"'"
    // textAreaHtml += ">Save</button><br class='savePadding'>";
    // textAreaHtml +="</div>";
    return textAreaHtml;
}

function AddListenersToAnnotationTextAreas()
{
    for (i = 0; i < document.getElementsByTagName('textarea').length; i++) {
            document.getElementsByTagName('textarea')[i].removeEventListener('input', AnnotationSaveEvent);
            document.getElementsByTagName('textarea')[i].addEventListener('input', AnnotationSaveEvent);
    }
}


function AnnotationSaveEvent(event)
{
    var rownum = event.currentTarget.getAttribute('rownum');
    elementObjects[rownum].Annotation = document.getElementsByTagName('textarea')[rownum].value;

    
    areaContent = document.getElementsByTagName('textarea')[rownum].value
    if (areaContent.toLowerCase().includes("#bug")){
        elementObjects[rownum].AnnotationType = "bug";
    }
    else if (areaContent.toLowerCase().includes("#question")){
        elementObjects[rownum].AnnotationType = "question";
    }
    else if (areaContent.toLowerCase().includes("#idea")){
        elementObjects[rownum].AnnotationType = "idea";
    }
    else{
        elementObjects[rownum].AnnotationType = "note";
    }

    //resave the whole item with the new value
    saveToStorage("elementObject", elementObjects);
    SetStyleForTextArea (document.getElementsByTagName('textarea')[rownum], elementObjects[rownum].AnnotationType)
}

function SetStyleForAllTextAreas()
{
    for (i = 0; i < document.getElementsByTagName('textarea').length; i++) {
            var el = document.getElementsByTagName('textarea')[i]
            SetStyleForTextArea (el, el.getAttribute("annotationType") );
    }
}

function SetStyleForTextArea(element, type){
    var defaultBackground ='white';
    var defaultFontColour ='navy';
        
    switch(type) {
        case "bug":
            element.style.backgroundColor='red';
            element.style.color='white'; 
            break;
        case "question":
            element.style.backgroundColor='blue';
            element.style.color='white'; 
            break;
        case "idea":
            element.style.backgroundColor='yellow';
            element.style.color=defaultFontColour; 
            break;
        default:
            element.style.backgroundColor=defaultBackground;
            element.style.color=defaultFontColour; 
      }
}


function WriteElementObjectToTable() {
    tableID = "steps";
    var tableContent = "";

    //headers
    tableContent += "<tr class='header'>";
    tableContent += "<td class='stepNum'>Step Number</td>";
    tableContent += "<td class='action'>Action</td>";
    tableContent += "<td class='identifier'>Supporting Identifiers</td>";
    tableContent += "<td class='tabInfo'>Page Information</td>";
    tableContent += "<td class='screenshot'>Screenshots</td>";
    tableContent += "</tr>"; //new row

    for (i = 0; i < elementObjects.length; i++) {
        if (elementObjects[i].type == "undefined") {
            //console.log("skipping loop="+ i);
            continue;
        }
        tableContent += '<tr row="' + i + '">';
        //step ID
        tableContent += "<td class='stepNum'>";
        tableContent += "<label><input type='checkbox' class='stepCheckbox'>"
        tableContent += "Step " + (parseInt(i) + 1);
        tableContent += "</label>";
        tableContent += "</td>";

        //action
        tableContent += "<td class='action'>";
        tableContent += ProcessEventTypeToSentence(elementObjects[i]);
        tableContent += AddEmptyTextFieldForRow(i, elementObjects[i]);
        tableContent += "</td>";

        //identifiers
        tableContent += "<td class='identifier'>";
        tableContent += ProcessIdentifiersToHtml(elementObjects[i]);
        tableContent += "</td>";

        //tab info
        tableContent += "<td class='tabInfo'>";
        tableContent += '<div class="titles">Tab title: ' + elementObjects[i].tabTitle + '</div>' + "<br>";
        try {
            tableContent += '<div class="duration">Page load time (ms): ' + elementObjects[i].timingsObject.duration.toFixed(0);
            tableContent += '<span class="durationDetails">' + GetDurationDetailsTable(elementObjects[i].timingsObject);
            tableContent += '</span></div><br>';
        } catch (err) { }
        tableContent += '<div class="urls">Tab url: ' + elementObjects[i].tabUrl + '</div>';
        tableContent += "</td>";

        //screenshot
        tableContent += "<td class='screenshot'>";
        tableContent += '<img src="' + elementObjects[i].screenshot + '"></img>';
        tableContent += "</td>";

        tableContent += "</tr>"; //new row
    }
    document.getElementById(tableID).innerHTML = tableContent;

    AddListenersToAnnotationTextAreas();
    SetStyleForAllTextAreas();
}



function GetDurationDetailsTable(nt) {
    // connectEnd: 2.579999854788184
    // connectStart: 2.579999854788184
    // decodedBodySize: 278150
    // domComplete: 1317.7499999292195
    // domContentLoadedEventEnd: 981.6850000061095
    // domContentLoadedEventStart: 981.3550000544637
    // domInteractive: 981.1799998860806
    // domainLookupEnd: 2.579999854788184
    // domainLookupStart: 2.579999854788184
    // duration: 1323.6350000370294
    // encodedBodySize: 66932
    // entryType: "navigation"
    // fetchStart: 2.579999854788184
    // initiatorType: "navigation"
    // loadEventEnd: 1323.6350000370294
    // loadEventStart: 1319.2449999041855
    // name: "https://www.google.com/search?q=aysync+javascript+load+time&oq=aysync+javascript+load+time+&aqs=chrome..69i57j33i22i29i30.9703j0j15&sourceid=chrome&ie=UTF-8"
    // nextHopProtocol: "h3-29"
    // redirectCount: 0
    // redirectEnd: 0
    // redirectStart: 0
    // requestStart: 9.550000075250864
    // responseEnd: 903.8799998816103
    // responseStart: 99.6199999935925
    // secureConnectionStart: 2.579999854788184
    //https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timings

    //headers
    var navigation = "";
    navigation += '<table id="perfDetails">'
    navigation += '<tr><td><b>MEASUREMENT</b></td><td><b>START<b></td><td><b>DURATION<b></td><td><b>END</b></td><td><b>%</b></td></tr>';

    //tracking values


    //reset the globals
    _runningTotal = 0;
    _duration = nt.duration;

    //add the data
    //navigation += formatDetailsLine ("Unload", nt.unloadEventStart, nt.unloadEventEnd);
    navigation += formatDetailsLine("Redirects (" + (nt.redirectCount) + ")", nt.redirectStart, nt.redirectEnd);
    navigation += formatDetailsLine("App Cache", nt.redirectEnd, nt.domainLookupStart);
    navigation += formatDetailsLine("DNS", nt.domainLookupStart, nt.domainLookupEnd);
    navigation += formatDetailsLine("TCP", nt.connectStart, nt.connectEnd);
    navigation += formatDetailsLine("Request", nt.requestStart, nt.responseStart);
    navigation += formatDetailsLine("Response", nt.responseStart, nt.responseEnd);
    navigation += formatDetailsLine("DOM Processing", nt.responseEnd, nt.domComplete);
    navigation += formatDetailsLine("Load Event", nt.domComplete, nt.loadEventEnd);

    //total line
    navigation += '<tr><td>Total Duration:</td><td></td><td></td><td>' + nt.duration.toFixed(0) + 'ms</td><td></td></tr>';

    navigation += '</table>'
    return navigation;
}
var _runningTotal;
var _duration;
function formatDetailsLine(lineText, start, end) {
    var sum = end.toFixed(0) - start.toFixed(0);
    var durationPercent = (sum / _duration) * 100;
    durationPercent = (durationPercent.toFixed(1)) + '%';
    if (end > _runningTotal) {
        _runningTotal = Math.round(end);
    }
    else {
        _runningTotal += sum;
    }
    //return '<tr><td>'+lineText+':</td><td>' + (start.toFixed(0)) + '</td><td>'+ (sum) +'</td><td>'+(_runningTotal)+'ms</td><td>'+(durationPercent)+'</td></tr>';
    return '<tr><td>' + lineText + ':</td><td>' + (Math.round(start)) + '</td><td>' + (Math.round(sum)) + '</td><td>' + (_runningTotal) + 'ms</td><td>' + (durationPercent) + '</td></tr>';

}

function calcDifference(start, end) {
    return start - end;
}

function ProcessEventTypeToSentence(elementObject) {

    var stepBuilder = "";
    //events we track - make them into a sentence.
    if (elementObject.type == "change") {
        stepBuilder += "Change the value of ";
    }
    else if (elementObject.type == "click") {
        stepBuilder += "Click on the ";
    }

    //used to create a sentence - we dont' want "undefined" or blanks/
    // use whjat we have to create something readable
    meaningfulText = getMeaningfulText(elementObject);

    //do the wording differently depending if it's a link
    if (elementObject.tagName == "A") {
        stepBuilder += "link with text: " + meaningfulText;
    }
    //process an input to input field (else type gives "text")
    else if (elementObject.tagName == "INPUT") {

    //allow modification of "input" to be a named thing...
        if(elementObject.AnnotationType != undefined){
            if (elementObject.Annotation.includes("#change ")) {
                stepBuilder += elementObject.Annotation.replace("#change", "") + " field";
            }
            else {
                stepBuilder += "input field";
                if (elementObject.type == "change") {
                    stepBuilder += " to value: [" + meaningfulText + "]"
                }
            }
        }
        else {
            stepBuilder += "input field";
            if (elementObject.type == "change") {
                stepBuilder += " to value: [" + meaningfulText + "]"
            }
        }
    }
    else if (elementObject.tagName == "BUTTON") {
        stepBuilder += "button " + meaningfulText;
    }
    else if (elementObject.tagName == "SELECT") {
        stepBuilder += "the select";
    }
    else {
        stepBuilder += elementObject.type;
    }

    return stepBuilder;
}

function getMeaningfulText(elementObject) {
    var meaningfulText = "";
    //figure out if the event element has any meaningful text
    if (validateSuccessfulIdentifier(elementObject.textContent))
        meaningfulText = elementObject.textContent.substring(0, 100);
    else if (validateSuccessfulIdentifier(elementObject.value))
        meaningfulText = elementObject.value;
    else if (validateSuccessfulIdentifier(elementObject.NestedImage_alt))
        meaningfulText = elementObject.NestedImage_alt;
    else if (validateSuccessfulIdentifier(elementObject.NestedImage_title))
        meaningfulText = elementObject.NestedImage_title;
    else if (validateSuccessfulIdentifier(elementObject.title))
        meaningfulText = elementObject.title;

    return meaningfulText;
}

function ProcessIdentifiersToHtml(elementObject) {

    var IdentifierBuilder = "";
    if (elementObject.type == "password") {
        stepBuilder = "Set the password";
        IdentifierBuilder += "[[password values not recorded]]";
    }
    else {
        if (validateSuccessfulIdentifier(elementObject.textContent))
            if (elementObject.textContent.length > 100)
                IdentifierBuilder += "[textContent : " + elementObject.textContent.substring(0, 100) + "...<i>truncated</i>]<br>";
            else
                IdentifierBuilder += "[textContent : " + elementObject.textContent + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.value))
            IdentifierBuilder += "[value : " + elementObject.value + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.id))
            IdentifierBuilder += "[id : " + elementObject.id + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.alt))
            IdentifierBuilder += "[alt : " + elementObject.alt + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.name))
            IdentifierBuilder += "[name : " + elementObject.name + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.title))
            IdentifierBuilder += "[title : " + elementObject.title + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.className))
            IdentifierBuilder += "[className : " + elementObject.className + "]<br>";

        if (validateSuccessfulIdentifier(elementObject.NestedImage_title))
            IdentifierBuilder += "[Contains image with title : " + elementObject.NestedImage_title + "]<br>";
        if (validateSuccessfulIdentifier(elementObject.NestedImage_alt))
            IdentifierBuilder += "[Contains image with alt : " + elementObject.NestedImage_alt + "]";
    }

    return IdentifierBuilder;
}

function validateSuccessfulIdentifier(identifer) {
    //conditions for using an identifer
    if (identifer != "" && identifer != undefined)
        return true;
    else
        return false;
}