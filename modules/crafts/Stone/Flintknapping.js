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
        toolType: 'Hammer',
        active: false,
        special: {
            XPReturn: 100
        },
        requires: [{
            name: 'Stone',
            amount: 2
        }]
    }, {
        name: 'Handaxe',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        toolType: 'Axe',
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
    }, {
        name: 'Handhoe',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        toolType: 'Hoe',
        active: false,
        special: {
            XPReturn: 15
        },
        requires: [{
            name: 'Stone',
            amount: 1
        }]
    }]
}

export { Flintknapping }