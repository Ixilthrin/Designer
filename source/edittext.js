// Transforms text based on event e and returns result
function editText(inputText, e, capsLock)
{
    var text = inputText;
    var code = e.keyCode;
       if (code >= 65 && code <= 90 && !e.shiftKey && !capsLock) {
           code += 32;
       }
       switch (code) {
           case 9:
               text += "    ";
               break;
           case 16: // shift key
               break;
           case 17:
               break;
           case 18:
               break;
           case 20:
               // Caps lock - not applicable
               break;
           case 27:
               break;
           case 32:
               text += " ";
               break;
           case 46:
               // delete key
               break;
           case 92:
               break;
           case 8:
               // backspace
               if (text.length > 0) {
                   text = text.slice(0, text.length - 1)
               }
           break;
           case 186:
           if (e.shiftKey) {
               text += ":";
           } else {
               text += ";";
           }
               break;
           case 187:
           if (e.shiftKey) {
               text += "+";
           } else {
               text += "=";
           }
               break;
           case 188:
           if (e.shiftKey) {
               text += "<";
           } else {
               text += ",";
           }
               break;
           case 189:
           if (e.shiftKey) {
               text += "_";
           } else {
               text += "-";
           }
               break;
           case 190:
           if (e.shiftKey) {
               text += ">";
           } else {
               text += ".";
           }
               break;
           case 192:
           if (e.shiftKey) {
               text += "~";
           } else {
               text += "`";
           }
               break;
           case 220:
           if (e.shiftKey) {
               text += "|";
           } else {
               text += "\\";
           }
               break;
           case 222:
           if (e.shiftKey) {
               text += "\"";
           } else {
               text += "'";
           }
               break;
           case 48:
           if (e.shiftKey) {
               text += ")";
           } else {
               text += "0";
           }
               break;
           case 49:
           if (e.shiftKey) {
               text += "!";
           } else {
               text += "1";
           }
           break;
           case 55:
           if (e.shiftKey) {
               text += "&";
           } else {
               text += "7";
           }
           break;
           case 57:
           if (e.shiftKey) {
               text += "(";
           } else {
               text += "9";
           }
           break;
           case 190:
           if (e.shiftKey) {
               text += ">";
           } else {
               text += ".";
           }
           break;
           case 191:
           if (e.shiftKey) {
               text += "?";
           } else {
               text += "/";
           }
           break;
           case 219:
           if (e.shiftKey) {
               text += "{";
           } else {
               text += "[";
           }
           break;
           case 221:
           if (e.shiftKey) {
               text += "}";
           } else {
               text += "]";
           }
           break;
           //case 16:
           // shift key. Do nothing.
           default:
           if (e.shiftKey && code >= 49 && code <= 58) {
               if (code == 49) {
                   text += "!";
               } else if (code == 50) {
                   text += "@";
               } else if (code == 51) {
                   text += "#";
               } else if (code == 52) {
                   text += "$";
               } else if (code == 53) {
                   text += "%";
               } else if (code == 54) {
                   text += "^";
               } else if (code == 55) {
                   text += "&";
               } else if (code == 56) {
                   text += "*";
               } else if (code == 57) {
                   text += "(";
               } else if (code == 58) {
                   text += ")";
               }
           } else {
               text = text + String.fromCharCode(code);
           }
       }
    return text;
}
