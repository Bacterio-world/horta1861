import { calculateAreaOfPolygon, convertPathToPolygon } from './../utils/geometry';
import { isFloat, getJsonPropertyByParcela } from './../utils/helpers';
import { getMujadesFromJson, decimalToMundines } from './../utils/mujades';

function getMapData(map,parcelesJson){
    
    const plots = new Array;
    //calculate mujada from abstract plot
    let calcMujada = calculateAreaOfPolygon(convertPathToPolygon('mujada'));
    //calculate raw area (in pixels) for each plot and push it into plots
    map.childNodes.forEach( node =>{
        if(node.id == 'Parceles'){
            node.childNodes.forEach( path =>{
                const pathPointsArray = convertPathToPolygon(path.id);
                plots.push({
                    [path.id]: {
                        rawArea: calculateAreaOfPolygon(pathPointsArray)
                    }
                })
            })
        }
    });
    const averagePrecission = [];
    const averagePrecissionFiltered = [];
    plots.forEach(plot =>{
        //get the plot id
        const plotId = Object.keys(plot)[0];
        //push the plot owner
        plot[plotId]['owner'] = getJsonPropertyByParcela(plotId,'Nom',parcelesJson);
        //push the actual area in mujades
        const area = plot[plotId].rawArea/calcMujada
        //push the area in decimal
        plot[plotId]['area']=area
        //push the area as displayed on the map legend
        const areaMapMujades = `${getJsonPropertyByParcela(plotId,'Mujades',parcelesJson)} ${getJsonPropertyByParcela(plotId,'Mundines',parcelesJson)}`
        plot[plotId]['areaMapMujades']= areaMapMujades
        //push the decimal area as displayed on the map legend
        const areaMap = getMujadesFromJson(plotId,parcelesJson)
        plot[plotId]['areaMap']= areaMap
        //calculate and push the precission rate between the calculated and displayed areas
        const precission = area / areaMap
        plot[plotId]['precission']= Math.floor(precission * 100) / 100
        //Filter out aberrant data to calculate a better average mujada size
        if(isFloat(precission)){
            averagePrecission.push(precission);
            if(0.5<precission && precission<2){
                averagePrecissionFiltered.push(precission)
            }
        }
    })
    //calculate an average mujada area and substitute it on the plots objects
    let precissionSum = 0;
    averagePrecissionFiltered.forEach(value =>{
        precissionSum = precissionSum + value;
    })
    const filteredAverage = precissionSum / averagePrecissionFiltered.length
    plots.forEach(plot =>{
        const plotId = Object.keys(plot)[0];
        const newArea = plot[plotId]['area'] / filteredAverage
        plot[plotId]['area'] = newArea
        //push the new area in mujades and mundines
        plot[plotId]['areaMujades'] = decimalToMundines(newArea);
        //push the precission with the new rate
        const newPrecission = newArea / plot[plotId]['areaMap']
        plot[plotId]['precission'] = newPrecission
        //push the quality of the precission
        if(0.5<newPrecission && newPrecission<2){
            plot[plotId]['precissionPass'] = true; 
            document.getElementById(plotId).style.fill='green'
        }else{
            plot[plotId]['precissionPass'] = false;
            document.getElementById(plotId).style.fill='yellow'
    
        }
    })

    return plots
}

export {getMapData}