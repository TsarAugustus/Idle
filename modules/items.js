import { skillItems } from './items/skillItems.js';
import { craftingMaterials } from './items/craftingMaterials.js';
import { basicMaterials } from './items/basicMaterials.js';
import { animals } from './items/animals.js';
import { craftableItems } from './items/craftableItems.js';

import { Player, playerFind } from './player.js';
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

for(let craftableItem of craftableItems) {
    items.push(craftableItem);
}

//the craft item function will most likely be moved to a different module
//a lot of skills will have interactive elements like this, so it might be good to
//have a skeleton function and pass the skill into it,but thats for later
function craftItem(item) {
    //to craft an item, it merely will check if the player has its REQUIRES 
    let newItemStockpile = [];
    let thisItem = findItem(item);
    for(let req of thisItem.requires) {
        let reqItem = playerFind(req.name);
        if(reqItem.amount >= req.amount) {
            newItemStockpile.push({
                name: req.name,
                amount: reqItem.amount - req.amount
            });
        }
    }

    if(thisItem.requires.length === newItemStockpile.length) {
        for(let newItem of newItemStockpile) {
            playerFind(newItem.name).amount = newItem.amount;

        }
        //if the item doesn't exist in the players Stockpile, add it
        //I think I want to avoid the Stockpile, and instead have 
        //the items count how many the player has, but seperation layers might help
        // worthwhile to look into
        if(!playerFind(thisItem.name)) {
            Player.items.push({
                name: thisItem.name,
                amount: 1,
                special: thisItem.special
            });
        } else {
            let item = playerFind(thisItem.name);
            item.amount++;
            if(thisItem.special.inc < 0) {
                thisItem.special.inc = -1 / item.amount;
                thisItem.special.max = 100 * item.amount;
            } else {
                thisItem.special.inc = 1 * item.amount;
                thisItem.special.max = 100 * item.amount;
            }
        }
        return true;
    } else {
        return false;
    }
    
}


let findItem = function(itemName) {
    return items.find(item => item.name === itemName)
}

export { items, findItem, craftItem };