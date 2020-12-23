import { skills, checkNextSkills, updateSkills, incrementSkill } from './modules/skills.js';
import { attributes, findAttributeLevel, findAttributeLongName, updateAttributes} from './modules/attributes.js';
import { items, findItem } from './modules/items.js';
import { Player, playerFind, updateTickItems } from './modules/player.js';

//some variables for the focus buttons
let focusAmount = 1;
let focusList = [];

//Currently gets called every tick. 
function updateStockpile(passedItem) {
    let stockpileDiv = document.getElementById('stockpile');
    let itemInsideInventory = playerFind(passedItem.name);
            
    //If the wrapper div doesn't exist, make one (eg, basic items div)
    //If the item div doesn't exists, create one
    if(!document.getElementById(passedItem.itemType + 'StockpileDiv')) {
        let itemStockpileDiv = document.createElement('div');
        itemStockpileDiv.id = passedItem.itemType + 'StockpileDiv';
        stockpileDiv.appendChild(itemStockpileDiv);
    }

    let itemStockpileDiv = document.getElementById(passedItem.itemType + 'StockpileDiv');
    if(!document.getElementById(passedItem.itemType + 'ItemsHeader')) {
        let header = document.createElement('p');
        header.innerHTML = passedItem.itemType + ' Items';
        header.id = passedItem.itemType + 'ItemsHeader';
        itemStockpileDiv.appendChild(header);
    }

    if(!document.getElementById(passedItem.name + 'WrapperDiv')) {
        let wrapper = document.createElement('div');
        wrapper.id = passedItem.name + 'WrapperDiv';
        wrapper.classList.add(passedItem.name)
        itemStockpileDiv.appendChild(wrapper);
    }

    let itemWrapper = document.getElementById(passedItem.name + 'WrapperDiv');
    itemWrapper.innerHTML = passedItem.name + ' : ' + itemInsideInventory.amount.toFixed(2);
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
    // updateSkills();
    updateTickItems();
    // updateStockpile();
    checkFocuses();
    checkNextSkills();

    
    

    //if there are skills in the focus list, click them
    if(focusList) {
        for(let skillFocus of focusList) {
            incrementSkill(skillFocus);
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
export { focusList, focusAmount, update, updateStockpile}
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