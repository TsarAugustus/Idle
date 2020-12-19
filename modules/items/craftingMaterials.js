export let craftingMaterials = [{
    name: 'Pole',
    type: 'Solid',
    itemType: 'Material',
    special: {
        XPReturn: 5
    },
    requires: [{
        name: 'Wood',
        amount: 1
    }]
}, {
    name: 'Thread',
    type: 'Tensile',
    itemType: 'Material',
    special: {
        XPReturn: 5
    },
    requires: [{
        name: 'Silk',
        amount: '2'
    }]
}]