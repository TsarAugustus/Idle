let Woodworking = {
    required: [{
        level: [{
            name: 'Foraging',
            level: 5
        }]
    }, {
        items: [{
            name: 'Wood',
            amount: 5
        }]
    }],
    crafts: [{
        name: 'Pole',
        type: 'Woodworking',
        itemType: 'Woodcrafting',
        special: {
            XPReturn: 200
        },
        requires: [{
            name: 'Wood',
            amount: 1
        }]
    }]
}

export { Woodworking }