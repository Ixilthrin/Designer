function circlify(points) {
    var averageX = 0;
    var averageY = 0;
    var totalX = 0;
    var totalY = 0;
    var i = 0;
    for (i = 0; i < points.length; i = i + 2) {
        totalX += points[i]; 
    }
    for (i = 1; i < points.length; i = i + 2) {
        totalY += points[i]; 
    }
    averageX = totalX / (points.length / 2);
    averageY = totalY / (points.length / 2);
    
    var totalRadius = 0;
    for (i = 0; i < points.length; i = i + 2) {
        var xDistance = points[i] - averageX;
        var yDistance = points[i + 1] - averageY;
        totalRadius += Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    }
    var radius = totalRadius / (points.length / 2);
    return circle(radius, averageX, averageY);
}

function circle(radius, offsetX, offsetY) {
    var numDivisions = 8;
    if (radius > 1) {
        numDivisions = Math.floor(radius * 2);
    }
    if (numDivisions < 8) {
        numDivisions = 8;
    }
    var x = 0;
    var y = 0;
    var coords = new Array();
    var angleIncrement = 2 * Math.PI / numDivisions;
    for (var angle = 0; angle < 2 * Math.PI; angle += angleIncrement) {
        x = radius * Math.cos(angle) + offsetX;
        y = radius * Math.sin(angle) + offsetY;
        coords.push(x);
        coords.push(y);
    }
    // Fill the gap
    coords.push(coords[0]);
    coords.push(coords[1]);
    return coords;
}

function rectify(points, lineWidth) {
    var minX = 1000;
    var minY = 1000;
    var maxX = 0;
    var maxY = 0;
    var i = 0;
    for (i = 0; i < points.length; i = i + 2) {
        if (points[i] < minX) {
            minX = points[i];
        }
        if (points[i] > maxX) {
            maxX = points[i];
        }
        if (points[i + 1] < minY) {
            minY = points[i + 1];
        }
        if (points[i + 1] > maxY) {
            maxY = points[i + 1];
        }
    }
    var rectangle = new Array();
    var pointsOnSide = points.length / 16;
    var xIncrement = (maxX - minX) / pointsOnSide;
    var yIncrement = (maxY - minY) / pointsOnSide;
    var x = minX;
    var y = minY;
    for (i = 0; i < pointsOnSide; i++) {
        rectangle.push(x);
        rectangle.push(y);
        x += xIncrement;
    }
    for (i = 0; i < pointsOnSide; i++) {
        rectangle.push(x);
        rectangle.push(y);
        y += yIncrement;
    }
    for (i = 0; i < pointsOnSide; i++) {
        rectangle.push(x);
        rectangle.push(y);
        x -= xIncrement;
    }
    for (i = 0; i < pointsOnSide; i++) {
        rectangle.push(x);
        rectangle.push(y);
        y -= yIncrement;
    }
    rectangle.push(minX);
    rectangle.push(minY - lineWidth / 2);
    return rectangle;
}

function straighten(points, lineWidth) {
    if (points.length < 4) {
        return;
    }
    var startX = points[0];
    var startY = points[1];
    var endX = points[points.length - 2];
    var endY = points[points.length - 1];
    var incrementX = (endX - startX) / (points.length / 2);
    var incrementY = (endY - startY) / (points.length / 2);
    var i;
    var line = new Array();
    var x = startX;
    var y = startY;
    for (i = 0; i < points.length; i = i + 2) {
        line.push(x); 
        line.push(y); 
        x += incrementX;
        y += incrementY;
    }
    line.push(endX); 
    line.push(endY); 
    return line;
}
