import { findItem } from './items.js';
import { Player, playerFind } from './player.js';
import { skills } from './skills.js';
import { levelUpSkill } from './levelUpSkill.js';

//the craft item function will most likely be moved to a different module
//a lot of skills will have interactive elements like this, so it might be good to
//have a skeleton function and pass the skill into it,but thats for later
function craftItem(item) {
    //to craft an item, it merely will check if the player has its REQUIRES 
    let newItemStockpile = [];
    let thisItem = findItem(item);
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
        return true;
    } else {
        return false;
    }
    
}

export function createCraftScreen(args) {
    if(document.getElementById('interaction')) {
        let interaction = document.getElementById('interaction');
        while (interaction.hasChildNodes()) {
            interaction.removeChild(interaction.lastChild);
        }
        interaction.remove();
    }

    let interactiveSkillDiv = document.createElement('div');
    interactiveSkillDiv.id = 'interactiveSkill';
    document.getElementById('right').appendChild(interactiveSkillDiv)

    let wrapper = document.createElement('div');
    wrapper.id = 'interaction';
    if(!document.getElementById('interactiveHeader')) {
        let interactiveHeader = document.createElement('h3');
        interactiveHeader.id = 'interactiveHeader';
        interactiveHeader.innerHTML = 'Crafting Screen'
        document.getElementById('right').appendChild(interactiveHeader);
    }
    interactiveSkillDiv.appendChild(wrapper);
    //find craftable items
    for(let craft of args ) {
        for(let item of craft) {
            //this creates an h3 that organizes the skill and its buttons
            //applied to interactiveSkillDiv because the wrapper hasn't been appended yet
            if(!document.getElementById(item.itemType + 'CraftDivWrapper')) {
                let craftDivWrapper = document.createElement('div');
                craftDivWrapper.id = item.itemType + 'CraftDivWrapper';
                document.getElementById('interaction').appendChild(craftDivWrapper);
            }
            if(!document.getElementById(item.itemType + 'Header')) {
                let craftItemHeader = document.createElement('h4');
                craftItemHeader.id = item.itemType + 'Header';
                craftItemHeader.innerHTML = item.itemType + ' related';
                document.getElementById(item.itemType + 'CraftDivWrapper').appendChild(craftItemHeader);
            }
            
            //If the craft menu doesnt exists, make it
            //could be a function of its own, and passed for unique skills
            //TODO: work on ^ idea
            if(!document.getElementById(item.name.replace(/\s/g, '') + 'CraftButton')) {
                let element = document.createElement('button');
                element.id = item.name.replace(/\s/g, '') + 'CraftButton';
                element.name = item.name.replace(/\s/g, '-');
                let elementText = item.name;
                for(let reqItem of item.requires) {
                    elementText += '</br>' + reqItem.name + ': ' + reqItem.amount;
                }
                element.innerHTML = elementText;
                element.onclick = function() {
                    if(craftItem(item.name)) {
                        
                        let crafting = skills.find(skill => skill.name === 'Crafting');
                        crafting.currentXP += item.special.XPReturn;
                        if(crafting.currentXP >= crafting.XPToLevel) {
                            levelUpSkill(crafting);
                        }
    
                    }
                }
                document.getElementById(item.itemType + 'CraftDivWrapper').appendChild(element);
            }
        }   
    }
}