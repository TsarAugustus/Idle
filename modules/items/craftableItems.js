export let craftableItems = [{
    name: 'Rainwater Barrell',
    type: 'Solid',
    itemType: 'Civ',
    amount: 0,
    special: {
        max: 100,
        inc: 1,
        current: 0,
        XPReturn: 30
    },
    requires: [{
        name: 'Leaves',
        amount: 3
    }, {
        name: 'Wood',
        amount: 2
    }, {
        name: 'Pole',
        amount: 2
    }, {
        name: 'Thread',
        amount: 2
    }]
}, {
    name: 'Fireplace',
    type: 'Solid',
    itemType: 'Civ',
    amount: 0,
    special: {
        max: 100,
        min: 0,
        inc: -1,
        current: 100,
        XPReturn: 30
    },
    requires: [{
        name: 'Leaves',
        amount: 1
    }, {
        name: 'Wood',
        amount: 1
    }]
}];