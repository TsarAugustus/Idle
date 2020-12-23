import { items, findItem } from './items.js';
import { Player, playerFind } from './player.js';
import { skills, makeUniqueElementText, findSkillLevel } from './skills.js';
import { levelUpSkill } from './levelUpSkill.js';
import { updateStockpile } from '../main.js';
import { Crafts, craftFind, subCraftFind, craftCategories } from './Crafts.js';

//the craft item function will most likely be moved to a different module
//a lot of skills will have interactive elements like this, so it might be good to
//have a skeleton function and pass the skill into it,but thats for later
function craftItem(item) {
    //to craft an item, it merely will check if the player has its REQUIRES 
    let newItemStockpile = [];
    let thisItem = item;
    for(let req of thisItem.requires) {
        let reqItem = playerFind(req.name);
        if(reqItem.amount >= req.amount) {
            newItemStockpile.push({
                name: req.name,
                amount: reqItem.amount - req.amount
            });
        }
    }

    if(thisItem.requires.length === newItemStockpile.length) {
        for(let newItem of newItemStockpile) {
            playerFind(newItem.name).amount = newItem.amount;

        }
        //if the item doesn't exist in the players Stockpile, add it
        //I think I want to avoid the Stockpile, and instead have 
        //the items count how many the player has, but seperation layers might help
        // worthwhile to look into
        if(!playerFind(thisItem.name)) {
            Player.items.push({
                name: thisItem.name,
                amount: 1,
                special: thisItem.special
            });
        } else {
            let item = playerFind(thisItem.name);
            item.amount++;
            //this only applies to things like Fires and rainwaterBarrells
            if(item.special.inc) {
                if(thisItem.special.inc < 0) {
                    thisItem.special.inc = -1 / item.amount;
                    thisItem.special.max = 100 * item.amount;
                } else {
                    thisItem.special.inc = 1 * item.amount;
                    thisItem.special.max = 100 * item.amount;
                }
            }
            
        }
        updateStockpile(item);
        for(let itemToUpdate of item.requires) {
            updateStockpile(playerFind(itemToUpdate.name));
        }
        return true;
    } else {
        return false;
    }
    
}

function checkSubCraftRequirements(requirements) {
    let subCraftContainer = [];
    for(let req of requirements) {
        if(req.level && checkLevelRequirements(req)) {
            subCraftContainer.push(true);
        } else if(req.items && checkItemRequirements(req.items)){
            subCraftContainer.push(true);
        }
        // checkLevelRequirements()
        if(subCraftContainer.length === requirements.length) {
            return true;
        }
    }
}

function addCraftableItems(craftName, craftType) {
    //find craftable items
    let itemsToAdd = subCraftFind(craftName, craftType);
    console.log(checkSubCraftRequirements(itemsToAdd.required));
    
    //remove previous wrapper
    if(document.getElementById('subCraftWrapper')) {
        while (document.getElementById('subCraftWrapper').hasChildNodes()) {
            document.getElementById('subCraftWrapper').removeChild(document.getElementById('subCraftWrapper').lastChild);
        }
        document.getElementById('subCraftWrapper').remove();
    }

    //remake wrapper
    let wrapper = document.createElement('div');
    wrapper.id = 'subCraftWrapper'
    wrapper.classList.add('activeCraftWrapper');
    document.getElementById('interaction').appendChild(wrapper);
    
    // let wrapper = document.getElementById('subCraftWrapper');
    for(let craft of itemsToAdd.crafts) {
        if(!document.getElementById(craft.name.replace(/\s/g, '') + 'CraftButton')) {
            let element = document.createElement('button');
            element.id = craft.name.replace(/\s/g, '') + 'CraftButton';
            element.name = craft.name.replace(/\s/g, '-');
            let elementText = craft.name;
            for(let reqItem of craft.requires) {
                elementText += '</br>' + reqItem.name + ': ' + reqItem.amount;
            }
            element.innerHTML = elementText;
            element.onclick = function() {
                if(craftItem(craft)) {
                    let crafting = skills.find(skill => skill.name === 'Crafting');
                    crafting.currentXP += craft.special.XPReturn;
                    if(crafting.currentXP >= crafting.XPToLevel) {
                        levelUpSkill(crafting);
                    }
                    document.getElementById('Crafting').innerHTML = makeUniqueElementText(crafting)
                    let progressWidth = (crafting.currentXP / crafting.XPToLevel) * 100;
                    let progressBar = document.getElementById(crafting.name + 'ProgressBar');
                    progressBar.style.width = progressWidth + "%";

                }
            }
            wrapper.appendChild(element);
        }
    }
}

export function createCraftScreen(args) {
    
    if(document.getElementById('interactiveSkill')) {
        let interaction = document.getElementById('interactiveSkill');
        while (interaction.hasChildNodes()) {
            interaction.removeChild(interaction.lastChild);
        }
        interaction.remove();
    }


    let interactiveSkillDiv = document.createElement('div');
    interactiveSkillDiv.id = 'interactiveSkill';
    document.getElementById('right').appendChild(interactiveSkillDiv);
    if(!document.getElementById('interactiveHeader')) {
        let interactiveHeader = document.createElement('h3');
        interactiveHeader.id = 'interactiveHeader';
        interactiveHeader.innerHTML = 'Crafting Screen'
        document.getElementById('interactiveSkill').appendChild(interactiveHeader);
    }

    let closeBtn = document.createElement('button');
    closeBtn.id = 'closeCraftingScreenButton';
    closeBtn.innerHTML = 'Close';
    closeBtn.onclick = function() {
        if(document.getElementById('interactiveHeader')) {
            let interaction = document.getElementById('interactiveHeader');
            while (interaction.hasChildNodes()) {
                interaction.removeChild(interaction.lastChild);
            }
            interaction.remove();
        }
        if(document.getElementById('interactiveSkill')) {
            let interaction = document.getElementById('interactiveSkill');
            while (interaction.hasChildNodes()) {
                interaction.removeChild(interaction.lastChild);
            }
            interaction.remove();
        }
    }
    
    interactiveSkillDiv.appendChild(closeBtn);
    
    
    let wrapper = document.createElement('div');
    wrapper.id = 'interaction';


    //first, create the types of crafting buttons (wood, bone, rock, metal)
    let typesOfCrafting = [];
    if(typesOfCrafting.length === 0)
    for(let craftType of Object.keys(craftCategories)) {
        if(craftCategories[craftType].active || checkCraftRequirements(craftCategories[craftType].required)) {
            craftCategories[craftType].active = true;
            typesOfCrafting.push(craftType);
        }
    }
    
    let typesOfCraftingDiv = document.createElement('div');
    typesOfCraftingDiv.id = 'typesOfCraftingDiv';
    wrapper.appendChild(typesOfCraftingDiv);
    for(let craft of typesOfCrafting) {
        let craftTypeButton = document.createElement('button');
        craftTypeButton.id = craft + '-Crafting';
        craftTypeButton.innerHTML = craft;
        craftTypeButton.onclick = function() {
            for(let el of document.getElementsByClassName('activeCraftWrapper')) {
                while (el.hasChildNodes()) {
                    document.getElementById(el.id).removeChild(document.getElementById(el.id).lastChild);
                }
            }
            addSecondaryCraftType(craft);
        }
        typesOfCraftingDiv.appendChild(craftTypeButton)
    }
    interactiveSkillDiv.appendChild(wrapper);
}

function checkLevelRequirements(skillToCheck) {
    let levelContainer = [];
    for(let levelRequirements of skillToCheck.level) {
        let skillLevel = findSkillLevel(levelRequirements.name);
        if(skillLevel.level >= levelRequirements.level) {
            levelContainer.push(true);
        } 
    }
    if(levelContainer.length === skillToCheck.level.length) {
        return true;
    }
}

function checkItemRequirements(itemsToCheck) {
    let itemContainer = [];
    for(let reqItems of itemsToCheck) {
        let playerInventoryItem = playerFind(reqItems.name);
        if(playerInventoryItem && playerInventoryItem.amount >= reqItems.amount) {
            itemContainer.push(true);
        }
    }

    if(itemContainer.length === itemsToCheck.length) {
        return true
    }
}

function checkCraftRequirements(craft){
    let craftContainer = [];
    for(let req of craft) {
        if(req.level && checkLevelRequirements(req)) {
            craftContainer.push(true);
            
        } else if (req.items && checkItemRequirements(req.items)) {
            craftContainer.push(true);
        }
    }

    if(craftContainer.length === craft.length) {
        return true;
    }
}

function addSecondaryCraftType(craft) {
    if(!document.getElementById('subCraftsDiv')) {
        let subCrafts = document.createElement('div');
        subCrafts.id = 'subCraftsDiv';
        subCrafts.classList.add('activeCraftWrapper')
        document.getElementById('interaction').appendChild(subCrafts);
    }
    let subCraftType = craftFind(craft);
    let subCraftsDiv = document.getElementById('subCraftsDiv');
    for(let type of Object.keys(subCraftType.crafts)) {
        if(!document.getElementById(type)) {
            let element = document.createElement('button');
            element.id = type;
            element.innerHTML = type;
            element.onclick = function() {
                addCraftableItems(craft, type);
            }
            subCraftsDiv.appendChild(element);
        }
    }
}