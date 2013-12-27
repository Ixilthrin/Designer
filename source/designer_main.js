var canvas;
var context;
var pages = new Array();
var thePage = new Object();
var pageIndex = 0;
pages.push(thePage);
thePage.boxes = new Array();
thePage.segments = new Array();
thePage.imageNamess = [];
thePage.images = [];
thePage.imageWidths = [];
thePage.imageHeights = [];
thePage.imagesX = new Array();
thePage.imagesY = new Array();
var textBackgroundColor = "rgba(255, 255, 255, 0)";
var grayVal = 230;
var textSelectedBackgroundColor = "rgb(" + grayVal + "," + grayVal + "," + grayVal + ")";

var startX;
var startY;
var text = new String();
var selectedIndices = new Array();
var segmentsSelectedIndices = new Array();
var selectOffsetX = -1;
var selectOffsetY = -1;
var inputMode = "text";
var mouseIsDown = false;
var lineColor = "blue"
var lineWidth = 2;
var currentSegment = new Object();
currentSegment.values = new Array();
currentSegment.color = lineColor;
currentSegment.width = lineWidth;
currentSegment.parentIndex = -1;
currentSegment.properties = new Object();
currentSegment.properties.keys = new Array();
currentSegment.properties.values = new Array();
var selectionBoxInitialX = -1;
var selectionBoxInitialY = -1;
var selectionBoxFinalX = -1;
var selectionBoxFinalY = -1;
var mouseX = 0;
var mouseY = 0;
var minFontHeight = 14;
var fontHeight = 14;
var fontName = "Georgia";
var fontType = ""; // Normal
var maxWidth;
var capsLock = false;
var currentMaxWidth = maxWidth;
var generatedDocument = null;
var titleSelected = false;
var currentRed = 0;
var currentGreen = 0;
var currentBlue = 0;

var firstClick = false;
var particleCount = 1000;
var particleSize = 4;
var copiedBoxes = new Array();
var copiedSegments = new Array();

function switchMode()
{
    if (inputMode == "text") {
        inputMode = "draw";
    } else {
        inputMode = "text";
    }
    var modeElement = document.getElementById("mode");
    if (modeElement) {
        if (inputMode == "text") {
            modeElement.value = "Draw mode";
        } else {
            modeElement.value = "Text mode";
        }
    }
}

function circlify_command()
{
    if (segmentsSelectedIndices.length == 0) {
        return;
    }
    var segment = thePage.segments[segmentsSelectedIndices[0]];
    segment.values = circlify(segment.values);
}

function rectify_command()
{
    if (segmentsSelectedIndices.length == 0) {
        return;
    }
    var segment = thePage.segments[segmentsSelectedIndices[0]];
    segment.values = rectify(segment.values, lineWidth);
}

function straighten_command()
{
    if (segmentsSelectedIndices.length == 0) {
        return;
    }
    var segment = thePage.segments[segmentsSelectedIndices[0]];
    segment.values = straighten(segment.values);
}

function cred()
{
    lineColor = "rgb(255, 0, 0)";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function cgreen()
{
    lineColor = "rgb(0, 255, 0)";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function cblue()
{
    lineColor = "rgb(0, 0, 255)";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function cyellow()
{
    lineColor = "rgb(255, 255, 0)";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function cbrown()
{
    lineColor = "brown";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function cblack()
{
    lineColor = "rgb(0, 0, 0)";
    for (var i = 0; i < selectedIndices.length; i++) {
       thePage.boxes[selectedIndices[i]].textColor = lineColor;
    }
    for (i = 0; i < segmentsSelectedIndices.length; i++) {
       thePage.segments[segmentsSelectedIndices[i]].color = lineColor;
    }
}

function createPage()
{
    var page = new Object();
    page.boxes = new Array();
    page.segments = new Array();
    page.imageNamess = [];
    page.images = [];
    page.imageWidths = [];
    page.imageHeights = [];
    return page;
}

// Backwards compatibility
function createTextObject(text, x, y, width, height, fontHeight,
                          color, maxWidth, time, keys, values)
{
    return createTextObject2(text, x, y, width, height, fontHeight, fontName, fontType, color, maxWidth, time, keys, values);
}

// In version 2 fontName and fontType were added to the arguments
function createTextObject2(text, x, y, width, height, fontHeight, fontName,
                           fontType, color, maxWidth, time, keys, values)
{
    var t = new Object();
    t.text = text;
    t.x = x;
    t.y = y;
    t.width = width;
    t.height = height;
    t.fontHeight = fontHeight;
    t.fontName = fontName;
    t.fontType = fontType;
    t.textColor = color;
    t.maxWidth = maxWidth;
    t.time = time;
    t.properties = new Object();
    t.properties.keys = keys;
    t.properties.values = values;
    return t;
}

function createSegment(coords, parentIndex, width, color, keys, values) 
{
    var segment = new Object();
    segment.values = coords;
    segment.parentIndex = parentIndex;
    segment.width = width;
    segment.color = color;
    segment.properties = new Object();
    segment.properties.keys = keys;
    segment.properties.values = values;
    return segment;
}

function save()
{
    addCurrentText();
    var newWin = window.open();
    var doc = newWin.document;

    var currentIndex = pageIndex;

    doc.write("<code>");
    doc.write("<br>");
    doc.write("pages = new Array();");
    doc.write("<br>");
    for (var i = 0; i < pages.length; i++) {
        doc.write("pages.push(createPage());");
        doc.write("<br>");
        savePage(doc, i);
    }
    doc.write("thePage = pages[0];");
    doc.write("<br>");
    doc.write("pageIndex = 0;");
    doc.write("<br>");
    doc.write("</code>");
    doc.write("<br>");
 
    pageIndex = currentIndex;
    thePage = pages[pageIndex];
}

function savePage(doc, pageIndex)
{
    var thePage = pages[pageIndex]; 
    for (var i = 0; i < thePage.boxes.length; i++) {
        var b = thePage.boxes[i];
        var text = b.text;
        var x = b.x;
        var y = b.y;
        var width = b.width;
        var height = b.height;
        var fontHeight = b.fontHeight;
        var fontName = b.fontName;
        var fontType = b.fontType;
        var textColor;
        if (b.textColor == undefined) {
            textColor = "blue";
        } else {
            textColor = b.textColor;
        }
        var maxWidth = b.maxWidth;
        var time;
        if (b.time == undefined) {
            var date = new Date();
            time = date.getTime();
        } else {
            time = b.time;
        }
        var keys = "[";
        var values = "[";
        if (b.properties == undefined) {
            keys = "[]";
            values = "[]";
        } else {
            var length = b.properties.keys.length;
            for (var k = 0; k < length; k++) {
                keys += "\"" + b.properties.keys[k] + "\"" + ", "; 
            }
            keys += "]";

            length = b.properties.values.length;
            for (var k = 0; k < length; k++) {
                values += "\"" + b.properties.values[k] + "\"" + ", "; 
            }
            values += "]";
        }
        doc.write("pages[" + pageIndex + "].boxes.push(createTextObject2(\"" + text + "\", " + x + "," + y + "," + width + "," + height + "," + fontHeight + ", \"" + fontName + "\"," + "\"" + fontType + "\"," + "\"" + textColor + "\"," + maxWidth + "," + time + "," + keys + "," + values +"));");
        doc.write("<br>");
    }
    for (var i = 0; i < thePage.segments.length; i++) {
        var segment = thePage.segments[i];
        var coords = "[";
        for (var j = 0; j < segment.values.length; j++) {
            coords += segment.values[j] + ",";
        }
        coords += "]";
        var parentIndex = segment.parentIndex;
        var width = segment.width;
        var color = segment.color;
        var keys = "[";
        var values = "[";
        if (segment.properties == undefined) {
            keys = "[]";
            values = "[]";
        } else {
            var length = segment.properties.keys.length;
            for (var k = 0; k < length; k++) {
                keys += "\"" + segment.properties.keys[k] + "\"" + ", "; 
            }
            keys += "]";

            length = segment.properties.values.length;
            for (var k = 0; k < length; k++) {
                values += "\"" + segment.properties.values[k] + "\"" + ", "; 
            }
            values += "]";
        }
        doc.write("pages[" + pageIndex + "].segments.push(createSegment(" + coords + "," + parentIndex + ", " + width + ", \"" + color + "\", " + keys + "," + values + "));");
        doc.write("<br>");
    }
}

function alignHorizontal()
{
    if (selectedIndices.length < 2) {
        return;
    }
    var y = 0;
    for (var i = 0; i < selectedIndices.length; i++) {
        y = y + thePage.boxes[selectedIndices[i]].y;
    }
    y = Math.floor(y / selectedIndices.length);
    for (var i = 0; i < selectedIndices.length; i++) {
        thePage.boxes[selectedIndices[i]].y = y;
    }
}

function alignVertical()
{
    if (selectedIndices.length > 1) {
        var x = 0;
        for (var i = 0; i < selectedIndices.length; i++) {
            x = x + thePage.boxes[selectedIndices[i]].x;
        }
        x = Math.floor(x / selectedIndices.length);
        for (var i = 0; i < selectedIndices.length; i++) {
            thePage.boxes[selectedIndices[i]].x = x;
        }
    }
}

function copyBox(box) 
{
    var newBox = new Object();
    newBox.text = box.text;
    newBox.maxWidth = box.maxWidth;
    newBox.x = box.x + 30; 
    newBox.y = box.y + 30; 
    if (box.textColor == undefined) {
        box.textColor = "black";
    }
    newBox.textColor = box.textColor;
    newBox.width = box.width;
    newBox.height = box.height;
    newBox.fontHeight = box.fontHeight;
    if (box.fontName == undefined) {
        box.fontName = "Georgia";
    }
    newBox.fontName = box.fontName;
    if (box.fontType == undefined) {
        box.fontType = "";
    }
    newBox.fontType = box.fontType;
    newBox.time = box.time;
    newBox.properties = new Object();
    newBox.properties.keys = new Array();
    newBox.properties.values = new Array();
    return newBox;
}

function copySegment(segment) 
{
    var newSegment = new Object();
    newSegment.properties = new Object();
    newSegment.properties.keys = new Array();
    newSegment.properties.values = new Array();
    newSegment.parentIndex = -1;
    newSegment.width = segment.width;
    newSegment.color = segment.color;
    newSegment.values = new Array();
    for (var j = 0; j < segment.values.length; j++) {
        newSegment.values.push(segment.values[j] + 30);
    }
    return newSegment;
}

function copySelection() 
{
    copiedBoxes = new Array();
    for (var i = 0; i < selectedIndices.length; i++) {
        copiedBoxes.push(copyBox(thePage.boxes[selectedIndices[i]]));
    }
    copiedSegments = new Array();
    for (var i = 0; i < segmentsSelectedIndices.length; i++) {
        copiedSegments.push(copySegment(thePage.segments[segmentsSelectedIndices[i]]));
    }
}

function pasteSelection()
{
    for (var i = 0; i < copiedBoxes.length; i++) {
        thePage.boxes.push(copiedBoxes[i]);
    }
    for (var i = 0; i < copiedSegments.length; i++) {
        thePage.segments.push(copiedSegments[i]);
    }
    copiedBoxes = new Array();
    copiedSegments = new Array();
}

function copyPage()
{
    thePage = pages[pageIndex];
    var newPage = new Object();
    newPage.boxes = new Array();
    for (var i = 0; i < thePage.boxes.length; i++) {
        var box = new Object();
        box.x = thePage.boxes[i].x;
        box.y = thePage.boxes[i].y;
        box.fontHeight = thePage.boxes[i].fontHeight;
        if (thePage.boxes[i].fontName == undefined) {
            thePage.boxes[i].fontName = "Georgia";
        }
        box.fontName = thePage.boxes[i].fontName;
        if (thePage.boxes[i].fontType == undefined) {
            thePage.boxes[i].fontType = "";
        }
        box.fontType = thePage.boxes[i].fontType;
        if (thePage.boxes[i].textColor == undefined) {
            thePage.boxes[i].textColor = "black";
        }
        box.textColor = thePage.boxes[i].textColor;
        box.width = thePage.boxes[i].width;
        box.height = thePage.boxes[i].height;
        box.text = thePage.boxes[i].text;
        box.maxWidth = thePage.boxes[i].maxWidth;
        if (thePage.boxes[i].time == undefined) {
            var date = new Date();
            box.time = date.getTime();
        } else {
            box.time = thePage.boxes[i].time;
        }
        if (thePage.boxes[i].properties == undefined) {
            box.properties = new Object();
            box.properties.keys = new Array();
            box.properties.values = new Array();
        } else {
            box.properties = thePage.boxes[i].properties;
        }
        newPage.boxes.push(box);
    }
    newPage.segments = new Array();
    for (var i = 0; i < thePage.segments.length; i++) {
        var segment = new Object();
        segment.properties = new Object();
        segment.properties.keys = new Array();
        segment.properties.values = new Array();
        segment.parentIndex = thePage.segments[i].parentIndex;
        segment.width = thePage.segments[i].width;
        segment.color = thePage.segments[i].color;
        segment.values = new Array();
        for (var j = 0; j < thePage.segments[i].values.length; j++) {
            segment.values.push(thePage.segments[i].values[j]);
        }
        newPage.segments.push(segment);
    }
    newPage.imageNamess = [];
    newPage.images = [];
    newPage.imageWidths = [];
    newPage.imageHeights = [];
    for (var i = 0; i < thePage.images.length; i++) {
        newPage.imageNamess = thePage.imageNamess[i];
        newPage.images = thePage.images[i];
        newPage.imageWidths = thePage.imageWidths[i];
        newPage.imageHeights = thePage.imageHeights[i];
    }
    pages.push(newPage);
    pageChanged();
    pageIndex = pages.length - 1;
    thePage = pages[pageIndex];
    updatePage();
}

function deletePage()
{
    for (var i = pageIndex; i < pages.length; i++) {
        pages[i] = pages[i + 1];
    }
    pages = pages.slice(0, pages.length - 1);
    if (pageIndex >= pages.length) {
        pageIndex = pages.length - 1;
    }
    if (pageIndex < 0) {
        pageIndex = 0;
    }
    if (pages.length == 0) {
        pageIndex = -1;
        nextPage();
        return;
    }
    pageChanged();
    thePage = pages[pageIndex];
    updatePage();
}

// Returns true if something was selected.
function checkCursorIntersection(x, y, add)
{
    var somethingSelected = false;
    for (var i = 0; i < thePage.boxes.length; ++i) {
        var textBoxWidth = thePage.boxes[i].width;
        var textBoxHeight = thePage.boxes[i].height;
        var lineHeight = thePage.boxes[i].fontHeight;
        if (x >= thePage.boxes[i].x && x <= thePage.boxes[i].x + textBoxWidth && y >= thePage.boxes[i].y - lineHeight && y <= thePage.boxes[i].y + textBoxHeight- lineHeight) {
            somethingSelected = true;
            if (selectedIndices.indexOf(i) < 0) {
                if (!add) {
                    selectedIndices = [];
                    segmentsSelectedIndices = [];
                }
                selectedIndices.push(i);
            }
            return true;
        }
    }
    return somethingSelected;
}

function checkBoxIntersection()
{
    if (selectionBoxInitialX == -1 || selectionBoxFinalX == -1) {
        return;
    }
    selectedIndices = [];
    for (var i = 0; i < thePage.boxes.length; ++i) {
        var textBoxWidth = thePage.boxes[i].width;
        var textBoxHeight = thePage.boxes[i].height;
        if (selectionBoxInitialX < thePage.boxes[i].x - 7 && selectionBoxFinalX > thePage.boxes[i].x + textBoxWidth && selectionBoxInitialY < thePage.boxes[i].y - 15 && selectionBoxFinalY > thePage.boxes[i].y - 15 + textBoxHeight) {
            if (selectedIndices.indexOf(i) < 0) {
                selectedIndices.push(i);
            }
        }
    }
    selectionBoxInitialX = -1;
    selectionBoxFinalX = -1;
}

function insertText() 
{
    var insertBox = document.getElementById("inserttext");
    text += insertBox.value;
    insertBox.value = "";
    addCurrentText();
}

function copyToClipboard (text) {
  window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
}

var previousX = -1;
var previousY = -1;
var previousTime = -1;
var deltaX = 0;
var deltaY = 0;

function getGroupIndex(box) 
{
    if (box.properties == undefined) {
        return -1;
    }
    var groupIndex = -1;
    for (var i = 0; i < box.properties.keys.length; i++) {
        if (box.properties.keys[i] == "group") {
            groupIndex = i;
        }
    } 
    return groupIndex;
}

function getBoxesByGroup(group, excludeIndex)
{
    var cBoxes = new Array();
    for (var i = 0; i < thePage.boxes.length; i++) {
        if (i == excludeIndex) {
            continue;
        }
        if (thePage.boxes[i].properties == undefined) {
            continue;
        }
        var groupIndex = getGroupIndex(thePage.boxes[i]);
        if (groupIndex > -1) {
            if (thePage.boxes[i].properties.values[groupIndex] == group) {
                cBoxes.push(thePage.boxes[i]);
            }
        }
    }
    return cBoxes;
}

function getSegmentsByGroup(group, excludeIndex)
{
    var cSegments = new Array();
    for (var i = 0; i < thePage.segments.length; i++) {
        if (i == excludeIndex) {
            continue;
        }
        if (thePage.segments[i].properties == undefined) {
            continue;
        }
        var groupIndex = getGroupIndex(thePage.segments[i]);
        if (groupIndex > -1) {
            if (thePage.segments[i].properties.values[groupIndex] == group) {
                cSegments.push(thePage.segments[i]);
            }
        }
    }
    return cSegments;
}

function getSegmentsByParent(parentIndex)
{
    var aSegments = new Array();
    for (var i = 0; i < thePage.segments.length; i++) {
        if (thePage.segments[i].parentIndex == parentIndex) {
            aSegments.push(thePage.segments[i]);
        }
    }
    return aSegments;
}


function main() 
{
   particlesCreated = false;
   initTime = date.getTime();

   var i = 0;

   var fontChooser = document.getElementById("fontchooser");
   fontChooser.addEventListener("change", function(e) {
       fontName = fontChooser.options[fontChooser.selectedIndex].text;
       for (i = 0; i < selectedIndices.length; i++) {
           thePage.boxes[selectedIndices[i]].fontName = fontName;
       }
   });

   var fontTypeChooser = document.getElementById("fonttype");
   fontTypeChooser.addEventListener("change", function(e) {
       fontType = fontTypeChooser.options[fontTypeChooser.selectedIndex].text;
       if (fontType == "Normal") {
           fontType = "";
       }
       for (i = 0; i < selectedIndices.length; i++) {
           thePage.boxes[selectedIndices[i]].fontType = fontType;
       }
   });

   canvas = document.getElementById("canvas");
   maxWidth = canvas.width;
   context = canvas.getContext("2d");
   canvas.addEventListener('mouseover', function(e) {
       canvas.focus();
   }); 
   canvas.addEventListener('mousewheel', function(e) {
       e.preventDefault();
       var centerX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
       var centerY = document.body.scrollTop + e.clientY - canvas.offsetTop;
       for (var i = 0; i < thePage.images.length; i++) {
           if (thePage.images[i].index != selectedIndices[0]) {
               continue;
           }
           var factor = .9;
           if (e.wheelDelta > 0) {
               factor = 1.1;
           }
           thePage.imageWidths[i] *= factor;
           thePage.imageHeights[i] *= factor;
       }
   }); 
   canvas.addEventListener("mousemove", function(e) {
       e.preventDefault();
       if (mouseIsDown) {
           if (inputMode == "text") {
               if (selectedIndices.length > 0 || segmentsSelectedIndices.length > 0) {
                   if (e.shiftKey) {
                       var box = thePage.boxes[selectedIndices[0]]
                       box.maxWidth += (document.body.scrollLeft + e.clientX - canvas.offsetLeft - mouseX) / 2;
                       if (box.maxWidth < 0) {
                           box.maxWidth = 0;
                       }
                       var textLength = context.measureText(box.text).width;
                       if (box.maxWidth > textLength) {
                           box.maxWidth = textLength;
                       }
                       return;
                   }
                   if (e.ctrlKey) {
                       var difference = document.body.scrollLeft + e.clientX - canvas.offsetLeft - mouseX;
                       difference /= 40;
                       thePage.boxes[selectedIndices[0]].fontHeight += difference;
                       var currentHeight = thePage.boxes[selectedIndices[0]].fontHeight;
                       if (currentHeight < fontHeight) {
                           thePage.boxes[selectedIndices[0]].fontHeight = fontHeight;
                       }
                       if (currentHeight >= minFontHeight) {
                           fontHeight = currentHeight;
                       }
                       return;
                   }
                   e.target.style.cursor = "move";
                   if (selectedIndices.length > 0) {
                       previousX = thePage.boxes[selectedIndices[0]].x;
                       previousY = thePage.boxes[selectedIndices[0]].y;
                   }
                   var date = new Date();
                   previousTime = date.getTime();

                   var changeX = document.body.scrollLeft + e.clientX - canvas.offsetLeft - selectOffsetX;
                   var changeY = document.body.scrollTop + e.clientY - canvas.offsetTop - selectOffsetY;

                   var groupName = "";
                   var theGroupCount = 0;
             
                   if (selectedIndices.length > 0) {
                       var textObject = thePage.boxes[selectedIndices[0]];
                       var groupIndex = getGroupIndex(textObject);
                       
                       if (textObject.properties != undefined) {
                           groupName = textObject.properties.values[groupIndex];
                       }
                   } else if (segmentsSelectedIndices.length > 0) {
                       var segment = thePage.segments[segmentsSelectedIndices[0]];
                       var groupIndex = getGroupIndex(segment);
                       var properties = segment.properties;
                       if (properties != undefined && properties.keys != undefined && properties.values != undefined) {
                           if (groupName == "" && groupIndex >= 0) {
                               groupName = segment.properties.values[groupIndex];
                           }
                       }
                   }

//var debug = document.getElementById("debug");
//debug.innerHTML = acount;
                   
                   // Either move by group property of move by selection.
                   // The rule is that if more than 1 object is selected,
                   // then we don't move by the group property.
                   if (selectedIndices.length + segmentsSelectedIndices.length > 1) {
                       groupName = "";
                   }

                   var movedByGroup = false;

                   if (groupName != "" && !e.shiftKey) {
                       var exclusion = -1;
                       var sBoxes = getBoxesByGroup(groupName, exclusion);
                       for (var j = 0; j < sBoxes.length; j++) {
                           movedByGroup = true;
                           theGroupCount++;
                           sBoxes[j].x += changeX;
                           sBoxes[j].y += changeY;
                       }
                   }


                   if (groupName != "" && !e.shiftKey) {
                       var exclusion = -1;
                       var currentSegments = getSegmentsByGroup(groupName, exclusion);
                       for (j = 0; j < currentSegments.length; j++) {
                           movedByGroup = true;
                           theGroupCount++;
                           var tSegment = currentSegments[j];
                           var values = tSegment.values;
                           for (var m = 0; m < values.length; m = m + 2) {
                               values[m] += changeX;
                               values[m + 1] += changeY;
                           }
                       }
                   }

                   if (!movedByGroup && theGroupCount < 2 && thePage.boxes.length > 0 && selectedIndices.length > 0) {
                       for (var q = 0; q < selectedIndices.length; q++) {
                           thePage.boxes[selectedIndices[q]].x += changeX;
                           thePage.boxes[selectedIndices[q]].y += changeY;
                       }
                   }
                   if (!movedByGroup && theGroupCount < 2) {
                       for (var i = 0; i < segmentsSelectedIndices.length; i++) {
                           var tSegment = thePage.segments[segmentsSelectedIndices[i]];
                           var values = tSegment.values;
                           for (var m = 0; m < values.length; m = m + 2) {
                               values[m] += changeX;
                               values[m + 1] += changeY;
                           }
                       }
                   }

                   selectOffsetX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
                   selectOffsetY = document.body.scrollTop + e.clientY - canvas.offsetTop;

                   return;
               } else {
                   selectionBoxFinalX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
                   selectionBoxFinalY = document.body.scrollTop + e.clientY - canvas.offsetTop;
               }
           } else {
               currentSegment.values.push(document.body.scrollLeft + e.clientX - canvas.offsetLeft);
               currentSegment.values.push(document.body.scrollTop + e.clientY - canvas.offsetTop);
           }
       } else {
           if (inputMode == "text") {
               outputColorValue(document.body.scrollLeft + e.clientX - canvas.offsetLeft, document.body.scrollTop + e.clientY - canvas.offsetTop);
           }
       }
   }); 
   canvas.addEventListener("mouseup", function(e) {
           e.target.style.cursor = "default";
       mouseIsDown = false;
       if (inputMode == "text") {
           if (e.shiftKey) {
               return;
           }
       if (selectedIndices.length > 0) {
           if ((document.body.scrollTop + e.clientY - canvas.offsetTop < 20 || document.body.scrollLeft + e.clientX - canvas.offsetLeft < 20 || document.body.scrollTop + e.clientY - canvas.offsetTop > canvas.height - 20) && confirm("Delete it?")) {
               thePage.boxes[selectedIndices[0]].text = "";
           }
           previousTime = -1;
           
           previousX = -1;
           previousY = -1;
           return;
       } else {
           selectionBoxFinalX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
           selectionBoxFinalY = document.body.scrollTop + e.clientY - canvas.offsetTop;
           checkBoxIntersection();
           showTableForBox();
       }
       } else {
           currentSegment.color = lineColor;
           currentSegment.width = lineWidth;
           currentSegment.values.push(document.body.scrollLeft + e.clientX - canvas.offsetLeft);
           currentSegment.values.push(document.body.scrollTop + e.clientY - canvas.offsetTop);
       }
   }); 
   canvas.addEventListener("dblclick", function(e) {
       if (inputMode == "text") {
           startX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
           startY = document.body.scrollTop + e.clientY - canvas.offsetTop;
           checkCursorIntersection(startX, startY, false);
           if (selectedIndices.length > 0) {
               copyToClipboard(thePage.boxes[selectedIndices[0]].text);
           }
       } 
   });
   canvas.addEventListener("mousedown", function(e) {
       e.preventDefault();
       canvas.focus();
       mouseIsDown = true;
       firstClick = true;
       mouseX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
       mouseY = document.body.scrollTop + e.clientY - canvas.offsetTop;
       selectOffsetX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
       selectOffsetY = document.body.scrollTop + e.clientY - canvas.offsetTop;
       var segmentsSelected = false;
       var textSelected = false;
       if (inputMode != "draw") {
       }
       selectionBoxInitialX = -1;
       selectionBoxInitialY = -1;
       selectionBoxFinalX = -1;
       selectionBoxFinalY = -1;
       addCurrentText();
       if (inputMode == "text") {
           if (thePage.segments.length > 0 && thePage.segments[0].values.length >= 4) {
               var segments = thePage.segments;
               for (var i = 0; i < segments.length; i++) {
                   for (var j = 0; j < segments[i].values.length - 2; j += 2) {
                       if (checkDistance(4, mouseX, mouseY, segments[i].values[j], segments[i].values[j + 1])) {
                           segmentsSelected = true;
                           if (segmentsSelectedIndices.indexOf(i) == -1) {
                               if (!e.ctrlKey) {
                                   segmentsSelectedIndices = [];
                                   selectedIndices = [];
                               }
                               segmentsSelectedIndices.push(i);
                               i = segments.length;
                           }
                       }
                   }
               }
           }
           startX = document.body.scrollLeft + e.clientX - canvas.offsetLeft;
           startY = document.body.scrollTop + e.clientY - canvas.offsetTop;
           textSelected = checkCursorIntersection(mouseX, mouseY, e.ctrlKey);
           if (!textSelected && !segmentsSelected) {
               selectedIndices = [];
               segmentsSelectedIndices = [];
           }
           if (selectedIndices.length > 0) {
               if (generatedDocument != null) {
                   var text = thePage.boxes[selectedIndices[0]].text;
                   generatedDocument += text;
                   if (!titleSelected && text.charAt[text.length - 1] != ".") {
                       generatedDocument += ".  ";
                   }
               }
               if (thePage.boxes[selectedIndices[0]].properties != undefined) {
                   showTableForBox();
               }
               previousX = thePage.boxes[selectedIndices[0]].x;
               previousY = thePage.boxes[selectedIndices[0]].y;
           } else {
               previousX = -1;
               previousY = -1;
               selectionBoxInitialX = startX;
               selectionBoxInitialY = startY;
           }
       } else {
           currentSegment = new Object();
           currentSegment.parentIndex = -1;
           currentSegment.values = new Array();
           currentSegment.color = lineColor;
           currentSegment.width = lineWidth;
           currentSegment.properties = new Object();
           currentSegment.properties.keys = new Array();
           currentSegment.properties.values = new Array();
           if (selectedIndices.length > 0) {
               currentSegment.parentIndex = selectedIndices[0];
           } else {
               currentSegment.parentIndex = -1;
           }
           thePage.segments.push(currentSegment);
           currentSegment.values.push(document.body.scrollLeft + e.clientX - canvas.offsetLeft);
           currentSegment.values.push(document.body.scrollTop + e.clientY - canvas.offsetTop);
       }
   }); 
   canvas.addEventListener("keydown", function(e) {
       e.preventDefault();
       var keyCodeOutput = document.getElementById("key code")
       if (keyCodeOutput) {
           keyCodeOutput.innerHTML = "key code = " + e.keyCode;
       }
       if (inputMode == "text") {
       if (e.ctrlKey) {
           if (e.keyCode == 67) {  // 'C' key
               copySelection();
               return;
           }
           if (e.keyCode == 86) {  // 'V' key
               pasteSelection();
               return;
           }
       }
       var code = e.keyCode;
       if (code >= 65 && code <= 90 && !e.shiftKey && !capsLock) {
           code += 32;
       }
       if (code == 20) {
           capsLock = !capsLock;
       } else if (code == 13) {
           addCurrentText();
           startY += 20;
       } else if (code == 46) {
           deleteSelection();
       } else {
           if (selectedIndices.length > 0) {
               text = "";
               var tempText = thePage.boxes[selectedIndices[0]].text;
               thePage.boxes[selectedIndices[0]].text = editText(tempText, e, capsLock);
           } else {
               text = editText(text, e, capsLock);
           }
       }
       }
   }); 
   canvas.addEventListener("keyup", function(e) {
       var code = e.keyCode;
       if (code == 27) {
           switchMode();
           return;
       }
       if (inputMode == "draw") {
           if (code >= 49 && code <= 57) {
               lineWidth = code - 48;
               return;
           }
           if (code == 71) {
               lineColor = "green";
               //lineColor = "rgb(112, 209, 54)";
           } else if (code == 66) {
               lineColor = "blue";
           } else if (code == 82) {
               //lineColor = "red";
               lineColor = "rgb(250, 79, 40)";
           } else if (code == 89) {
               lineColor = "yellow";
           } else if (code == 75) {
               lineColor = "black";
           } else if (code == 87) {
               lineColor = "brown";
           }
           var colorOutput = document.getElementById("current color")
           if (colorOutput) {
               colorOutput.innerHTML = "Current line color = " + lineColor;
           }
           return;
       }
   }); 

    loadDocument();
    pageIndex = 0;
    thePage = pages[pageIndex];
   
    //text = "byte-dec80.jpg";
    //text = "earth_is_about_to_be_exploded.jpg";
    //startX = 250;
    //startY = 250;
    //addCurrentText();
    //text = "December 1980 Issue of Byte Magazine";
    //text = "Prepare to die, earthlings!  HA HA HA! You are doooomed!";
    //text = "Click anywhere on the canvas to skip this animation.";
    //startX = 200;
    //startY = 200;
    draw();

}

var date = new Date();
var initTime = date.getTime();
date  = new Date();
var previousTime = date.getTime();

var particlesCreated = false;
var particles;

var textRemoved = false;
var imageLoaded = false;

var boxRemoved = false;
var playedExplosion = false;
var playedBeeping = false;
var finishedPlayingExplosion = false;

function drawIntro()
{

    var newDate = new Date();
    var currentTime = newDate.getTime() - initTime;

    if (!playedBeeping) {
        playedBeeping = true;
        var audio = document.getElementById("beeping");
        audio.play();
        initTime = newData.getTime();
        return;
    }

    if (currentTime > 5000 && !playedExplosion) {
        playedExplosion = true;

        var audio2 = document.getElementById("beeping");
        audio2.pause();
        var audio = document.getElementById("explosion");
        audio.play();
        finishedPlayingExplosion = true;
        return;
    }


    if (currentTime > 2000 && thePage.images.length > 0 && !particlesCreated) {
        particlesCreated = true;
        particles = new Array();
        for (var ii = 0; ii < particleCount; ii++) {
            var particle = new Particle(thePage.images[0], thePage.imagesX[0], thePage.imagesY[0], thePage.imageWidths[0], thePage.imageHeights[0]);
            particles.push(particle);
        }
    }

    if (particles.length != particleCount) {
        return;
    }

    if (currentTime > 80000 && particles.length > 0) {
        particles = new Array();
    }
    if (currentTime > 5000 && !boxRemoved) {
        thePage.boxes = new Array();
        boxRemoved = true;
         
    }
    if (currentTime > 30000 && textRemoved == false) {
        textRemoved = true;
        text = "";
    }
         
    if (currentTime > 5000 && currentTime < 80000 && particlesCreated && particles.length == particleCount) {
        for (var ii = 0; ii < particles.length; ii++) {
            var particle = particles[ii];
            particle.update();
            particle.draw(context);
        }
    }
}

var shownTutorial = false;


function draw() 
{
    requestAnimationFrame(draw);
    if (!firstClick && particlesCreated && particles.length != particleCount) {
        return;
    }
    
    if (!firstClick && playedExplosion && !finishedPlayingExplosion) {
        return;
    }

/*
    var newDate = new Date();
    if (newDate.getTime() - initTime > 6000) {
    for (var i = 0; i < thePage.boxes.length; i++) {
        if (thePage.boxes[i].y < canvas.height - 33) {
            thePage.boxes[i].y = thePage.boxes[i].y + thePage.boxes[i].drop;
            thePage.boxes[i].drop += thePage.boxes[i].delta;
        }
    }
    }
    date = new Date();
    var time = date.getTime();
    if (time - previousTime > 30) {
        requestAnimationFrame(draw);
        previousTime = time;
    }
*/
    context.clearRect(0, 0, canvas.width, canvas.height);


    updateDocument();
    context.strokeStyle = "blue";
    context.lineWidth = 1;
    context.font = fontType + " " + fontHeight + "px " + fontName;
    context.fillStyle = lineColor;
    if (text && text.length > 0) {
        var newObject = {};
        newObject.text = text;
        newObject.fontHeight = fontHeight;
        newObject.fontName = fontName;
        newObject.fontType = fontType;
        newObject.textColor = lineColor;
        newObject.maxWidth = canvas.width - startX - 10;
        if (newObject.maxWidth < 0) {
            newObject.maxWidth = 0;
        }
        currentMaxWidth = newObject.maxWidth;
        drawTextInBox(newObject, startX, startY, true, thePage.boxes.length);
      }
    for (var i = 0; i < thePage.boxes.length; i++) {
        var isSelected = false;
        for (var z = 0; z < selectedIndices.length; z++) {
            if (selectedIndices[z] == i) {
                isSelected = true;
            }
        }
        drawTextInBox(thePage.boxes[i], thePage.boxes[i].x, thePage.boxes[i].y, isSelected, i);
    }

    for (var seg = 0; seg < thePage.segments.length; seg = seg + 1) {
        var segment = thePage.segments[seg];
        context.beginPath();
        context.lineWidth = segment.width;
        context.strokeStyle = segment.color;
        //var initialDash = context.getLineDash();
        if (segmentsSelectedIndices.indexOf(seg) >= 0) {
            context.strokeStyle = "gray";
            //context.strokeStyle = "red";
            //context.setLineDash([3, 3]);
            context.lineWidth = lineWidth + 2;
        }
        context.moveTo(segment.values[0], segment.values[1]);
        for (var p = 2; p < segment.values.length; p = p + 2) {
            context.lineTo(segment.values[p], segment.values[p + 1]);
        }
        //context.strokeStyle = lineColor;
        context.stroke();
        //context.setLineDash(initialDash);
    }

    // Draw selection box
    if (selectionBoxInitialX > -1 && selectionBoxFinalX > -1) {
        context.beginPath();
        //var initialDash = context.getLineDash();
        //context.setLineDash([2, 3]);
        context.lineWidth = 1;
        context.strokeStyle = "#999999";
        context.moveTo(selectionBoxInitialX, selectionBoxInitialY);
        context.lineTo(selectionBoxFinalX, selectionBoxInitialY);
        context.lineTo(selectionBoxFinalX, selectionBoxFinalY);
        context.lineTo(selectionBoxInitialX, selectionBoxFinalY);
        context.lineTo(selectionBoxInitialX, selectionBoxInitialY);
        context.stroke();
        //context.setLineDash(initialDash);
    }
    context.beginPath();
    context.moveTo(0, canvas.height - 50);
    context.lineTo(50, canvas.height - 50);
    context.lineTo(50, canvas.height);
    context.lineTo(0, canvas.height);
    context.lineTo(0, canvas.height - 50);
    //context.fillStyle = "#22ffee";
    context.fillStyle = "rgb(" + currentRed + "," + currentGreen + "," + currentBlue + ")";
    context.fill();

/*
    if (!firstClick) {
        //drawIntro();
    } else if (!boxRemoved) {
        particles = new Array();
        images = new Array();
        thePage.boxes = new Array();
        boxRemoved = true;
        var audio = document.getElementById("beeping");
        audio.pause();
        var audio = document.getElementById("explosion");
        audio.pause();
        tutorial();
    }
*/
    if (!shownTutorial) {
        shownTutorial = true;
        tutorial();
    }
}

function outputColorValue(x, y)
{
    try {
       var imageData = context.getImageData(x, y, x + 1, y + 1);
       currentRed = imageData.data[0];
       currentGreen = imageData.data[1];
       currentBlue = imageData.data[2];

       //lineColor = "rgb(" + currentRed + ", " + currentGreen + ", " + currentBlue + ")";

       var tag = document.getElementById("pixel-color");
       if (tag) {
           tag.innerHTML = "R:" + currentRed + " G:" + currentGreen + " B:" + currentBlue;
       }
     } catch(ex) {
         //alert("security exception");
       currentRed = 0;
       currentGreen = 0;
       currentBlue = 0;
     }
}

function drawTextInBox(box, xPos, yPos, isSelected, imageIndex)
{
    var theText = box.text;
    if (theText == undefined || theText.length < 1) {
        return;
    }
    context.font = box.fontType + " " + box.fontHeight + "px " + box.fontName;
    var imagePath = theText.split()[0];
    var imageType = imagePath.substr(imagePath.length - 4);
    if (imageType == ".jpg" || imageType == ".gif") {
        var createImage = true;
        var index = 0;
        for (; index < thePage.imageNamess.length; index++) {
            if (thePage.imageNamess[index] == imagePath) {
                createImage = false;
                break;
            }
        }
        if (createImage) {
            var newImage = new Image();
            newImage.src = theText;
            newImage.addEventListener("load", function() {
                thePage.imageNamess.push(imagePath);
                //newImage.index = thePage.boxes.length;
                newImage.index = imageIndex;
                thePage.images.push(newImage);
                var newWidth = box.width;
                thePage.imageWidths.push(newWidth);
                thePage.imageHeights.push(newWidth * newImage.height / newImage.width);
                thePage.imagesX.push(0);
                thePage.imagesY.push(0);
            });
            index = thePage.images.length;
            theText += " (loading)";
            // Interesting! 
            // Must return here since image might not load in time for
            // the following code to execute.
            //return;
        }
        if (thePage.images.length > index) {
            try {
            context.drawImage(thePage.images[index], xPos - 10, yPos - 32, thePage.imageWidths[index], thePage.imageHeights[index]);
            thePage.imagesX[index] = xPos - 10;
            thePage.imagesY[index] = yPos - 32;
            box.width = thePage.imageWidths[index];
            box.height = thePage.imageHeights[index];
            } catch (error) {}
            return;
        }
    }
    //context.fillText(theText, xPos, yPos);
    var lineHeight = box.fontHeight;
    var boxMaxWidth = box.maxWidth;
    var lines = splitLines(context, theText, boxMaxWidth);
    var height = lines.length * lineHeight;
    var width = 0;
    for (var i = 0; i < lines.length; i++) {
        //context.fillText(lines[i], xPos, yPos + i * lineHeight);
        var currentWidth = context.measureText(lines[i]).width;
        if (currentWidth > width) {
            width = currentWidth; 
        }
    }
    width += 10;
    box.width = width;
    box.height = height;
    context.lineWidth = 1;
    context.beginPath();
/* david
    context.moveTo(xPos - 6, yPos - height);
    context.lineTo(xPos + width, yPos - height);
    context.lineTo(xPos + width, yPos + 6);
    context.lineTo(xPos - 6, yPos + 6);
    context.lineTo(xPos - 6, yPos - height);
*/
    context.moveTo(xPos - 6, yPos - lineHeight);
    context.lineTo(xPos + width, yPos - lineHeight);
    context.lineTo(xPos + width, yPos + 6 + height - lineHeight);
    context.lineTo(xPos - 6, yPos + 6 + height - lineHeight);
    context.lineTo(xPos - 6, yPos - lineHeight);
    context.fillStyle = textBackgroundColor;
    if (isSelected) {
        context.fillStyle = textSelectedBackgroundColor;
    } 
    context.fill();
    if (box.textColor == undefined) {
        box.textColor = lineColor;
    }
    context.fillStyle = box.textColor;
    for (var i = 0; i < lines.length; i++) {
        var x = xPos;
        //var y = yPos - (lines.length - 1) * lineHeight; // david
        var y = yPos;
        context.fillText(lines[i], x, y + i * lineHeight);
    }
}

function showTableForBox()
{
    var previous = document.getElementById("property-table");
    if (previous != undefined && previous != null) {
        document.body.removeChild(previous);
    }
    var properties;
    if (selectedIndices.length > 0) {
        properties = thePage.boxes[selectedIndices[0]].properties;
    } else if (segmentsSelectedIndices.length > 0) {
        properties = thePage.segments[segmentsSelectedIndices[0]].properties;
    } else {
        return;
    }
        if (properties == undefined || properties == null || properties.keys.length == 0) {
        return;
        }
        var table = document.createElement("table");
        table.id = "property-table";
        table.border = "1";
        var header1 = document.createElement("th");
        header1.innerHTML = "Property";
        var header2 = document.createElement("th");
        header2.innerHTML = "Value";

        var row = document.createElement("tr");
        row.appendChild(header1);
        row.appendChild(header2);
        table.appendChild(row);

        for (var i = 0; i < properties.keys.length; i++) {
            var row = document.createElement("tr");
            var propertyName = document.createElement("th");
            row.appendChild(propertyName);
            propertyName.innerHTML = properties.keys[i];
            var propertyValue = document.createElement("th");
            row.appendChild(propertyValue);
            propertyValue.innerHTML = properties.values[i];
            table.appendChild(row);
        }

        document.body.appendChild(table);
}

function addProperty()
{
    var keyField = document.getElementById("key-field").value;
    var valueField = document.getElementById("value-field").value;
    for (var i = 0; i < selectedIndices.length; i++) {
        if (keyField != "") {
            if (thePage.boxes[selectedIndices[i]].properties == undefined) {
                thePage.boxes[selectedIndices[i]].properties = new Object();
                thePage.boxes[selectedIndices[i]].properties.keys = new Array();
                thePage.boxes[selectedIndices[i]].properties.values = new Array();
            }
            thePage.boxes[selectedIndices[i]].properties.keys.push(keyField);
            thePage.boxes[selectedIndices[i]].properties.values.push(valueField);
        }
    }
    for (var i = 0; i < segmentsSelectedIndices.length; i++) {
        if (keyField != "") {
            if (thePage.segments[segmentsSelectedIndices[i]].properties == undefined) {
                thePage.segments[segmentsSelectedIndices[i]].properties = new Object();
                thePage.segments[segmentsSelectedIndices[i]].properties.keys = new Array();
                thePage.segments[segmentsSelectedIndices[i]].properties.values = new Array();
            }
            thePage.segments[segmentsSelectedIndices[i]].properties.keys.push(keyField);
            thePage.segments[segmentsSelectedIndices[i]].properties.values.push(valueField);
        }
    }
}

function randomize() 
{
    var offsetX = 0;
    var offsetY = 0;
    for (var j = 0; j < thePage.segments.length; j++) {
    var segment = thePage.segments[j];
    var multiplier = 1;
    for (var i = 0; i < segment.values.length; i += 2) {
        offsetX += Math.random() * multiplier;
        offsetY += Math.random() * multiplier;
        segment.values[i] += offsetX;
        segment.values[i + 1] += offsetY;
        var c = Math.floor(Math.random() * 5);
        if (c == 2) {
            multiplier = multiplier * -1;
        }
        if (offsetX > 4 || offsetY > 4) {
            multiplier = multiplier * -1;
        }
    }
    }
    //draw();
}

function split(aString)
{
    var tokens = new Array;
    var done = false;
    var index = 0;
    var currentChar;
    var currentString = new String;
    while (!done) {   
        currentChar = aString.charAt(index); 
        if (currentChar == " ") {
            if (currentString.length > 0) {
                tokens.push(currentString);
                currentString = new String;
            }
        } else {
            currentString += currentChar;
        }
        index++;
        if (index >= aString.length) {
            if (currentString.length > 0) {
                tokens += currentString;
            }
            done = true;
        }
    }
    return tokens;
}

function writeOutput(value)
{
    var output = document.getElementById("output");
    if (!output) { 
        var output = document.createElement("p");
        output.id = "output";
        document.body.appendChild(output);
    }
    output.innerHTML = "(output) " + value;
}

function splitLines(context, text, maxWidth)
{
    var done = false;
    var strings = text.split(" ");
    for (var i = 0; i < strings.length; i++) {
        var width = context.measureText(strings[i]).width;
        if (width > maxWidth) {
            maxWidth = width; 
        }
    }
    var lines = new Array();
    var isFirstStringInLine = true;
    var currentLine = new String();
    var tempLine = new String();
    var index = 0;
    while (index < strings.length) {
        if (!isFirstStringInLine) {
            tempLine += " ";
        }
        tempLine += strings[index];
        var lineWidth = context.measureText(tempLine).width;
        if (lineWidth > maxWidth) {
            if (isFirstStringInLine) {
                maxWidth = lineWidth;
                lines.push(tempLine);
                index++;
            } else {
                lines.push(currentLine);
            }
            currentLine = new String();
            tempLine = new String();
            isFirstStringInLine = true;
        } else {
            if (!isFirstStringInLine) {
                currentLine += " ";
            }
            currentLine += strings[index];
            isFirstStringInLine = false;
            index++;
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }
    return lines;
}

function addCurrentText()
{
       if (text != undefined && text.trim() != "") {
           currentText = new Object();
           currentText.text = text;
           currentText.maxWidth = currentMaxWidth;
           currentText.x = startX; 
           currentText.y = startY; 
           currentText.width = currentMaxWidth;
           currentText.height = 20;
           currentText.fontHeight = fontHeight;
           currentText.fontName = fontName;
           currentText.fontType = fontType;
           currentText.textColor = lineColor;
           date = new Date();
           currentText.time = date.getTime();
           thePage.boxes.push(currentText);
           text = new String();
       }
}

function pageChanged()
{
    addCurrentText();
    startX = 0;
    startY = 0;
    text = new String();
    selectedIndices = new Array();
    segmentsSelectedIndices = new Array();
    selectOffsetX = -1;
    selectOffsetY = -1;
    inputMode = "text";
    mouseIsDown = false;
    mouseX = 0;
    mouseY = 0;
}

function nextPage()
{
    pageChanged();
    pageIndex++;
    if (pageIndex >= pages.length) {
        thePage = new Object();
        thePage.boxes = new Array();
        thePage.segments = new Array();
        thePage.imageNamess = [];
        thePage.images = [];
        thePage.imageWidths = [];
        thePage.imageHeights = [];
        pages.push(thePage);
    } else {
        thePage = pages[pageIndex];
    }
    updatePage();
}

function previousPage()
{
    if (pageIndex <= 0) {
        return;
    }
    pageChanged();
    pageIndex--;
    thePage = pages[pageIndex];
    updatePage();
}

function updatePage()
{
    var pageNumber = document.getElementById("pagenumber");
    if (pageNumber) {
        pageNumber.innerHTML = "Page " + (pageIndex + 1) + " / " + pages.length;
    }
}

function runCode()
{ 
    addCurrentText();
    var code = document.getElementById("code");
    eval(code.value);
    updatePage();
}

function startDocument()
{
    addCurrentText();
    generatedDocument = new String;
    generatedDocument += "<html><head><title>Generated Document</title></head><body>";
}

function stopDocument()
{
    if (generatedDocument) {
        if (titleSelected) {
            generatedDocument += "</h1>";
            titleSelected = false;
        }
        generatedDocument += "</body></html>";
        var newWin = window.open();
        var newDoc = newWin.document;
        newDoc.write(generatedDocument);
        newDoc.close();
        generatedDocument = null;
    }
}

function addDocumentTitle()
{
    if (generatedDocument) {
        generatedDocument += "<h1>";
    }
    titleSelected = true;
}

function addDocumentParagraph()
{
    if (generatedDocument) {
        if (titleSelected) {
            generatedDocument += "</h1>";
        }
        generatedDocument += "<p>";
    }
}

function deleteSelection()
{
    addCurrentText();
    if (thePage.boxes.length == 0 && thePage.segments.length == 0) {
        return;
    }
    if (inputMode == "text" && confirm("Delete selected items?")) {
        for (var i = 0; i < selectedIndices.length; i++) {
            thePage.boxes[selectedIndices[i]].text = "";
        }
        segmentsSelectedIndices.sort();
        for (var i = segmentsSelectedIndices.length - 1; i >= 0; i--) {
            thePage.segments.splice(segmentsSelectedIndices[i], 1);
        }
        segmentsSelectedIndices = new Array();
    }
}
var dcount = 0;
////////////////////////////////////////////////////
// Line Segments - To be placed in separate file
////////////////////////////////////////////////////
function checkDistance(value, x1, y1, x2, y2)
{
     if (Math.abs(x2 - x1) > value || Math.abs(y2 - y1) > value) {
         return false;
     }
     var xDiff = x2 - x1;
     var yDiff = y2 - y1;
     return Math.sqrt(xDiff * xDiff + yDiff * yDiff) < value;
}

/*
function distancePointToSegment(pointX, pointY, initialX, initialY, finalX, finalY)
{
    // b is the slope
    var b = (finalY - initialY) / (finalX - initialX);
    // c is the y-intercept
    var c = initialY + b * initialX;
    var distance = Math.abs(pointX + b * pointY - c) / Math.sqrt(1 + b * b);
    dcount++;
    return distance;
}
*/

function clearAll()
{
    if (confirm("Clear everything?")) {
        pages = new Array();
        thePage = createPage();
        pages.push(thePage);
        pageIndex = 0;
        updatePage();
    }
}



////////////////////////////////////////////////////
// Particle - To be placed in separate file Particle.js?
////////////////////////////////////////////////////

function Particle(image, posX, posY, width, height)
{
    this.particleSize = particleSize;
  
    var x = Math.random() * width;
    var y = Math.random() * height;

    var imageData = context.getImageData(x + posX, y + posY, x + posX + 1, y + posY + 1);
    var currentRed = imageData.data[0];
    var currentGreen = imageData.data[1];
    var currentBlue = imageData.data[2];
    this.color = "rgb(" + currentRed + ", " + currentGreen + ", " + currentBlue + ")";

    this.x = posX + x;
    this.y = posY + y;
    this.z = 0;

    var centerX = posX + width / 2;
    var centerY = posY + height / 2;

    var diffX = this.x - centerX;
    var diffY = this.y - centerY;
  
    var angle = Math.atan(diffY / diffX);
    if (diffX < 0) {
        angle += Math.PI;
    }
    
    this.p1 = new Object();
    this.p2 = new Object();
    this.p3 = new Object();
    this.p4 = new Object();

    this.p1.x = this.x
    this.p1.y = this.y

    this.p2.x = this.p1.x + Math.random() * this.particleSize;
    this.p2.y = this.p1.y + Math.random() * 2;

    this.p3.x = this.p2.x + (Math.random() * 1 - 2);
    this.p3.y = this.p2.y + Math.random() * this.particleSize;

    this.p4.x = this.p3.x - Math.random() * this.particleSize;
    this.p4.y = this.p3.y + (Math.random() * 1 - 2);


    this.velocity = new Object();
    this.velocity.x = 0;
    this.velocity.y = 0;
    var speed = .2 + Math.random() * 1.5;
    this.velocity.x = speed * Math.cos(angle);
    this.velocity.y = speed * Math.sin(angle);
}

Particle.prototype.update = function()
{
    this.move(this.velocity.x, this.velocity.y);
    if (this.y > canvas.height - this.particleSize) {
        this.velocity.y = 0;
        this.velocity.x = 0;
    }
    if (this.x > canvas.width) {
        this.velocity.x = Math.random() / 3;
        this.velocity.x = -1 * this.velocity.x;
        this.velocity.y = 3 + Math.random();
    }
    if (this.y < 0) {
        this.velocity.y = Math.random();
    }
    if (this.x < 0) {
        this.velocity.x = Math.random() / 3;
        this.velocity.y = 3 + Math.random();
    }
    this.velocity.y += .003;
}

Particle.prototype.draw = function(context)
{
    context.beginPath();
    context.fillStyle = this.color;

    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.lineTo(this.p3.x, this.p3.y);
    context.lineTo(this.p4.x, this.p4.y);
    context.lineTo(this.p1.x, this.p1.y);

    context.fill();
}

Particle.prototype.move = function(x, y)
{
    this.x += x;
    this.y += y;
    this.p1.x += x;
    this.p1.y += y;
    this.p2.x += x;
    this.p2.y += y;
    this.p3.x += x;
    this.p3.y += y;
    this.p4.x += x;
    this.p4.y += y;
}
