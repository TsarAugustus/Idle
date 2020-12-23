import { Masonry } from './Stone/Masonry.js';

let Stone = {
        required: [{
            level: [{
                name: 'Woodcrafting',
                level: 2
            }],
        }],
        active: false,
        crafts: {
            Masonry: {
            required: Masonry.required,
            crafts: Masonry.crafts,
        }
    }
};


export { Stone }