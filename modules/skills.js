import { attributes, findAttributeLevel, updateAttributes} from './attributes.js';
import { basicMaterials } from './items/basicMaterials.js';
import { createCraftScreen } from './createCraftScreen.js';
import { craftableItems } from './items/craftableItems.js';
import { craftingMaterials } from './items/craftingMaterials.js';
import { Player, playerFind } from './player.js';
import { levelUpSkill } from './levelUpSkill.js';
import { update } from '../main.js';

//This will need to be broken up soon, into smaller pieces
let skills = [
    //Basic skills, little or no previous requirements
    {
        name: 'Foraging',
        type: ['INT', 'AGI'],
        level: 1,
        active: true,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'WIL',
        specialSuccessFunction: function() {
            let item = basicMaterials[Math.floor(Math.random() * basicMaterials.length)]
            if(!playerFind(item.name)) {
                Player.items.push({
                    name: item.name,
                    amount: Math.random() * 1,
                    itemType: item.itemType
                });
            } else {
                playerFind(item.name).amount += Math.random() * 1;
            }
        }
    }, {
        name: 'Farming',
        type: ['WIL', 'STR', 'AGI'],
        level: 0,
        skillRequirements: [{
            name: 'Foraging',
            level: 2
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'SPE',
    }, {
        name: 'Animal Husbandry',
        type: ['END', 'STR', 'AGI'],
        level: 0,
        skillRequirements: [{
            name: 'Farming',
            level: 7
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'LOG'
    }, {
        name: 'Fishing',
        type: ['END', 'STR', 'LUC'],
        level: 0,
        skillRequirements:[{
            name: 'Farming',
            level: 5
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'LUC'
    },{
        name: 'Flyfishing',
        type: ['END', 'STR', 'LUC'],
        level: 0,
        skillRequirements:[{
            name: 'Fishing',
            level: 5
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'LUC'
    },{
        name: 'Crafting',
        type: ['INT', 'AGI', 'LOG'],
        level: 0,
        active: false,
        skillRequirements: [{
            name: 'Foraging',
            level: 2
        }],
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'SPE',
        uniqueSkill: true,
        uniqueSkillFunction: function() {
            createCraftScreen([craftableItems, craftingMaterials]);
        }
    },
    {
        name: 'Hunting',
        type: ['INT', 'AGI', 'LOG'],
        level: 0,
        active: false,
        skillRequirements: [{
            name: 'Foraging',
            level: 5
        }, {
            name: 'Farming',
            level: 5
        }],
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'SPE'
    }
];

function checkNextSkills() {
    //might be useful to have an array of active skills to match against, and update that container
    //instead of constantly calling filter when this is checked
    let checkUnavailableSkills = skills.filter(skill => skill.active === false);
    let checkAvailableSkills = skills.filter(skill => skill.active === true);
    //iterates through every skill that is unavailable
    for(let skill of checkUnavailableSkills) {
        //this container will hold TRUE items
        //this container length will be checked against the skill skillRequirements
        let arrayToMatch = [];

        //this is the number the arrayToMatch has to match against
        //it is the sum of itemrequirements and skillrequirements
        let numToMatch = 0;
        if(skill.itemRequirements) {
            numToMatch += skill.itemRequirements.length;
            for(let reqItem of skill.itemRequirements) {
                for(let item of Player.items) {
                    if(item.name === reqItem.name && item.amount >= reqItem.amount) {
                        arrayToMatch.push(true);
                    }
                }
            }
        }

        if(skill.skillRequirements) {
            numToMatch += skill.skillRequirements.length;
            //first, iterate through the skillRequirements of the skill
            for(let reqSkill of skill.skillRequirements) {
                //then iterate through the available skills (that is, skills that are set to ACTIVE)
                for(let availSkill of checkAvailableSkills) {
                    //if the required skill matches in name and level, then push TRUE into skillArr array
                    if(reqSkill.name === availSkill.name && availSkill.level >= reqSkill.level) {
                        arrayToMatch.push(true)
                    }                    
                }
            }
        }
        //this checks the skillArr container, to see if all the skills are available
        if(arrayToMatch.length === numToMatch) {
            skill.active = true;
            skill.level = 1;
        }
      
    }
}


function incrementSkill(skillInformation) {
    let level  = false;
    skillInformation.currentXP += (skillInformation.XPPerSuccess + findAttributeLevel(skillInformation.XPAttributeInc));

    if(skillInformation.currentXP >= skillInformation.XPToLevel) { 
        level = true;
    }
    while(level) {
        levelUpSkill(skillInformation)
        if(skillInformation.currentXP <= skillInformation.XPToLevel) {
            level = false;
        }
    }

    if(skillInformation.specialSuccessFunction) {
        skillInformation.specialSuccessFunction();
    }

    // update();
}

function updateProgressBar(skillInformation) {
    let progressWidth = (skillInformation.currentXP / skillInformation.XPToLevel) * 100;
    let progressBar = document.getElementById(skillInformation.name + 'ProgressBar');
    progressBar.style.width = progressWidth + "%";
}

function makeUniqueElementText(skillInformation) {
    return 'Open ' + skillInformation.name.replace(/\s/g, ' ') + '</br>Level ' + skillInformation.level + '</br>' + skillInformation.currentXP + '/' + skillInformation.XPToLevel;
}

function makeRegularElementText(skillInformation) {
    return skillInformation.name.replace(/\s/g, ' ') + '</br>Level ' + skillInformation.level + '</br>' + skillInformation.currentXP + '/' + skillInformation.XPToLevel;
}

function makeSkillDiv(skillsToMake) {
    let thisSkill = skillsToMake[0];
    if(!document.getElementById(thisSkill.name + 'Wrapper')) {
        let wrapper = document.createElement('div');
        wrapper.id = thisSkill.name + 'Wrapper';
        wrapper.classList.add('skill');

        let element = document.createElement('span');
        let elementText = '';
        element.id = thisSkill.name;
        if(thisSkill.uniqueSkill) {
            elementText = makeUniqueElementText(thisSkill);
            element.onclick = function() {
                thisSkill.uniqueSkillFunction();
                element.innerHTML = makeUniqueElementText(thisSkill);
            }
        } else {
            elementText = makeRegularElementText(thisSkill);
            element.onclick = function() {
                incrementSkill(thisSkill);
                element.innerHTML = makeRegularElementText(thisSkill);
                updateProgressBar(thisSkill);
            }
        }
        element.innerHTML = elementText;
        document.getElementById('skills').appendChild(wrapper);
        document.getElementById(thisSkill.name + 'Wrapper').appendChild(element);

        let progressBar = document.createElement('div');
        progressBar.id = thisSkill.name + 'ProgressBar';
        progressBar.classList.add('progressBar');
        wrapper.appendChild(progressBar);
    }

    skillsToMake.shift();
    if(skillsToMake.length != 0) {
        makeSkillDiv(skillsToMake)
    }

}

function makeAttributeDiv(primaryAttributes) {
    if(!document.getElementById('attributeSkillDivWapper')) {
        const skillDiv = document.getElementById('skills');
        let wrapper = document.createElement('div');
        wrapper.id = 'attributeSkillDivWapper';
        skillDiv.appendChild(wrapper);
    }
    const skillAttributeWrapper = document.getElementById('attributeSkillDivWapper');
    const thisAttribute = primaryAttributes[0];
    let element = document.createElement('button');
    element.id = thisAttribute.name + 'AttributeWrapper';
    element.classList.add('attributeSkillDiv');
    element.innerHTML = thisAttribute.name;
    element.onclick = function() {
        let previousSkillWrappers = document.getElementsByClassName('skill');
        while(previousSkillWrappers[0]) {
            previousSkillWrappers[0].parentNode.removeChild(previousSkillWrappers[0])
        }
        let skillFilter = skills.filter(skill => skill.type[0] === thisAttribute.name);
        makeSkillDiv(skillFilter);
    }
    skillAttributeWrapper.appendChild(element);
    primaryAttributes.shift();

    if(primaryAttributes.length > 0) {
        makeAttributeDiv(primaryAttributes)
    }
}

function updateSkills() {
    const primaryAttributes = attributes.filter(attribute => attribute.type === 'Primary');
    makeAttributeDiv(primaryAttributes)
}

export { skills, updateSkills, checkNextSkills, makeUniqueElementText }