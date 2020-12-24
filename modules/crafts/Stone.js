import { Masonry } from './Stone/Masonry.js';
import { Flintknapping } from './Stone/Flintknapping.js';

let Stone = {
        required: [{
            level: [{
                name: 'Crafting',
                level: 1
            }],
        }],
        active: false,
        crafts: {
            Masonry: {
            required: Masonry.required,
            crafts: Masonry.crafts,
        },
        Flintknapping: {
            required: Flintknapping.required,
            crafts: Flintknapping.crafts
        }        
    }
};


export { Stone }