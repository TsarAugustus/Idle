let attributes = [
//primary attributes
{
    name: 'STR',
    level: 1,
    type: 'Primary'
}, {
    name: 'AGI',
    level: 1,
    type: 'Primary'
}, {
    name: 'END',
    level: 1,
    type: 'Primary'
}, {
    name: 'INT',
    level: 1,
    type: 'Primary'
}, {
    name: 'LOG',
    level: 1,
    type: 'Primary'
}, {
    name: 'WIL',
    level: 1,
    type: 'Primary'
}, {
    name: 'CHA',
    level: 1,
    type: 'Primary'
}, {
    name: 'LUC',
    level: 1,
    type: 'Primary'
}, {
    name: 'REP',
    level: 1,
    type: 'Primary'
}];

//secondary attributes are calculated after
let secondary = [{
    name: 'HEA',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('END') + findAttributeLevel('WIL');
    }
}, {
    name: 'SPE',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('STR') + findAttributeLevel('AGI');
    }
}, {
    name: 'JUM',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('AGI') + findAttributeLevel('AGI');
    }
}, {
    name: 'CAR',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return (findAttributeLevel('STR') + findAttributeLevel('END')) * 10;
    }
}, {
    name: 'INI',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('INT');
    }
}, {
    name: 'DEM', //defense melee
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('STR'), Math.max(findAttributeLevel('AGI')));
    }
}, {
    name: 'DER', //ranged defense
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('AGI');
    }
}, {
    name: 'DEN', //mental defense
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('CHA'), findAttributeLevel('WIL'))
    }
}, {
    name: 'DEV', //defense vital
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('END');
    }
}, {
    name: 'ATM', //melee attack
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('STR'), findAttributeLevel('AGI'));
    }
}, {
    name: 'ATR', //ranged attack
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('AGI'), findAttributeLevel('INT'))
    }
}];

function findAttributeLevel(attributeName) {
    let attribute = attributes.find(function(attr) {
        return attr.name === attributeName
    });
    return attribute.level;
}


for(let att in secondary) {
    attributes.push(secondary[att]);
}
export { attributes };