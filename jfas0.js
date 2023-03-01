const main = (params) => {
    // Code here
    let filtro = [], i, j, primos = [];
    for(i = 2; i<= params; ++i){
        if(!filtro[i]){
            primos.push(i);
            for(j = i << 1; j <= params; j += i){
                filtro[j] = true
            }
        }
    }
    return primos
}

const result = main(1000).reduce((partialSum, a) => partialSum + a, 0);
console.log(result)