let Woodworking = {
    required: [{
        level: [{
            name: 'Foraging',
            level: 5
        }]
    }],
    active: false,
    crafts: [{
        name: 'Wood',
        type: 'Woodworking',
        itemType: 'Woodcrafting',
        special: {
            XPReturn: 15
        },
        requires: [{
            name: 'Bark',
            amount: 2
        }]
    }]
}

export { Woodworking }