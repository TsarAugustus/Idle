import { attributes, findAttributeLevel } from './attributes.js';
import { basicMaterials } from './items/basicMaterials.js';
import { createCraftScreen } from './createCraftScreen.js';
import { craftableItems } from './items/craftableItems.js';
import { craftingMaterials } from './items/craftingMaterials.js';
import { Player, playerFind } from './player.js';
import { levelUpSkill } from './levelUpSkill.js';
import { focusList, focusAmount, updateStockpile } from '../main.js'

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
            let itemList = basicMaterials;
            for(let material of itemList) {
                // console.log(material)
                if(material.reqToolType && material.reqToolType != Player.items.filter(itemName => itemName.toolType === material.reqToolType)) {
                    let newBasicMaterials = itemList.filter(nBM => nBM.name != material.name);
                    itemList = newBasicMaterials;
                }
            }
            let item = itemList[Math.floor(Math.random() * itemList.length)];

            if(!playerFind(item.name)) {
                Player.items.push({
                    name: item.name,
                    amount: Math.random() * 1,
                    toolType: item.toolType
                });
            } else {
                console.log(item)
                let highestQualityTool = findHighestQualityTool(item.toolTypeInc);
                if(item.toolTypeInc && highestQualityTool != 0) {
                    playerFind(item.name).amount += Math.random() * highestQualityTool.toolQuality + 1;
                } else {
                    playerFind(item.name).amount += Math.random() * 1;
                }
            }
            updateStockpile(item);
        }
    }, {
        name: 'Farming',
        type: ['WIL', 'STR', 'AGI'],
        level: 0,
        itemRequirements: [{
            toolType: 'Hoe'
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
            level: 5
        }],
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50,
        XPAttributeInc: 'SPE',
        uniqueSkill: true,
        uniqueSkillFunction: function() {
            createCraftScreen([craftableItems, craftingMaterials]);
        },
        subCrafts: [{
            name: 'Woodcrafting',
            level: 0,
            currentXP: 0,
            XPToLevel: 50,
            type: ['INT', 'AGI', 'LOG'],
        }, {
            name: 'Stonecrafting',
            level: 0,
            currentXP: 0,
            XPToLevel: 160,
            type: ['STR', 'INT']
        }]
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
    },
    {
        name: 'Woodcutting',
        type: ['STR', 'END'],
        level: 0,
        active: false,
        itemRequirements: [{
            name: 'Handaxe',
            amount: 1
        }],
        currentXP: 0,
        XPToLevel: 160,
        XPPerSuccess: 50,
        XPAttributeInc: 'STR',
        specialSuccessFunction: function() {
            //TODO: make different types of wood that can be collected based on tooltype
            //currently is only bark and wood
            let highestQualityTool = findHighestQualityTool('Axe'); 
            let item;
            if(highestQualityTool.toolQuality < 2) {
                item = {
                    name: 'Bark',
                    type: 'Woodworking',
                    itemType: 'Basic'
                }
            } else {
                item = {
                    name: 'Wood',
                    type: 'Woodworking',
                    itemType: 'Woodcrafting'
                }
            }

            if(!playerFind(item.name)) {
                Player.items.push({
                    name: item.name,
                    amount: Math.random() * 1,
                    itemType: item.itemType,
                    type: item.type
                });
            } else {
                playerFind(item.name).amount += Math.random() * 1;
            }
            updateStockpile(item);
        }
    }
];

let activeAttributeWrapper;

function findHighestQualityTool(toolType) {
    let tool = Player.items.filter(el => el.toolType === toolType);
    let highestQualityTool = 0;
    if(toolType && tool.length > 0) {
        highestQualityTool = tool.reduce(function(a, b) {
            console.log(a, b)
            Math.max(a.toolQuality, b.toolQuality);
        });
    }
    return highestQualityTool;
}

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
                    if(!reqItem.name && reqItem.toolType === item.toolType) {
                        arrayToMatch.push(true)
                    }
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
                        arrayToMatch.push(true);
                    }                    
                }
            }
        }
        //this checks the skillArr container, to see if all the skills are available
        if(arrayToMatch.length === numToMatch) {
            skill.active = true;
            skill.level = 1;
            if(skill.type[0] === activeAttributeWrapper || activeAttributeWrapper === 'All') {
                makeSkillDiv([skill]);
            }
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

    if(skillInformation.uniqueSkill && document.getElementById(skillInformation.name)) {
        document.getElementById(skillInformation.name).innerHTML = makeUniqueElementText(skillInformation);
        updateProgressBar(skillInformation);
    } else if(document.getElementById(skillInformation.name)) {
        document.getElementById(skillInformation.name).innerHTML = makeRegularElementText(skillInformation);
        updateProgressBar(skillInformation);
    }
}

function updateProgressBar(skillInformation) {
    let progressBar = document.getElementById(skillInformation.name + 'ProgressBar');
    if(document.getElementById(skillInformation.name)) {
        if(!progressBar) {
            let progressBar = document.createElement('div');
            progressBar.id = skillInformation.name + 'ProgressBar';
            progressBar.classList.add('progressBar');
            document.getElementById(skillInformation.name).appendChild(progressBar);
        }
        let progressWidth = (skillInformation.currentXP / skillInformation.XPToLevel) * 100;
        progressBar.style.width = progressWidth + "%";
    }
}

function makeUniqueElementText(skillInformation) {
    return 'Open ' + skillInformation.name.replace(/\s/g, ' ') + '</br>Level ' + skillInformation.level + '</br>' + skillInformation.currentXP + '/' + skillInformation.XPToLevel;
}

function makeRegularElementText(skillInformation) {
    return skillInformation.name.replace(/\s/g, ' ') + '</br>Level ' + skillInformation.level + '</br>' + skillInformation.currentXP + '/' + skillInformation.XPToLevel;
}

function makeUnfocusButton(thisSkill) {
    let thisFocusButton = document.getElementById(thisSkill.name + 'Focus');
    let thisElement = document.getElementById(thisSkill.name);
    if(thisFocusButton)
        thisElement.parentNode.removeChild(thisFocusButton);
    //the unfocus button
    let unFocusElement = document.createElement('button');
    unFocusElement.id = thisSkill.name + 'UnFocus';
    unFocusElement.classList.add('UnfocusElement');
    unFocusElement.innerHTML = 'Unfocus';
    unFocusElement.onclick = function() {
        for(let focusedSkill in focusList) {
            if(focusList[focusedSkill].name === thisSkill.name) {
                //remove the focus class
                document.getElementById(thisSkill.name).classList.remove('focus');
                //remove this item from the focuslist
                focusList.splice(focusedSkill, 1);
                this.parentNode.removeChild(this);
            }
        }
        makeFocusButton(thisSkill);
    }
    //apply the unfocus element to the screen
    if(document.getElementById(thisSkill.name + 'Wrapper')) {
        document.getElementById(thisSkill.name + 'Wrapper').appendChild(unFocusElement);
    }
}

function makeFocusButton(thisSkill) {
    focusList.forEach(focusItem => {
        if(thisSkill && thisSkill.name === focusItem.name && !document.getElementById(thisSkill.name + 'UnFocus')) {
            makeUnfocusButton(thisSkill);
        }
    })


    if(thisSkill && thisSkill.level >= 2 && document.getElementById(thisSkill.name) && !thisSkill.uniqueSkill && !document.getElementById(thisSkill.name + 'UnFocus') && !document.getElementById(thisSkill.name + 'Focus')) {
        let focusElement = document.createElement('button');
        focusElement.id = thisSkill.name + 'Focus';
        focusElement.classList.add('focusElement');
        focusElement.innerHTML = 'Focus';

        focusElement.onclick = function() {
            let focusListSkill = focusList.find(skillItem => skillItem.name === thisSkill.name);
            if(!focusListSkill && focusList.length < focusAmount) {
                focusList.push(thisSkill);
                document.getElementById(thisSkill.name + 'Wrapper').classList.add('focus');
                makeUnfocusButton(thisSkill);
            }
        }
        //add the focus element to the screen
        document.getElementById(thisSkill.name + 'Wrapper').appendChild(focusElement);

    }
}

function makeSkillDiv(skillsToMake) {
    let thisSkill = skillsToMake[0];
    if(thisSkill && thisSkill && !document.getElementById(thisSkill.name + 'Wrapper')) {
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
                if(thisSkill.level >= 2) {
                    makeFocusButton(thisSkill);
                }
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
    makeFocusButton(thisSkill);

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
        activeAttributeWrapper = thisAttribute.name;
        for(let el of document.getElementsByClassName('activeAttributeWrapper')) {
            if(el.id != element.id) {
                el.classList.remove('activeAttributeWrapper')
            }
        }
        element.classList.add('activeAttributeWrapper');
        let previousSkillWrappers = document.getElementsByClassName('skill');
        while(previousSkillWrappers[0]) {
            previousSkillWrappers[0].parentNode.removeChild(previousSkillWrappers[0]);
        }
        if(thisAttribute.name === 'All') {
            let skillFilter = skills.filter(skill => skill.active);
            makeSkillDiv(skillFilter);
        } else {
            let skillFilter = skills.filter(skill => skill.type[0] === thisAttribute.name && skill.active);
            makeSkillDiv(skillFilter);
        }
    }
    skillAttributeWrapper.appendChild(element);
    primaryAttributes.shift();
    console.log()
    if(primaryAttributes.length > 0) {
        makeAttributeDiv(primaryAttributes)
    } else if (primaryAttributes.length === 0 && document.getElementsByClassName('attributeSkillDiv').length === 9) {
        makeAttributeDiv([{
            name: 'All'
        }])
    }
}

function updateSkills() {
    const primaryAttributes = attributes.filter(attribute => attribute.type === 'Primary');
    makeAttributeDiv(primaryAttributes);
}

function findSkillLevel(skill) {
    return skills.find(skillName => skillName.name === skill);
}

export { skills, updateSkills, checkNextSkills, makeUniqueElementText, incrementSkill, findSkillLevel, updateProgressBar }