let attributes = [
//primary attributes
{
    name: 'STR',
    longName: 'Strength',
    level: 1,
    type: 'Primary'
}, {
    name: 'AGI',
    longName: 'Agility',
    level: 1,
    type: 'Primary'
}, {
    name: 'END',
    longName: 'Endurance',
    level: 1,
    type: 'Primary'
}, {
    name: 'INT',
    longName: 'Intuition',
    level: 1,
    type: 'Primary'
}, {
    name: 'LOG',
    longName: 'Logic',
    level: 1,
    type: 'Primary'
}, {
    name: 'WIL',
    longName: 'Will Power',
    level: 1,
    type: 'Primary'
}, {
    name: 'CHA',
    longName: 'Charisma',
    level: 1,
    type: 'Primary'
}, {
    name: 'LUC',
    longName: 'Luck',
    level: 1,
    type: 'Primary'
}, {
    name: 'REP',
    longName: 'Reputation',
    level: 1,
    type: 'Primary'
}];

//secondary attributes are calculated after
let secondary = [{
    name: 'HEA',
    longName: 'Health',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('END') + findAttributeLevel('WIL');
    }
}, {
    name: 'SPE',
    longName: 'Speed',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('STR') + findAttributeLevel('AGI');
    }
}, {
    name: 'JUM',
    longName: 'Jumping',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('AGI') + findAttributeLevel('AGI');
    }
}, {
    name: 'CAR',
    longName: 'Carry Weight',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return (findAttributeLevel('STR') + findAttributeLevel('END')) * 10;
    }
}, {
    name: 'INI',
    longName: 'Initiative',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('INT');
    }
}, {
    name: 'DEM', //defense melee
    longName: 'Melee Defense',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('STR'), Math.max(findAttributeLevel('AGI')));
    }
}, {
    name: 'DER', //ranged defense
    longName: 'Ranged Defense',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('AGI');
    }
}, {
    name: 'DEN', //mental defense
    longName: 'Mental Defense',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('CHA'), findAttributeLevel('WIL'))
    }
}, {
    name: 'DEV', //defense vital
    longName: 'Vital Defense',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return findAttributeLevel('END');
    }
}, {
    name: 'ATM', //melee attack
    longName: 'Melee Attack',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('STR'), findAttributeLevel('AGI'));
    }
}, {
    name: 'ATR', //ranged attack
    longName: 'Ranged Attack',
    level: undefined,
    type: 'Secondary',
    calculate: function() {
        return Math.max(findAttributeLevel('AGI'), findAttributeLevel('INT'))
    }
}];


for(let att in secondary) {
    attributes.push(secondary[att]);
}

function findAttributeLevel(attributeName) {
    return attributes.find(attr => attr.name === attributeName).level;
}

export { attributes, findAttributeLevel};