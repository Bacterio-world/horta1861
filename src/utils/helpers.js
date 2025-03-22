function isFloat(n) {
    return n === +n && n !== (n|0);
}

function getJsonPropertyByParcela(parcelaId,propertyName,parcelesJson){
    for (const [key, value] of Object.entries(parcelesJson)){
        if(value.parcela === parcelaId ){
            return value[propertyName];
            
        }
    }
}
function getPlotPropertiesById(parcelaId,plots){
    for (const [key, value] of Object.entries(plots)){
        if(Object.keys(value)[0] === parcelaId){
            return value
        }

    }
}

export {isFloat, getJsonPropertyByParcela, getPlotPropertiesById}