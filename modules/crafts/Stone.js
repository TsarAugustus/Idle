import { Masonry } from './Stone/Masonry.js';

let Stone = {
        required: [{
            level: [{
                name: 'Crafting',
                level: 2
            }],
        }, {
            items: [{
                name: 'Stone',
                amount: 10
            }]
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