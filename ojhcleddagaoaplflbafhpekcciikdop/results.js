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


window.onload = () => runMain();

let CopySteps = document.getElementById('CopySteps');
CopySteps.onclick = function CopySteps() {
    //create a handler for copying data - set what we want
    function handler(event) {
        event.clipboardData.setData('text/plain', CreateExcelHeaderLine() + StepsToExcelFormat());
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    //trigger the event - true = run once = removes after run
    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
    alert("Step information copied to clipboard - you can now paste in excel.\nBe sure to expand the column and row sizes to see all data." );
}

function CreateExcelHeaderLine()
{
    //header line - only needed for copytoexcel (not needed for ALM header)
    var seperator = "\t";//tab
    var newline = '\n';
    var excelHeaderString = "";
    excelHeaderString +=  "Step Number" + seperator + "Action";
    if (document.getElementById("toggleSupporting").checked) {
        excelHeaderString += seperator +"Supporting Identifiers";
    }
    if (document.getElementById("togglePageInfo").checked) {
        excelHeaderString += seperator + "Page Information";
    }
    excelHeaderString += newline;
    return excelHeaderString;
}

function StepsToExcelFormat(tabOffset = 0, firstLineOffset = false) {
    var excelCopyString = "";
    var seperator = "\t";//tab!
    var newline = '\n';
    var quoteReplace = "'";

    for (i = 0; i < elementObjects.length; i++) {
        //the tab offset moves everything to the right to allow integration with ALM line
        if (i > 0 || firstLineOffset) {
            for (j = 0; j < tabOffset; j++) {
                excelCopyString += seperator;
            }
        }

        let annotationText = "";
        if(elementObjects[i].AnnotationType != undefined) {
            if (!elementObjects[i].Annotation.includes("#change ")) {
                annotationText = newline + elementObjects[i].Annotation;
            }
        }

        excelCopyString += "Step " + (parseInt(i) + 1);
        excelCopyString += seperator;
        //wrap in \" to retain single-cell behaviour
        excelCopyString += "\"" + ProcessEventTypeToSentence(elementObjects[i]).replace(/<br>/gi, newline).replace(/\"/gi, quoteReplace) + annotationText + "\"";
        excelCopyString += seperator;
        if (document.getElementById("toggleSupporting").checked) {
            excelCopyString += "\"" + ProcessIdentifiersToHtml(elementObjects[i]).replace(/<br>/gi, newline).replace(/\"/gi, quoteReplace) + "\"";
            excelCopyString += seperator;
        }
        if (document.getElementById("togglePageInfo").checked) {
            excelCopyString += "\"" + elementObjects[i].tabTitle.replace(/<br>/gi, newline).replace(/\"/gi, quoteReplace) + newline;
            excelCopyString += elementObjects[i].tabUrl.replace(/<br>/gi, newline).replace(/\"/gi, quoteReplace) + "\"";
        }
        excelCopyString += newline;
    }
    return excelCopyString;
}


let DelSteps = document.getElementById('DeleteRow');
DelSteps.onclick = function DeleteSelected() {
    var delElements = document.getElementsByClassName("stepCheckbox");
    for (i = delElements.length - 1; i >= 0; i--) {
        if (delElements[i].checked) {
            var row = delElements[i].parentElement.parentElement.parentElement.getAttribute('row');
            DeleteRow(row);
        }
    }
}

function DeleteRow(i) {
    elementObjects.splice(i, 1);
    saveToStorage("elementObject", elementObjects);

    runMain();
}


let CopyALM = document.getElementById('CopyALM');
CopyALM.onclick = function CopyALM() {
    //create a handler for copying data - set what we want
    function handler(event) {
        event.clipboardData.setData('text/plain', CreateALMHeaderLine() + StepsToExcelFormat(9));
        event.preventDefault();
        document.removeEventListener('copy', handler, true);
    }

    //trigger the event - true = run once = removes after run
    document.addEventListener('copy', handler, true);
    document.execCommand('copy');
    alert("ALM line copied to clipboard - you can now paste in excel");
}

function CreateALMHeaderLine() {

    //do twp lines so value can stay togherr
    var excelHeaderLine = "";
    var excelContentLine = "";
    var seperator = "\t";//tab!
    var newline = '\n';

    excelHeaderLine += "Test Name" + seperator;
    excelContentLine += "<Enter Test Name>" + seperator;

    excelHeaderLine += "Test Type" + seperator;
    excelContentLine += "MANUAL" + seperator;

    excelHeaderLine += "Test Creation Date (optional)" + seperator;
    excelContentLine += "" + seperator;

    excelHeaderLine += "Test Designer" + seperator;
    excelContentLine += "<Name as seen in ALM>" + seperator;

    excelHeaderLine += "Test Priority (optional)" + seperator;
    excelContentLine += "" + seperator;

    excelHeaderLine += "Test System (optional)" + seperator;
    excelContentLine += "" + seperator;

    excelHeaderLine += "Test Status" + seperator;
    excelContentLine += "Design" + seperator;

    excelHeaderLine += "Test Description (optional)" + seperator;
    excelContentLine += "" + seperator;

    excelHeaderLine += "Test Comments (optional)" + seperator;
    excelContentLine += "" + seperator;

    //headers only = rest is added from storage values
    excelHeaderLine += "Step Name" + seperator;
    excelHeaderLine += "Step Description" + seperator;
    excelHeaderLine += "Step Expected Results" + seperator;

    return (excelHeaderLine + newline + excelContentLine);
}



