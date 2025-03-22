import parcelesJson from './data/parceles.json';
import { getMapData } from './getters/getMapData';
import { getPlotPropertiesById } from './utils/helpers';

const map = document.getElementById('mapContent');

const plots = getMapData(map,parcelesJson)
console.log(plots);

map.addEventListener('click',event =>{
    console.log(getPlotPropertiesById(event.target.id, plots))
})