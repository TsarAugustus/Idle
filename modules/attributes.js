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

function findAttributeLongName(attributeName) {
    return attributes.find(attr => attr.name === attributeName).longName;
}

function findAttributeLevel(attributeName) {
    return attributes.find(attr => attr.name === attributeName).level;
}

function updateAttributes(skill) {
    //the SKILL arguement is passed on levelup, otherwise it initializes the attributes from init. 
    if(skill) {
        for(let type of skill.type) {
            document.getElementById(type).innerHTML = findAttributeLongName(type) + '/' + findAttributeLevel(type);
        }
        //This should be handled better, but as it stands, I don't have a way of knowing which secondary attributes need to be updated
        //TODO: fix this to be better
        let secondaryAttributes = attributes.filter(attribute => attribute.type === 'Secondary');
        for(let secondaryAttribute of secondaryAttributes) {
            secondaryAttribute.level = secondaryAttribute.calculate();
            document.getElementById(secondaryAttribute.name).innerHTML = secondaryAttribute.longName + '/' + secondaryAttribute.level;
        }
    } else {
        //this is the initialization of attributes
        //only gets called once  
        let attributeDiv = document.getElementById('attributes');
    
        let primaryDiv = document.createElement('div');
        let secondaryDiv = document.createElement('div');
        primaryDiv.id = 'Primary';
        secondaryDiv.id = 'Secondary';
    
        //applys a header to the div
        let primaryHeader = document.createElement('h3');
        primaryHeader.innerHTML = 'Primary Attributes'
        primaryDiv.appendChild(primaryHeader);
        let secondaryHeader = document.createElement('h3');
        secondaryHeader.innerHTML = 'Secondary Attributes'
        secondaryDiv.appendChild(secondaryHeader);
    
        //iterate through primary/secondary attributes
        //order them in the proper div according to the type
        //could be handled a bit more redundently
        for(let attribute of attributes) {
            let element = document.createElement('span');
            if(attribute.type === 'Primary') {
                element.innerHTML = attribute.longName + '/' + attribute.level;
                element.id = attribute.name;
                primaryDiv.appendChild(element);
            } else if(attribute.type === 'Secondary') {
                attribute.level = attribute.calculate();
                element.innerHTML = attribute.longName + '/' + attribute.level;
                element.id = attribute.name;
                secondaryDiv.appendChild(element);
            }
        }
        //appends the divs
        attributeDiv.appendChild(primaryDiv);
        attributeDiv.appendChild(secondaryDiv);
    }
}

export { attributes, findAttributeLevel, findAttributeLongName, updateAttributes};