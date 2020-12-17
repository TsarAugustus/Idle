import { skillItems } from './items/skillItems.js';
import { craftingMaterials } from './items/craftingMaterials.js';
import { basicMaterials } from './items/basicMaterials.js';
import { animals } from './items/animals.js';
let items = [];



//create a for loop for every module in items folder, probably better to find out a way to do this with a single function
//cest la vie
for(let skillItem of skillItems) {
    items.push(skillItem)
}

for(let craftingMat of craftingMaterials) {
    items.push(craftingMat);
}

for(let basicMat of basicMaterials) {
    items.push(basicMat)
}

for(let animal of animals) {
    items.push(animal);
}


let findItem = function(itemName) {
    return items.find(item => item.name === itemName)
}

export { items, findItem };