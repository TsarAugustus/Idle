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
    },{
        name: 'Knapped-Stone',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        active: false,
        special: {
            XPReturn: 5,
            returnAmt: 0.5
        },
        requires: [{
            name: 'Hammerstone',
            amount: 0.1
        }]
    }, {
        name: 'Handaxe',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        toolType: 'Axe',
        toolQuality: 1,
        active: false,
        special: {
            XPReturn: 10
        },
        requires: [{
            name: 'Knapped-Stone',
            amount: 1
        }, {
            name: 'Hammerstone',
            amount: 0.1
        }]
    }, {
        name: 'Handhoe',
        type: 'Flintknapping',
        itemType: 'Stonecrafting',
        toolType: 'Pick',
        toolQuality: 2,
        active: false,
        special: {
            XPReturn: 15
        },
        requires: [{
            name: 'Knapped-Stone',
            amount: 1
        }, {
            name: 'Hammerstone',
            amount: 0.1
        }]
    }]
}

export { Flintknapping }