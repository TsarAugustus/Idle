import { Woodworking } from './Wood/Woodworking.js';

let Wood = {
        required: [{
            level: [{
                name: 'Foraging',
                level: 2
            }],
        }, {
            items: [{
                name: 'Wood',
                amount: 1 
            }]
        }],
        active: false,
        crafts: {
            Woodworking: {
            required: Woodworking.required,
            crafts: Woodworking.crafts,
        }
    }
};


export { Wood }