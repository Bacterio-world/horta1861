import parcelesJson from './data/parceles.json';
console.log(parcelesJson)
const map = document.getElementById('mapContent');
const plots = new Array;
map.childNodes.forEach( node =>{
    if(node.id == 'Parceles'){
        node.childNodes.forEach( path =>{
            var pathPointsArray = convertPathToPolygon(path.id);
            plots.push({
                [path.id]: {
                    rawArea: calculateAreaOfPolygon(pathPointsArray)
                }
            })
            const oneMujada = ['B5','B14','D53']
            if(oneMujada.indexOf(path.id) != -1){  
                // document.getElementById(path.id).style.fill='yellow'
            }
        })
    }
});
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

function convertPathToPolygon(pathId)
{
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
let calcMujada;
// plots.forEach(plot =>{
//     const plotId = Object.keys(plot)[0];
//     if(plotId == 'D53'){
//         calcMujada = plot[plotId].rawArea;
//     }
//     const oneMujada = ['B5','B14','D53']
//     if(oneMujada.indexOf(plotId) != -1){  
//         console.log(plot[plotId].rawArea)
//     }
// })
const abstractMujada = calculateAreaOfPolygon(convertPathToPolygon('mujada'));
calcMujada = abstractMujada;
const averagePrecission = [];
const averagePrecissionFiltered = [];
plots.forEach(plot =>{
    const plotId = Object.keys(plot)[0];
    const area = plot[plotId].rawArea/calcMujada
    plot[plotId]['area']=area
    const areaMap = getMujadesFromJson(plotId)
    plot[plotId]['areaMap']= areaMap
    const precission = area / areaMap
    plot[plotId]['precission']= precission
    if(isFloat(precission)){
        averagePrecission.push(precission);
        if(0.5<precission && precission<2){
            averagePrecissionFiltered.push(precission)
        }
    }
    if(0.5<precission && precission<2){
        plot[plotId]['precissionPass'] = true; 
        document.getElementById(plotId).style.fill='green'
    }else{
        plot[plotId]['precissionPass'] = false;
        document.getElementById(plotId).style.fill='yellow'

    }
})
let precissionSum = 0;
averagePrecissionFiltered.forEach(value =>{
    precissionSum = precissionSum + value;
})
const filteredAverage = precissionSum / averagePrecissionFiltered.length
plots.forEach(plot =>{
    const plotId = Object.keys(plot)[0];
    plot[plotId]['area'] = plot[plotId]['area'] / filteredAverage
})
function isFloat(n) {
    return n === +n && n !== (n|0);
}
function getMujadesFromJson(parcelaId){
    for (const [key, value] of Object.entries(parcelesJson)){
        if(value.parcela === parcelaId ){
            const mujades = value.Mujades;
            const mundines = value.Mundines/20 
            return mujades+mundines;
        }
    }
}

console.log(filteredAverage);
console.log(plots);