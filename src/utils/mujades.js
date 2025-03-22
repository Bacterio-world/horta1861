function getMujadesFromJson(parcelaId,parcelesJson){
    for (const [key, value] of Object.entries(parcelesJson)){
        if(value.parcela === parcelaId ){
            return mundinesToDecimal(value.Mujades,value.Mundines)
            
        }
    }
}

function mundinesToDecimal(mujades, mundines){
    mundines = mundines/20 
    return mujades+mundines;
}
function decimalToMundines(mujadesDecimal){
    const mujades = Math.floor(mujadesDecimal)
    const mundines = Math.floor((mujadesDecimal - mujades) *  20)
    return `${mujades} ${mundines}`
}

export {getMujadesFromJson, decimalToMundines}
