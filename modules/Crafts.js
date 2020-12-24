// import { Wood, Stone, Paper, Needle, Metal, Leather, House, Glass, Flower, Fashion, Ceramic } from './*.js';
import { Wood } from './crafts/Wood.js';
import { Stone } from './crafts/Stone.js';
import { playerFind } from './player.js';

let Crafts = [];
let craftCategories = {
    Wood: {
        required: Wood.required,
        crafts: Wood.crafts,
        active: Wood.active
    },
    Stone: {
        required: Stone.required,
        crafts: Stone.crafts,
        active: Stone.active
    }
    // Paper: [],
    // Needle: [],
    // Metal: [],
    // Leather: [],
    // House: [],
    // Glass: [],
    // Flower: [],
    // Fashion: [],
    // Ceramic: []
}

function checkForActiveSubCrafts(subCraft) {
    for(let craft of subCraft.crafts) {
        let reqContainer = [];
        for(let req of craft.requires) {
            if(playerFind(req.name).amount >= req.amount) {
                reqContainer.push(true);
            }
        }
        if(reqContainer.length === craft.requires.length) {
            craft.active = true;
        }
    }
}

function subCraftFind(primaryCategory, subCraftCategory) {
    checkForActiveSubCrafts(craftCategories[primaryCategory].crafts[subCraftCategory]);
    return craftCategories[primaryCategory].crafts[subCraftCategory];
}


function craftFind(craftType) {
    return craftCategories[craftType];
}

export { Crafts, craftFind, subCraftFind, craftCategories }