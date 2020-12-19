export let craftableItems = [{
    name: 'Rainwater Barrell',
    type: 'Solid',
    itemType: 'Civ',
    amount: 0,
    special: {
        max: 100,
        inc: 1,
        current: 0
    },
    requires: [{
        name: 'Leaves',
        amount: 3
    }, {
        name: 'Wood',
        amount: 2
    }]
}];