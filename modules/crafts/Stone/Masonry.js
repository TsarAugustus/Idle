let Masonry = {
    required: [{
        level: [{
            name: 'Crafting',
            level: 8
        }]
    }, {
        items: [{
            name: 'Stone',
            amount: 5
        }]
    }],
    crafts: [{
        name: 'Chair',
        type: 'Masonry',
        itemType: 'Stonecrafting',
        special: {
            XPReturn: 5
        },
        requires: [{
            name: 'Stone',
            amount: 5
        }]
    }]
}

export { Masonry }