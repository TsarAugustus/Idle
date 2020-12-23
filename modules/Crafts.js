// import { Wood, Stone, Paper, Needle, Metal, Leather, House, Glass, Flower, Fashion, Ceramic } from './*.js';
import { Wood } from './crafts/Wood.js';
import { Stone } from './crafts/Stone.js';
let Crafts = [];
let craftCategories = {
    Wood: {
        required: Wood.required,
        crafts: Wood.crafts,
        active: Wood.active
    },
    // },
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

function subCraftFind(primaryCategory, subCraftCategory) {
    return craftCategories[primaryCategory].crafts[subCraftCategory];
}


function craftFind(craftType) {
    return craftCategories[craftType];
}

export { Crafts, craftFind, subCraftFind, craftCategories }