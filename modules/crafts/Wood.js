import { Woodworking } from './Wood/Woodworking.js';
import { Marquetry } from './Wood/Marquetry.js'

let Wood = {
        required: [{
            level: [{
                name: 'Crafting',
                level: 3
            }],
        }],
        active: false,
        crafts: {
        Woodworking: {
            required: Woodworking.required,
            crafts: Woodworking.crafts,
            active: Woodworking.active
        },
        Marquetry: {
            required: Marquetry.required,
            crafts: Marquetry.crafts,
            active: Marquetry.active
        }
    }
};


export { Wood }