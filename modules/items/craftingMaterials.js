export let craftingMaterials = [{
    name: 'Thread',
    type: 'Tensile',
    itemType: 'Material',
    filter: 'General',
    special: {
        XPReturn: 5
    },
    requires: [{
        name: 'Silk',
        amount: '2'
    }]
}, {
    name: 'Wooden Blade',
    filter: 'Wood',
    itemType: 'Material',
    special: {
        XPReturn: 10
    },
    requires: [{
        name: 'Wood',
        amount: 1
    }]
}]