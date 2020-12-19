import { attributes, findAttributeLevel, updateAttributes} from './attributes.js';
import { craftItem } from './items.js';
import { basicMaterials } from './items/basicMaterials.js';
import { craftableItems } from './items/craftableItems.js';
import { Player, playerFind } from './player.js';
import { focusList, focusAmount } from '../main.js';

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
        XPAttributeInc: 'SPE'
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
            if(document.getElementById('interaction')) {
                let interaction = document.getElementById('interaction');
                while (interaction.hasChildNodes()) {
                    interaction.removeChild(interaction.lastChild);
                }
                interaction.remove();
            }

            let interactiveSkillDiv = document.getElementById('interactiveSkill');
            let wrapper = document.createElement('div');
            wrapper.id = 'interaction';
            for(let craftableItem of craftableItems) {
                if(!document.getElementById(craftableItem.name.replace(/\s/g, '') + 'CraftButton')) {
                    let element = document.createElement('button');
                    element.id = craftableItem.name.replace(/\s/g, '') + 'CraftButton';
                    element.name = craftableItem.name.replace(/\s/g, '-');
                    let elementText = craftableItem.name;
                    for(let reqItem of craftableItem.requires) {
                        elementText += '</br>' + reqItem.name + '/' + reqItem.amount;
                    }
                    element.innerHTML = elementText;
                    element.onclick = function() {
                        if(craftItem(craftableItem.name)) {
                            let crafting = skills.find(skill => skill.name === 'Crafting')
                            crafting.currentXP += crafting.XPPerSuccess;
                            if(crafting.currentXP >= crafting.XPToLevel) {
                                levelUpSkill(crafting);
                            }

                        }
                        // craftItem(craftableItem.name);
                    }
                    wrapper.appendChild(element);
                }
            }
            interactiveSkillDiv.appendChild(wrapper)
            // return 'hi'
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

//this function is called when a skill levels up, from the updateSkills function
function levelUpSkill(skill) {
    //level up the skill, and apply a new XPToLevel
    skill.level++;
    skill.XPToLevel = Math.round(skill.XPToLevel * 1.6);

    //this is the element for the focus buttons
    // the '2' here is arbitrary, and must be switched for something better later
    //this is just for prototyping
    if(skill.level >= 2 & !document.getElementById(skill.name + 'UnFocus') && !document.getElementById(skill.name + 'Focus')) {
        //create the focus button next to each skill
        let focusElement = document.createElement('button');
        focusElement.id = skill.name + 'Focus';
        focusElement.classList.add('focusElement');
        focusElement.innerHTML = 'Focus';
        //the onclick function checks if the skill exists in the focus list
        //if it does, it doesnt apply the focus, as it is already being focused
        //likewise, if it doesnt exists, it pushes the skill to the focus list
        focusElement.onclick = function() {
            let focusListSkill = focusList.find(skillItem => skillItem.name === skill.name);
            if(!focusListSkill && focusList.length < focusAmount) {
                focusList.push(skill);
                document.getElementById(skill.name).classList.add('focus');

                this.parentNode.removeChild(focusElement)
                //the unfocus button
                let unFocusElement = document.createElement('button');
                unFocusElement.id = skill.name + 'UnFocus';
                unFocusElement.classList.add('UnfocusElement');
                unFocusElement.innerHTML = 'Unfocus';
                unFocusElement.onclick = function() {
                    for(let focusedSkill in focusList) {
                        if(focusList[focusedSkill].name === skill.name) {
                            //remove the focus class
                            document.getElementById(skill.name).classList.remove('focus');
                            //remove this item from the focuslist
                            focusList.splice(focusedSkill, 1);
                            //this is used to remove the unfocus button from the screen
                            document.getElementById(skill.name + 'Div').appendChild(focusElement);
                            this.parentNode.removeChild(this);
                        }
                    }
                }
                //apply the unfocus element to the screen
                document.getElementById(skill.name + 'Div').appendChild(unFocusElement);
            }
        }
        //add the focus element to the screen
        document.getElementById(skill.name + 'Div').appendChild(focusElement);

    }

    //update the attributes, as a new skill has leveled up as well
    let primaryAttributes = attributes.filter(type => type.type === 'Primary');
    for(let attribute of primaryAttributes) {
        for(let skillAttribute of skill.type) {
            if(skillAttribute === attribute.name) {
                attribute.level = attribute.level + Math.round((skill.level / skill.type.length) / 4);  
            }
        }
    }
    updateAttributes(skill); 
}

function updateSkills() {
    let skillDiv = document.getElementById('skills');

    let activeSkills = skills.filter(skill => skill.active === true);
    for(let skill of activeSkills) {
        if(!document.getElementById(skill.name)) {

            let wrapper = document.createElement('div');
            let elementText = skill.name.replace(/\s/g, '</br>') + '</br>Level ' + skill.level + '</br>' + (skill.XPToLevel - skill.currentXP) + '/' + (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
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
                    element.innerHTML = skill.name.replace(/\s/g, '</br>') + '</br>Level ' + skill.level + '</br>' + (skill.XPToLevel - skill.currentXP) + '/' + (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
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
            let text = skill.name.replace(/\s/g, '</br>') + '</br>Level ' + skill.level + '</br>' + (skill.XPToLevel - skill.currentXP) + '/' + (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
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