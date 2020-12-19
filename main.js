import { skills, updateSkills, checkNextSkills } from './modules/skills.js';
import { attributes, findAttributeLevel, findAttributeLongName, updateAttributes} from './modules/attributes.js';
import { items, findItem } from './modules/items.js';
import { Player, playerFind } from './modules/player.js';

//some variables for the focus buttons
let focusAmount = 2;
let focusList = [];

//this function is called when a skill levels up, from the updateSkills function


//Currently gets called every tick. 
function updateStockpile() {
    let stockpileDiv = document.getElementById('stockpile');
    
    for(let item of Player.items) {
        let itemType = findItem(item.name);
        
        //If the wrapper div doesn't exist, make one (eg, basic items div)
        //this is used for client side organization
        if(!document.getElementById(itemType.itemType + 'WrapperDiv')) {
            console.log(itemType)
            let wrapper = document.createElement('div');
            wrapper.id = itemType.itemType + 'WrapperDiv';
            wrapper.classList.add('column');

            let element = document.createElement('p');
            element.innerHTML = itemType.itemType + ' Items';
            element.id = itemType.itemType + 'ItemsHeader';

            wrapper.appendChild(element);
            stockpileDiv.appendChild(wrapper);
        }
        //If the item div doesn't exists, create one
        if(!document.getElementById(item.name + 'StockpileDiv')) {
            let itemWrapper = document.getElementById(item.itemType + 'WrapperDiv');
            let element = document.createElement('span');
            element.innerHTML = item.name + '/' + item.amount;
            element.id = item.name + 'StockpileDiv';
            itemWrapper.appendChild(element);
        } else {
            //update if it does exist
            document.getElementById(item.name + 'StockpileDiv').innerHTML = item.name + '/' + item.amount;
        }
    }
}

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
    
    //update screen stuff
    updateStockpile();
    checkFocuses();
    checkNextSkills();
    updateSkills();
    

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

export { focusList, focusAmount}