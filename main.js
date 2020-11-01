//Import modules.
import { Events } from "./js/events.js";
import { Player } from "./js/Player.js";
import { Water } from "./js/Water.js"
import { Fire } from "./js/Fire.js";
import { Titles } from "./js/titles.js";
import { Upgrades } from "./js/upgrades.js";
import { Notifications } from "./js/notifications.js";
import { checkNotifications } from "./js/checkNotifications.js";

export let Game = {
  init: function() {
    let playerName = window.prompt('Please input your name: ');
    Player.playerName = playerName;
    document.getElementById('playerName').innerHTML = Player.playerName;
    Player.currentTitle = Titles.genericTitles[Math.floor(Math.random() * Titles.genericTitles.length)];
    if(Player.currentTitle.affix === 'P') {
      document.getElementById('P').innerHTML = Player.currentTitle.titleName;
    } else if(Player.currentTitle.affix === 'S') {
      document.getElementById('S').innerHTML = Player.currentTitle.titleName;
    }

    Game.fireIsLit = false;
    Game.foundWater = false;
    Game.createHouse = false;
    Game.foundPeople = false;
    Game.currentFocus;
    Game.tickAmt = 0;
    setInterval(Game.tick, 1000);
    //Initializations
    document.getElementById('cleanWaterWrap').style.display = "none";
    document.getElementById('stoke').style.display = 'none';
    document.getElementById('woodPlankWrap').style.display = 'none'
    document.getElementById('houseUpgradeDiv').style.display = 'none';
    let eventButtons = document.getElementsByClassName('eventButton');
    let upgradeButtons = document.getElementsByClassName('upgradeButton');
    let forage = document.getElementById('forage').onclick = function() {
      Game.focus(event.target.id)
    }
    let stoke = document.getElementById('stoke').onclick = function() {
      Game.stoke();
    }

    document.getElementById("craftCleanWater").onclick = function(event) {
      Game.focus(event.target.id);
    }

    document.getElementById("craftWoodPlanks").onclick = function(event) {
      Game.focus(event.target.id);
    }

    for(var i=0; i < upgradeButtons.length; i++) {
      (function(index) {
        upgradeButtons[index].onclick = function() {
          Game.buildingUpgrade(upgradeButtons[index]);
        }
      })(i);
    }
    //attaches an onclick function to every event button.
    //Might be better to fire the onclick function somewhere else, reduce callback hell
    for (var i = 0; i < eventButtons.length; i++) {
      (function(index) {
        //When button is clicked, fire the Game.eventUpgrade function
        eventButtons[index].onclick = function() {
          Game.eventUpgrade(eventButtons[index].name, Player);
        }
        //Hide the eventButtons
        eventButtons[index].style.display = "none";

        let buttonHTML = []
        const eventLoop = Events.filter(function(eventName) {
          if(eventName.name === eventButtons[index].name) {
            buttonHTML.push(eventName.desc);
            for(var i in eventName.required[0]){
              let name = i.charAt(0).toUpperCase() + i.slice(1);
              let cost = eventName.required[0][i]
              buttonHTML.push(name + ': ' + cost);
            }
            eventButtons[index].innerHTML = buttonHTML.join("<br>");
          }
        });
      })(i);
    }
  },
  focus: function(focusName) {
    if(focusName === 'forage') {
      Game.currentFocus = focusName;
    } else if (focusName === 'craftCleanWater') {
      Game.currentFocus = focusName;
    } else if (focusName === 'craftWoodPlanks') {
      Game.currentFocus = focusName;
    }


  },
  //Forage function. Finds random object from basic resources that are available.
  //Then it updates that resources span in the divList

  forage: function() {
    console.log('here')
    const basicResources = Player.basicResources;
    const prestigeModifier = Player.prestigeModifier;
    const randomItem = basicResources[Math.floor(Math.random() * basicResources.length)];
    const divList = document.getElementById('basicResources').querySelectorAll('span');

    //For loop that iterates through the resources, updates how many are in Player
    //Then update
    for (var i = 0; i < basicResources.length; i++) {
      if(basicResources[i].name === randomItem.name) {
        basicResources[i].amount = basicResources[i].amount + (1 * prestigeModifier);
        if(randomItem.name === divList[i].id) {
          divList[i].innerHTML = basicResources[i].amount;
        }
      }
    }
    //Game update to update resources
    Game.update();
  },

  //stoke function
  stoke: function() {
    let playerWoodAmt;
    playerWoodAmt = Player.basicResources[0].amount;
    let doesPlayerHaveEnoughWood = playerWoodAmt - 10;

    if(Fire.fireLifeNum < 100 && doesPlayerHaveEnoughWood >= 0) {
      Player.basicResources[0].amount -= 10;
      //evaluate if stoking will bring fire over 100%
      //if so, cap it at 100%
      let fireLifeAmt;
      fireLifeAmt = Fire.fireLifeNum;
      fireLifeAmt += 10;
      if(fireLifeAmt > 100) {
        Fire.fireLifeNum = 100;
      } else {
        Fire.fireLifeNum += 10;
      }
    }
    Game.update();
  },
  //Attempted to modularize building upgrade function, but modules can't natively modify exported variables
  // (eg, the player resource amt), so for now this has to be inside the game logic
  buildingUpgrade: function(upgradeButton, player) {
    //find upgrade/building in Upgrades module
    let buildingDocHTML = [];
    let nameContainer = [];
    let findBuilding = Upgrades.filter(function(building) {
      for(let i = Object.values(upgradeButton.id).length - 1; i>=0; i--){
        if(Object.values(upgradeButton.id)[i] === '-') {
          break;
        } else {
          nameContainer.push(Object.values(upgradeButton.id)[i]);
        }
      }

      let name = nameContainer.reverse().join('');
      if(name === building.name) {
        return building;
      }
    })
    //Compare upgrade required resources to player resources
    if(findBuilding[0]) {
      let buildingReqMaterials = findBuilding[0].required[0];
      let checkContainer = [];
      for(var resource in buildingReqMaterials) {
        for(var playerResource in Player.basicResources) {
          if(Player.basicResources[playerResource].name === resource && buildingReqMaterials[resource] <= Player.basicResources[playerResource].amount) {
            checkContainer.push(true);
          }
        }

        for(var playerResource in Player.accumulatedResources) {
          if(Player.accumulatedResources[playerResource].name === resource && buildingReqMaterials[resource] <= Player.accumulatedResources[playerResource].amount) {
            checkContainer.push(true);
          }
        }
      }

      //If the player has enough, remove items from player and upgrade building
      if(Object.keys(buildingReqMaterials).length === checkContainer.length) {
        for(resource in buildingReqMaterials) {
          for(var playerResource in Player.basicResources) {
            if(resource === Player.basicResources[playerResource].name) {
              let name = resource.charAt(0).toUpperCase() + resource.slice(1);
              buildingDocHTML.push(name + ': ' + buildingReqMaterials[resource]);
              Player.basicResources[playerResource].amount = Player.basicResources[playerResource].amount - buildingReqMaterials[resource];
              document.getElementById([resource]).innerHTML = Player.basicResources[playerResource].amount;
            }
          }
          for(var playerResource in Player.accumulatedResources) {
            if(resource === Player.accumulatedResources[playerResource].name){
              let name = resource.charAt(0).toUpperCase() + resource.slice(1);
              buildingDocHTML.push(name + ': ' + buildingReqMaterials[resource]);
              Player.accumulatedResources[playerResource].amount = Player.accumulatedResources[playerResource].amount - buildingReqMaterials[resource];
            }
          }
        }
        findBuilding[0].amount = findBuilding[0].amount + 1;
        let buildingDoc = document.getElementById('upgrade-' + findBuilding[0].name);
        buildingDoc.innerHTML = buildingDocHTML.join('<br>');

      }
    }
    // Game.update();
  },
  //eventUpgrade function. Takes buttons name, then finds the corresponding Event
  eventUpgrade: function(buttonName, playerResources) {
    //First find event/required materials
    const findEvent = Events.find(function(event) {
      return event.name === buttonName;
    });

    let playerCheckValue = [];
    let thisEventResources = Object.keys(findEvent.required[0]);
    let thisEventCost = Object.values(findEvent.required[0]);
    const checkPlayerResources = thisEventResources.find(function(items) {
      for(var resource in playerResources.basicResources) {
        if(playerResources.basicResources[resource].name === items) {
          if(playerResources.basicResources[resource].amount >= thisEventCost[resource]) {
            playerCheckValue.push(true);
            break;
          }
        }
      }
      for(var resource in playerResources.accumulatedResources) {
        if(playerResources.accumulatedResources[resource].name === items) {
          for(var eventResource in findEvent.required[0]) {
            if(findEvent.required[0][items] <= Player.accumulatedResources[resource].amount) {
              playerCheckValue.push(true);
              break;
            }
          }
        }
      }
    });

    if(thisEventResources.length === playerCheckValue.length) {
      for(var num in thisEventResources) {
        let removeBasicPlayerMaterials = playerResources.basicResources.find(function(items) {
          if(items.name === thisEventResources[num]) {
            items.amount = items.amount - thisEventCost[num];
          }
        });
        let removeAccumulatedPlayerResources = playerResources.accumulatedResources.find(function(items) {
          if(items.name === thisEventResources[num]) {
            items.amount = items.amount - thisEventCost[num];
          }
        });
      }
      if(findEvent.name === 'createFire') {
        Game.fireIsLit = true;
        document.getElementById('stoke').style.display = "block";
      } else if (findEvent.name === 'createRainwaterBarrel') {
        Game.foundWater = true;
        Water.rainwaterBarrelNum++;
        document.getElementById('cleanWaterWrap').style.display = "block";
        document.getElementById('water').innerHTML = 'Water: ' + Water.waterNum + '%';
      } else if (findEvent.name === 'createHouse') {
        Game.createHouse = true;
      }
      findEvent.isEventComplete = true;
    }
    if(buttonName === 'createHouse' && Upgrades[0].amount === 0) {
      let upgradeButton = [];
      upgradeButton.id = 'upgrade-' + buttonName;
      Game.buildingUpgrade(upgradeButton);
    }

    Game.update();
  },
  update: function() {
    if(Game.createHouse === true) {
      document.getElementById('houseUpgradeAmt').innerHTML = Upgrades[0].amount;
      document.getElementById('houseUpgradeDiv').style.display = 'block';
      let num = Math.floor(Math.random() * 51);
      if(Math.floor(num) === 25 && Game.foundPeople === false) {
        console.log(num)
        Game.foundPeople = true;
      }
    }

    for(var resource in Player.accumulatedResources) {
      if(Player.accumulatedResources[resource].name === 'woodPlanks' && (Player.basicResources[0].woodToPlanks / Player.basicResources[0].amount) <= 2) {
        document.getElementById('woodPlanks').innerHTML = Player.accumulatedResources[resource].amount;
        document.getElementById('craftWoodPlanks').innerHTML = Player.basicResources[0].woodToPlanks + ' Wood => ' + Player.accumulatedResources[resource].plankInc + ' Plank';
        document.getElementById('woodPlankWrap').style.display = 'block';
      }
    }
    //This bit is necessary when the stoke function is passed
    if(Game.fireIsLit) {
      document.getElementById('fireLife').innerHTML = 'Fire: ' + Fire.fireLifeNum + '%';
    } else if (Game.foundWater) {
      document.getElementById('water').innerHTML = 'Water: ' + Water.waterNum + '%';
    }

    //check flags
    //Currently removes the event when completed. Maybe transferring it elsewhere to track it would be better
    for (var i = 0; i < Events.length; i++) {
      if(Events[i].available === true) {
        document.getElementById(Events[i].name).style.display = "block";
      }

      if(Events[i].isEventComplete === true) {
        let name = Events[i].name;
        document.getElementById(name).style.display = "none";
      }
    }
    //If theres no events, do something
    //TODO: Generate random events after game completion
    if(!Events[0]) {
      document.getElementById("oneTimeEvents").innerHTML = "<h2> No events left </h2>"
      console.log('No events');
    } else {
      const checkEvent = Events.filter(function(eventName) {
        for(var resource in Player.basicResources) {
          if(Object.keys(eventName.required[0])[resource] !== undefined && Object.keys(eventName.required[0])[resource] === Player.basicResources[resource].name) {
            let testNum = Object.values(eventName.required[0])[resource] / Player.basicResources[resource].amount;
            if(testNum !== Infinity && testNum <= 2) {
              eventName.available = true;
            }
          }
        }
      });
    }
  },
  //The game tick will control the updates on the screen for the Fire and Water.
  //Game tick is initiated by createFire Event, through Fire.js module
  tick: function() {
    checkNotifications();
    Game.update();

    //this is necessary to update resources when game is initialized or other factors where the innerhtml is blank
    for(var resource in Player.basicResources) {
      document.getElementById(Player.basicResources[resource].name).innerHTML = Player.basicResources[resource].amount;
    }

    //calls the forage function if forage is the currentFocus
    //moved from Game.upgrade, as this abused the update system.
    //player was able to do .onclick via screen updates
    if(Game.currentFocus && Game.currentFocus === 'forage') {
      Game.forage();
    }

    //10:1 ratio
    const findResource = function(resourceName, type) {
      if(type === 'basicResources') {
        for(var resource in Player.basicResources) {
          if(Player.basicResources[resource].name === resourceName) {
            return Player.basicResources[resource];
          }
        }
      } else if (type === 'accumulatedResources') {
        for(var resource in Player.accumulatedResources) {
          if(Player.accumulatedResources[resource].name === resourceName) {
            return Player.accumulatedResources[resource];
          }
        }
      }
    }

    if(Game.currentFocus === 'craftWoodPlanks' && findResource('wood', 'basicResources').amount >= findResource('wood', 'basicResources').woodToPlanks) {
      findResource('wood', 'basicResources').amount = findResource('wood', 'basicResources').amount - findResource('wood', 'basicResources').woodToPlanks;
      let newAmount = findResource('woodPlanks', 'accumulatedResources').amount + findResource('woodPlanks', 'accumulatedResources').plankInc;
      findResource('woodPlanks', 'accumulatedResources').amount = Math.round(newAmount * 10) / 10;
      document.getElementById('woodPlanks').innerHTML = findResource('woodPlanks', 'accumulatedResources').amount;
      document.getElementById('wood').innerHTML = findResource('wood', 'basicResources').amount;
    }

    const fireLifeDoc = document.getElementById("fireLife");
    const waterDoc = document.getElementById('water');
    //tick logic for fire. Need to display fire with inner.html here is redundant,
    //since onclick makes fire a block. Very handy
    if(Game.fireIsLit) {
      let totalFireLife;
      if(Fire.fireLifeNum <= 0) {
        Fire.fireLifeNum = 0;
        fireLifeDoc.innerHTML = 'Fire: ' + Fire.fireLifeNum + '%';
      } else {
        totalFireLife = Fire.fireLifeNum - Fire.fireDecay;
        Fire.fireLifeNum = Math.round(totalFireLife * 10) / 10;
        fireLifeDoc.innerHTML = 'Fire: ' + Fire.fireLifeNum + '%';
      }
    }

    //water tick logic
    if(Game.foundWater) {
      //Creates water if the event to create water has been completed
      //Water is
      let totalWater;
      if((Water.waterNum + Water.waterGain) > Water.waterCap) {
        totalWater = Water.waterCap;
        Water.waterNum = Math.round(totalWater * 10) / 10;
      } else if (Water.waterNum < 0) {
        Water.waterNum = 0;
      } else {
        totalWater = Water.waterNum + Water.waterGain;
        Water.waterNum = Math.round(totalWater * 10) / 10;
      }

      let totalCleanWater;
      //Removes X% of water to convert into drinkableWater
      // Takes (base) 75% of waterGain and puts it to drinkableWaterGain
      let percentToDecimal = (Water.waterToDrinkableWater / 100);
      let convertPercent = percentToDecimal * Water.waterGain;
      let cleanWaterDiv = document.getElementById('craftCleanWater');
      cleanWaterDiv.innerHTML = convertPercent + ' Water => ' + Water.drinkableWaterGain + ' Clean Water';
      if(Game.fireIsLit && Fire.fireLifeNum > 0 && Game.currentFocus === 'craftCleanWater')  {
        let newTotalWater = Water.waterNum - convertPercent;
        Water.waterNum = Math.round(newTotalWater * 10) / 10;
        totalCleanWater = Water.drinkableWaterNum + Water.drinkableWaterGain;
        Water.drinkableWaterNum = Math.round(totalCleanWater * 10) / 10;
        document.getElementById('cleanWater').innerHTML = Water.drinkableWaterNum;
      }
      waterDoc.innerHTML = 'Water: ' + Water.waterNum + '%';
    }
    Game.tickAmt++;
  }
}

window.onload = Game.init();
