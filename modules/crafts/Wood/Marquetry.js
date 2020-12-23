let Marquetry = {
    active: false,
    required: [{
        level: [{
            name: 'Woodcrafting',
            level: 1
        }],
        items: [{
            name: 'Wood',
            amount: 1
        }]
    }],
    crafts: [{
        name: 'thing',
        type: 'Marquetry',
        itemType: 'Woodcrafting',
        special: {
            XPReturn: 20
        },
        requires: [{
            name: 'Wood',
            amount: 1
        }]
    }]
}

export { Marquetry }