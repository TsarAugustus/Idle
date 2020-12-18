import { skills } from './modules/skills.js';
import { attributes, findAttributeLevel, findAttributeLongName } from './modules/attributes.js';
import { items, findItem } from './modules/items.js';
import { Player, playerFind } from './modules/player.js';

//some variables for the focus buttons
let focusAmount = 2;
let focusList = [];

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
            if(focusListSkill) {
                console.log('skill exists in the focus list')
            } else if(!focusListSkill && focusList.length < focusAmount) {
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
    //update screen stuff
    updateAttributes(skill); 
    checkNextSkills();
    updateSkills();
    checkFocuses();
    
}

function updateSkills() {
    let skillDiv = document.getElementById('skills');

    let activeSkills = skills.filter(skill => skill.active === true);
    for(let skill of activeSkills) {
        if(!document.getElementById(skill.name)) {
            let wrapper = document.createElement('div');
            let element = document.createElement('button');
            let elementText = skill.name.replace(/\s/g, '</br>') + '</br>Level ' + skill.level + '</br>' + (skill.XPToLevel - skill.currentXP) + '/' + (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
            
            element.id = skill.name;
            element.classList.add('skill')
            element.innerHTML = elementText;
            element.onclick = function() {
                let level;
                skill.currentXP += (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
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
            wrapper.id = skill.name + 'Div';
            wrapper.classList.add('skillDiv')
            wrapper.appendChild(element)
            skillDiv.appendChild(wrapper);
        } else {
            document.getElementById(skill.name).innerHTML = skill.name.replace(/\s/g, '</br>') + '</br>Level ' + skill.level + '</br>' + (skill.XPToLevel - skill.currentXP) + '/' + (skill.XPPerSuccess + findAttributeLevel(skill.XPAttributeInc));
        }
    }
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

//doesn't do anything yet. This is next
function updateInventory() {
    let inventoryDiv = document.getElementById('inventory');
}

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
    //I want the checkfocuses function to be used sparringly, but also update the screen quickly
    //TODO: find out a better way to handle this
    checkFocuses();
}

//the craft item function will most likely be moved to a different module
//a lot of skills will have interactive elements like this, so it might be good to
//have a skeleton function and pass the skill into it,but thats for later
function craftItem(item) {
    //to craft an item, it merely will check if the player has its REQUIRES 
    let newItemInventory = [];
    let thisItem = findItem(item);
    for(let req of thisItem.requires) {
        let reqItem = playerFind(req.name);
        if(reqItem.amount >= req.amount) {
            newItemInventory.push({
                name: req.name,
                amount: reqItem.amount - req.amount
            });
        }
    }

    if(thisItem.requires.length === newItemInventory.length) {
        for(let newItem of newItemInventory) {
            playerFind(newItem.name).amount = newItem.amount;

        }
        //if the item doesn't exist in the players inventory, add it
        //I think I want to avoid the inventory, and instead have 
        //the items count how many the player has, but seperation layers might help
        // worthwhile to look into
        if(!playerFind(thisItem.name)) {
            Player.items.push({
                name: thisItem.name,
                amount: 1
            });
        } else {
            playerFind(thisItem.name).amount++;
        }
    } else {
        console.log('no good')
    }
    
}

//super simple function. Gets elements that have the 'focusElement' class
// if the focus limit is hit, then it applys the disabled class to all focus buttons
//else, the buttons are usable. Gets called on update
function checkFocuses() {
    let elements = document.getElementsByClassName('focusElement');
    if(focusList.length === focusAmount) {        
        for(let element of elements) {
            element.disabled = true;
        }
    } else {
        for(let element of elements) {
            element.disabled = false;
        }
    }
}

//update function, gets called on every tick, and calls update functions for each element
function update() {

    
    updateInventory();
    checkFocuses();
    

    //if there are skills in the focus list, click them
    if(focusList) {
        for(let skillFocus of focusList) {
            document.getElementById(skillFocus.name).click();
        }        
    }
}

function callTick() {
    setInterval(function() {
        // checkNextSkills();
        update();
        
        // craftItem('Fishing Pole');
        // console.log(attributes)
    }, 1000);
}

//the initialize function. Hardly does anything at the moment
function init() {
    updateAttributes();
    callTick();
    updateSkills();    
}

window.onload = (e) => {init()}
//game tick



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