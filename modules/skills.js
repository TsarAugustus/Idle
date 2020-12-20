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

function updateSkills() {
    let skillDiv = document.getElementById('skills');

    let activeSkills = skills.filter(skill => skill.active === true);
    for(let skill of activeSkills) {
        if(!document.getElementById(skill.name)) {
            let wrapper = document.createElement('div');
            let elementText = skill.name.replace(/\s/g, ' ') + '</br>Level ' + skill.level + '</br>' + skill.currentXP + '/' + skill.XPToLevel;;
            let element = document.createElement('button');
            element.id = skill.name;
            if(skill.uniqueSkill) {
                element.classList.add('uniqueSkill');
                elementText = 'Open ' + elementText;
                element.onclick = function() {
                    skill.uniqueSkillFunction();
                }
            } else {
                element.onclick = function() {                    
                    skill.currentXP += (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
                    //If the current skill xp is higher than it takes to level, it goes through a while loop
                    //it immediately levels the skill, then will check if additional levels are needed 
                    //(eg, if the XPSuccess is higher than the xptolevel)
                    if(skill.currentXP >= skill.XPToLevel) {
                        let level = true;
                        while(level) {
                            levelUpSkill(skill)
                            if(skill.currentXP <= skill.XPToLevel) {
                                level = false;
                            }
                        }
                    }

                    if(skill.specialSuccessFunction) {
                        skill.specialSuccessFunction();
                    }

                    update();
                }
            }
            let progressBar = document.createElement('div');
            progressBar.id = skill.name + 'ProgressBar';
            progressBar.classList.add('progressBar');
            element.innerHTML = elementText;
            element.classList.add('skill');
            wrapper.id = skill.name + 'Div';
            wrapper.classList.add('skillDiv');
            wrapper.appendChild(element);
            wrapper.appendChild(progressBar);
            skillDiv.appendChild(wrapper);
            
        } else {
            let text = '';
            if(skill.uniqueSkill) {
                text += 'Open ';
            }
            text += skill.name.replace(/\s/g, ' ') + '</br>Level ' + skill.level + '</br>' + skill.currentXP + '/' + skill.XPToLevel;
            document.getElementById(skill.name).innerHTML = text;
            
        }
        let progressWidth = (skill.currentXP / skill.XPToLevel) * 100;
        let progressBar = document.getElementById(skill.name + 'ProgressBar');
        progressBar.style.width = progressWidth + "%";
    }
};

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

export { skills, updateSkills, checkNextSkills }