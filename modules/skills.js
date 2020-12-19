import { attributes, findAttributeLevel, updateAttributes} from './attributes.js';
import { basicMaterials } from './items/basicMaterials.js';
import { createCraftScreen } from './createCraftScreen.js';
import { craftableItems } from './items/craftableItems.js';
import { craftingMaterials } from './items/craftingMaterials.js';
import { Player, playerFind } from './player.js';
import { levelUpSkill } from './levelUpSkill.js';

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
        XPPerSuccess: 25,
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
        requirements: [{
            name: 'Foraging',
            level: 5
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
        requirements: [{
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
        requirements:[{
            name: 'Farming',
            level: 5
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'LUC'
    }, {
        name: 'Crafting',
        type: ['INT', 'AGI', 'LOG'],
        level: 0,
        active: false,
        requirements: [{
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
            // createCraftScreen(craftingMaterials);
        }
    },
    {
        name: 'Hunting',
        type: ['INT', 'AGI', 'LOG'],
        level: 0,
        active: false,
        requirements: [{
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

function updateSkills() {
    let skillDiv = document.getElementById('skills');

    let activeSkills = skills.filter(skill => skill.active === true);
    for(let skill of activeSkills) {
        if(!document.getElementById(skill.name)) {

            let wrapper = document.createElement('div');
            let elementText = skill.name.replace(/\s/g, ' ') + '</br>Level ' + skill.level + '</br>' + skill.currentXP + '/' + skill.XPToLevel;
            let newElement;

            if(skill.uniqueSkill) {
                let element = document.createElement('span');
                element.id = skill.name;
                element.classList.add('skill');
                elementText = elementText + '</br>Click me'
                element.onclick = function() {
                    skill.uniqueSkillFunction();
                }
                newElement = element;
            } else {
                let element = document.createElement('button');
                element.id = skill.name;
                element.classList.add('skill');
                element.onclick = function() {
                    let level;
                    skill.currentXP += (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
                    //If the current skill xp is higher than it takes to level, it goes through a while loop
                    //it immediately levels the skill, then will check if additional levels are needed 
                    //(eg, if the XPSuccess is higher than the xptolevel)
                    if(skill.currentXP > skill.XPToLevel) {
                        let level = true;
                        while(level) {
                            levelUpSkill(skill)
                            if(skill.currentXP < skill.XPToLevel) {
                                level = false;
                            }
                        }
                    }
                    
                    if(skill.specialSuccessFunction) {
                        skill.specialSuccessFunction();
                    }
                    element.innerHTML = skill.name.replace(/\s/g, ' ') + '</br>Level ' + skill.level + '</br>' + skill.currentXP + '/' + skill.XPToLevel;
                }
                newElement = element;
            }

            newElement.innerHTML = elementText;
            wrapper.id = skill.name + 'Div';
            wrapper.classList.add('skillDiv')
            wrapper.appendChild(newElement)

            if(!skill.uniqueSkill) {
                skillDiv.appendChild(wrapper);
            } else {
                let rightSide = document.getElementById('right');
                if(!document.getElementById('uniqueSkillHeader')) {
                    let header = document.createElement('h3');
                    header.innerHTML = 'Unique Skills';
                    header.id = 'uniqueSkillHeader';
                    rightSide.appendChild(header);
                }
                if(!document.getElementById('uniqueSkills')) {
                    let uniqueSkillDiv = document.createElement('div');
                    uniqueSkillDiv.id = 'uniqueSkills';
                    rightSide.appendChild(uniqueSkillDiv);
                }
                document.getElementById('uniqueSkills').appendChild(wrapper);
            }
            
        } else {
            let text = skill.name.replace(/\s/g, ' ') + '</br>Level ' + skill.level + '</br>' + skill.currentXP + '/' + skill.XPToLevel;
            if(skill.uniqueSkill) {
                text += '</br> Click me'
            }
            document.getElementById(skill.name).innerHTML = text;
            
        }
    }
};

function checkNextSkills() {
    //might be useful to have an array of active skills to match against, and update that container
    //instead of constantly calling filter when this is checked
    let checkUnavailableSkills = skills.filter(skill => skill.active === false);
    let checkAvailableSkills = skills.filter(skill => skill.active === true);
    //iterates through every skill that is unavailable
    for(let skill of checkUnavailableSkills) {
        //if the skill has more than 1 requirement, common for later skills
        if(skill.requirements.length > 1) {
            //this container will hold TRUE items
            //this container length will be checked against the skill requirements
            let skillArr = [];

            //first, iterate through the requirements of the skill
            for(let reqSkill of skill.requirements) {
                //then iterate through the available skills (that is, skills that are set to ACTIVE)
                for(let availSkill of checkAvailableSkills) {
                    //if the required skill matches in name and level, then push TRUE into skillArr array
                    if(reqSkill.name === availSkill.name && availSkill.level >= reqSkill.level) {
                        skillArr.push(true)
                    }                    
                }
            }
            //this checks the skillArr container, to see if all the skills are available
            if(skillArr.length === skill.requirements.length) {
                skill.active = true;
                skill.level = 1;
            }
        } 
        //if the skill only has 1 requirement.
        //single requirements are still in an array, just in case I need to change skills later
        else {
            for(let reqSkill of checkAvailableSkills) {
                if(reqSkill.name === skill.requirements[0].name && reqSkill.level >= skill.requirements[0].level) {
                    skill.active = true;
                    skill.level = 1;
                }
            }            
        }
    }
}

export { skills, updateSkills, checkNextSkills }

//name = obviously the name of the skill
//type = what attribute it fits under, eg Mechanics is intelligence
//level = what level the skill is at
//requirements = if the skill requires previous skills
    // if so, then each requirement has a {name: X}, where is is skill name
    //and {level: Y} where Y is the level the skill requires to be upgraded
    //{name: X, level: Y}
//active = whether or not the skill is active. default is false, with level being 0 too