import { skills, updateSkills, checkNextSkills } from './modules/skills.js';
import { attributes, findAttributeLevel, findAttributeLongName, updateAttributes} from './modules/attributes.js';
import { items, findItem } from './modules/items.js';
import { Player, playerFind, updateTickItems } from './modules/player.js';

//some variables for the focus buttons
let focusAmount = 1;
let focusList = [];

//Currently gets called every tick. 
function updateStockpile() {
    let stockpileDiv = document.getElementById('stockpile');
    
    for(let item of Player.items) {
        let itemType = findItem(item.name);
        
        //If the wrapper div doesn't exist, make one (eg, basic items div)
        //If the item div doesn't exists, create one
        if(!document.getElementById(item.name + 'StockpileDiv')) {
            //this is used for client side organization
            if(!document.getElementById(itemType.itemType + 'WrapperDiv')) {
                let wrapper = document.createElement('div');
                wrapper.id = itemType.itemType + 'WrapperDiv';
                wrapper.classList.add('column');
    
                let element = document.createElement('p');
                element.innerHTML = itemType.itemType + ' Items';
                element.id = itemType.itemType + 'ItemsHeader';
    
                wrapper.appendChild(element);
                stockpileDiv.appendChild(wrapper);
            }

            //writes stockpile to div
            let itemWrapper = document.getElementById(itemType.itemType + 'WrapperDiv');
            let element = document.createElement('span');
            element.classList.add(item.name.replace(/\s/g, ''));
            element.id = item.name + 'StockpileDiv';
            let elementText;
            if(item.special) {
                elementText = item.name + ': ' + item.amount;
                if(item.special.current && item.special.max) {
                    elementText += '</br>' + item.special.current.toFixed(1) + '/' + item.special.max;       
                }
                
            } else {
                elementText = item.name + ': ' + item.amount.toFixed(2);
            }

            itemWrapper.appendChild(element);
            
        } else {
            let itemStockPileDiv = document.getElementById(item.name + 'StockpileDiv');
            let elementText;
            if(item.special) {
                elementText = item.name + ': ' + item.amount;
                if(item.special.max) {
                    elementText += '</br>' + item.special.current.toFixed(1) + '/' + item.special.max;       
                }           
            } else {
                elementText = item.name + ': ' + item.amount.toFixed(2);
            }
            itemStockPileDiv.innerHTML = elementText;
        }
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
    
    //update screen stuff
    updateSkills();
    updateTickItems();
    updateStockpile();
    checkFocuses();
    checkNextSkills();

    
    

    //if there are skills in the focus list, click them
    if(focusList) {
        for(let skillFocus of focusList) {
            document.getElementById(skillFocus.name).click();
        }        
    }
}

function callTick() {
    setInterval(function() {
        update();
    }, 1000);
}

//the initialize function. Hardly does anything at the moment
function init() {
    updateSkills();    
    updateAttributes();
    callTick();
}

window.onload = (e) => {init()}
export { focusList, focusAmount}
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