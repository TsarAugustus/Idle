import { skills } from './modules/skills.js';
import { attributes } from './modules/attributes.js';
import { items, findItem } from './modules/items.js';
import { Player, playerFind } from './modules/player.js';

let currentFocus;

function levelUpSkill(skill) {
    skill.level++;
    skill.XPToLevel = Math.round(skill.XPToLevel * 1.6);
    if(skill.level >= 2 & !document.getElementById(skill.name + 'Focus')) {
        let element = document.createElement('button');
        element.id = skill.name + 'Focus';
        element.innerHTML = 'Focus on ' + skill.name
        element.onclick = function() {
            console.log('focusing on ', skill)
            currentFocus = skill;
        }
        document.getElementById(skill.name + 'Div').appendChild(element)

    }
    let primaryAttributes = attributes.filter(type => type.type === 'Primary');
    for(let attribute of primaryAttributes) {
        for(let skillAttribute of skill.type) {
            if(skillAttribute === attribute.name) {
                attribute.level = attribute.level + Math.round((skill.level / skill.type.length) / 4);
                updateAttributes();
            }
        }
    }
}

function updateSkills() {
    let skillDiv = document.getElementById('skills');
    let activeSkills = skills.filter(skill => skill.active === true);
    for(let skill of activeSkills) {
        if(!document.getElementById(skill.name)) {
            let wrapper = document.createElement('div');
            let element = document.createElement('button');
            let elementText = skill.name + ' Level: ' + skill.level + '</br>CurrentXP/XPToLevel/XPPerSuccess</br>' + skill.currentXP + '/' + skill.XPToLevel + '/' + skill.XPPerSuccess;
            
            element.id = skill.name;
            element.innerHTML = elementText;
            element.onclick = function() {
                skill.currentXP = skill.currentXP + skill.XPPerSuccess
                element.innerHTML = skill.name + ' Level: ' + skill.level + '</br>CurrentXP/XPToLevel/XPPerSuccess</br>' + skill.currentXP + '/' + skill.XPToLevel + '/' + skill.XPPerSuccess;;
                if(skill.currentXP >= skill.XPToLevel) {
                    levelUpSkill(skill);
                }
            }
            wrapper.id = skill.name + 'Div';
            wrapper.appendChild(element)
            skillDiv.appendChild(wrapper);
        }
    }
}

function updateAttributes() {
    if(document.getElementById('Primary') || document.getElementById('Secondary')) {
        document.getElementById('Primary').remove();
        document.getElementById('Secondary').remove();
    }

    let attributeDiv = document.getElementById('attributes');
    let primaryDiv = document.createElement('div');
    primaryDiv.id = 'Primary';
    let secondaryDiv = document.createElement('div');
    secondaryDiv.id = 'Secondary';
    for(let attribute of attributes) {
        let element = document.createElement('span');
        if(attribute.type === 'Primary') {
            element.innerHTML = attribute.name + '/' + attribute.level + '|';
            primaryDiv.appendChild(element);
        } else if(attribute.type === 'Secondary') {
            attribute.level = attribute.calculate();
            element.innerHTML = attribute.name + '/' + attribute.level + '|';
            secondaryDiv.appendChild(element);
        }
    }
    attributeDiv.appendChild(primaryDiv);
    attributeDiv.appendChild(secondaryDiv);
}

function updateInventory() {
    let inventoryDiv = document.getElementById('inventory');
    console.log(Player.items)
}

function update() {
    updateSkills();
    updateAttributes();
    updateInventory();
    checkNextSkills();
    if(currentFocus) {
        document.getElementById(currentFocus.name).click();
    }
}

function init() {
    update();
}

init();

function checkNextSkills() {
    let checkUnavailableSkills = skills.filter(skill => skill.active === false);
    let checkAvailableSkills = skills.filter(skill => skill.active === true);
    for(let skill of checkUnavailableSkills) {
        for(let req of skill.requirements) {
            for(let availSkill of checkAvailableSkills) {
                if(availSkill.name === req.name && availSkill.level >= req.level) {
                    skill.active = true;
                    skill.level = 1;
                    updateSkills();
                }
            }
        }
    }
}

function craftItem(item) {
    //to craft an item, it merely will check if the player has its REQUIRES 
    let newItemInventory = [];
    console.log('Finding item in Items module')
    let thisItem = findItem(item);
    console.log(thisItem)
    for(let req of thisItem.requires) {
        console.log('Finding required items for item')
        let reqItem = playerFind(req.name);
        console.log('Checking if Player has enough')
        if(reqItem.amount >= req.amount) {
            console.log('Player has enough for this item')
            newItemInventory.push({
                name: req.name,
                amount: reqItem.amount - req.amount
            });
        }
    }
    console.log(newItemInventory)
    if(thisItem.requires.length === newItemInventory.length) {
        console.log('Replacing inventory slots')
        for(let newItem of newItemInventory) {
            console.log('Replacing slot ', newItem)
            playerFind(newItem.name).amount = newItem.amount;

        }
        if(!playerFind(thisItem.name)) {
            console.log('Doesnt exist')
            Player.items.push({
                name: thisItem.name,
                amount: 1
            });
            console.log('Now exists? ', Player.items)
        } else {
            console.log('Exists!');
            playerFind(thisItem.name).amount++;
        }
    } else {
        console.log('no good')
    }
    console.log(Player.items)
    
}

//game tick
setInterval(function() {
    // checkNextSkills();
    update();
    // craftItem('Fishing Pole');
    // console.log(attributes)
}, 1000);


//Random stuff that popped into my head that I may want to look at later

//hypothermia
//body temperature
//debuffs for cold

//shelter
//water
//fire
//food

//self actualization
//prestige, feeling of accomplishment
//intimate relationships, friends
//security, safety
//food, water, warmth, rest


//only one skill may be specialized at a time
//a skills base xp may be enhanced with its corrosponding item
//eg, the falcrony skill falcons<hatchery<falconEggs<forage(eggs)
//eg, animalHusbandry skill animals<pen<male&female animals
//eg, hunting skill projectile(type)<projectileLauncher
//eg, fishing skill fishingPole<pole(wooden)&&fishingLine<thread(silk,nylon, etc)