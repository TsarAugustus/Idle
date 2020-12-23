export let skillItems = [{
    name: 'Fishing Pole',
    type: 'Solid',
    itemType: 'Skill',
    special: {
        XPReturn: 15
    },
    requires: [{
        name: 'Pole',
        amount: 1
    }, {
        name: 'Thread',
        amount: 2
    }]
}, {
    name: 'Wood Hatchet',
    itemType: 'Skill',
    filter: 'Wood',
    special: {
        XPReturn: 20
    },
    requires: [{
        name: 'Pole',
        amount: 1
    }, {
        name: 'Wooden Blade',
        amount: 1
    }]
}];