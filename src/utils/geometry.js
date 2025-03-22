
function calculateAreaOfPolygon(points){
    if (points.length < 3)
        return 0;
    var area = 0, n = points.length;
    for (var i=0; i<(n-1); i++) {
        area += points[i].x * points[i+1].y;
        area -= points[i+1].x * points[i].y;
    }
    area += points[n-1].x * points[0].y;
    area -= points[0].x * points[n-1].y;
    return Math.abs(area) / 2;
}

function convertPathToPolygon(pathId){
    var pathElem = document.getElementById(pathId);
    var pathLen = pathElem.getTotalLength();
    var numSteps = Math.floor(pathLen * 2);
    var points = [];
    for (var i=0; i<numSteps; i++) {
        var p = pathElem.getPointAtLength(i * pathLen / numSteps);
        points.push(p);
    }
    return points;
}

export {calculateAreaOfPolygon, convertPathToPolygon}