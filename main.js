import { skills } from './modules/skills.js';
import { attributes } from './modules/attributes.js';

function levelUpSkill(skill) {
    skill.level++;
    skill.XPToLevel = skill.XPToLevel * 2;
    let primaryAttributes = attributes.filter(type => type.type === 'Primary');
    for(let attribute of primaryAttributes) {
        for(let skillAttribute of skill.type) {
            if(skillAttribute === attribute.name) {
                attribute.level = attribute.level + Math.round((skill.level / skill.type.length) / 2);
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
            skillDiv.appendChild(element);
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

function update() {
    updateSkills();
    updateAttributes();
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

//game tick
setInterval(function() {
    checkNextSkills();
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