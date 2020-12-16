import { skills } from './modules/skills.js';
import { attributes, updateAttributes } from './modules/attributes.js';

function findSkillName(name) {
    return skills.find(function(skill) {
        if(skill.name === name) {
            return skill;
        }
    });
}

function checkIfSkillIsAvailable(name) {
    let skillName = findSkillName(name);
    
    let skillActive  = skillName.requirements.filter(function(skillReq) {
        let checkActiveStatus = findSkillName(skillReq.name);

        if(checkActiveStatus.active && checkActiveStatus.level >= skillReq.level) {
            return true;
        } else {
            return false;
        }
    });
    
    if(skillName.requirements.length === skillActive.length) {
        return true;
    } else {
        return false;
    }
}

function levelAttribute(attribute) {
    attribute.level++;
    updateAttributes();
    for(let attr of attributes) {
        let attributeHtml = document.getElementById(attr.name);
        attributeHtml.innerHTML = attr.name + ' / ' + attr.level;
    }
}

function init() {
    let attributeDiv = document.getElementById('attributes');
    let primaryAttributes = attributes.filter(attr => attr.type === 'Primary');
    for(let attribute of primaryAttributes) {
        let wrapper = document.createElement('div');

        let element = document.createElement('span');
        element.innerHTML = attribute.name + ' / ' + attribute.level;
        element.id = attribute.name;
        wrapper.appendChild(element);

        let button = document.createElement('button');
        button.innerHTML = 'Increase ' + attribute.name;
        button.onclick = function() {
            levelAttribute(attribute);
        }
        wrapper.appendChild(button);
        attributeDiv.appendChild(wrapper)
    }
    
    let secondaryAttributes = attributes.filter(attr => attr.type === 'Secondary');
    for(let attribute of secondaryAttributes) {
        let wrapper = document.createElement('div');

        let element = document.createElement('span');
        element.innerHTML = attribute.name + ' / ' + attribute.level + '</br>';
        element.id = attribute.name;
        wrapper.appendChild(element);
        attributeDiv.appendChild(wrapper);
    }
}
init();

//game tick
setInterval(function() {
    // console.log(attributes)
}, 1000);


//hypothermia
//body temperature
//debuffs for cold

//shelter
//water
//fire
//food



/////////////////////


//self actualization
//prestige, feeling of accomplishment
//intimate relationships, friends
//security, safety
//food, water, warmth, rest