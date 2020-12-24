let Flintknapping = {
    required: [{
        level: [{
            name: 'Crafting',
            level: 1
        }]
    }],
    crafts: [{
        name: 'Hammerstone',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        active: false,
        special: {
            XPReturn: 5
        },
        requires: [{
            name: 'Stone',
            amount: 2
        }]
    }, {
        name: 'Handaxe',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        active: false,
        special: {
            XPReturn: 10
        },
        requires: [{
            name: 'Hammerstone',
            amount: 0.1
        }, {
            name: 'Stone',
            amount: 1
        }]
    }]
}

export { Flintknapping }