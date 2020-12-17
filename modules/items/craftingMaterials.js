export let craftingMaterials = [{
    name: 'Pole',
    type: 'Solid',
    requires: [{
        name: '*',
        amount: 1
    }]
}, {
    name: 'Thread',
    type: 'Tensile',
    requires: [{
        name: '*',
        amount: 1
    }]
}, {
    name: 'Wool',
    type: 'Soft',
    requires: [{
        name: 'Sheep',
        amount: 1
    }]
}, {
    name: 'Ceramic',
    type: 'Solid',
    requires: [{
        name: '*-SoftKiln', //* marks anything can be used, but with the - modifier, it will use anything after that as additional filtering
        amount: 1           //because ceramic doesn't use solid materials for creation, it needs Soft and Kilnable items for creation
    }]
}, {
    name: 'Silk',
    type: 'Tensile',
    requires: [{
        name: null,
        amount: null
    }]
}, {
    name: 'Nylon',
    type: 'Tensile',
    requires: [{
        name: null,
        amount: null
    }]
}]