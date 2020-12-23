let Woodworking = {
    required: [{
        level: [{
            name: 'Foraging',
            level: 5
        }]
    }],
    active: false,
    crafts: [{
        name: 'Pole',
        type: 'Woodworking',
        itemType: 'Woodcrafting',
        special: {
            XPReturn: 15
        },
        requires: [{
            name: 'Wood',
            amount: 1
        }]
    }]
}

export { Woodworking }