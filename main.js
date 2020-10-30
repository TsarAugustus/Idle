//Import modules.
import { Events } from "./js/events.js";
import { Player } from "./js/Player.js";
import { Water } from "./js/Water.js"
import { Fire } from "./js/Fire.js";
import { Titles } from "./js/titles.js";
import { Notifications } from "./js/notifications.js"

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
    Game.tickAmt = 0;
    setInterval(Game.tick, 1000);
    //Initializations
    let buttons = document.getElementsByClassName('button');
    let forage = document.getElementById('forage').onclick = function() {
      Game.forage();
    }
    let stoke = document.getElementById('stoke').onclick = function() {
      Game.stoke();
    }
    document.getElementById('stoke').style.display = 'none';
    //attaches an onclick function to eveery event button.
    //Might be better to fire the onclick function somewhere else, reduce callback hell
    for (var i = 0; i < buttons.length; i++) {
      (function(index) {
        //When button is clicked, fire the Game.eventUpgrade function
        buttons[index].onclick = function() {
          Game.eventUpgrade(buttons[index].name, Player.basicResources);
        }
        //Hide the buttons
        buttons[index].style.display = "none";

        let buttonHTML = []
        const eventLoop = Events.filter(function(eventName) {
          if(eventName.name === buttons[index].name) {
            buttonHTML.push(eventName.desc);
            for(var i in eventName.required[0]){
              let name = i.charAt(0).toUpperCase() + i.slice(1);
              let cost = eventName.required[0][i]
              buttonHTML.push(name + ': ' + cost);
            }
            buttons[index].innerHTML = buttonHTML.join("<br>");
          }
        });
      })(i);
    }
  },
  //Forage function. Finds random object from basic resources that are available.
  //Then it updates that resources span in the divList
  forage: function() {
    const basicResources = Player.basicResources;
    const randomItem = basicResources[Math.floor(Math.random() * basicResources.length)];
    const divList = document.getElementById('basicResources').querySelectorAll('span');

    //For loop that iterates through the resources, updates how many are in Player
    //Then update
    for (var i = 0; i < basicResources.length; i++) {
      if(Player.basicResources[i].name === randomItem.name) {
        Player.basicResources[i].amount++;
        if(randomItem.name === divList[i].id) {
          divList[i].innerHTML = basicResources[i].amount
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
  //eventUpgrade function. Takes buttons name, then finds the corresponding Event
  eventUpgrade: function(buttonName, playerResources) {
    //First find event/required materials
    const findEvent = Events.find(function(event) {
      return event.name === buttonName;
    });

    let playerCheckValue = [];
    const checkPlayerResources = playerResources.find(function(playerItems) {
      for(var eventResource in Object.keys(findEvent.required[0])) {
        const thisName = Object.keys(findEvent.required[0])[eventResource];
        const thisValue = Object.values(findEvent.required[0])[eventResource];
        if(thisName === playerItems.name) {
          if(thisValue <= playerItems.amount) {
            playerCheckValue.push(true);
            break;
          } else {
            playerCheckValue.push(false);
            break;
          }
        }
      }
    });

    if(!playerCheckValue.includes(false)) {
      if(findEvent.name === 'createFire') {
        Game.fireIsLit = true;
        document.getElementById('stoke').style.display = "block";
      } else if (findEvent.name === 'createRainwaterBarrel') {
        Game.foundWater = true;
        Water.rainwaterBarrelNum++;
        document.getElementById('water').innerHTML = 'Water: ' + Water.waterNum + '%';
      }
      let removePlayerMaterials = playerResources.find(function(items) {
        for(var eventItem in Object.keys(findEvent.required[0])){
          if(Object.keys(findEvent.required[0])[eventItem] === items.name) {
            items.amount = items.amount - Object.values(findEvent.required[0])[eventItem];
            findEvent.isEventComplete = true;
            break;
          }
        }
      });
      findEvent.isEventComplete = true;
    }
    Game.update();
  },
  update: function() {
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
    let divList = document.getElementById('basicResources').querySelectorAll('span');
    for (var i = 0; i < Player.basicResources.length; i++) {
      if(divList[i].id === Player.basicResources[i].name) {
        divList[i].innerHTML = Player.basicResources[i].amount;
      }
    }
  },
  checkNotifications: function() {
    //this will check the notifcations
    const notifcationDiv = document.getElementById('notifications');
    let notif = Notifications.intro;
    if((Game.tickAmt % 10) === 0) {
      let notifCheck = [];
      let notifName;
      const check = notif.filter(function(nextNotifcation) {
        console.log('Start of filter')
        for(var flag in nextNotifcation.flagRequirements) {
          console.log('Start of for loop, iteration: ' + flag);
          let thisFlag = nextNotifcation.flagRequirements[flag];

          if(thisFlag === '!fireIsLit' && Game.fireIsLit === false) {
            notifcationDiv.innerHTML = nextNotifcation.desc;
          }

          if(thisFlag === "fireIsLit" && Game.fireIsLit === true) {
            notifCheck.push(true);
            console.log('here', nextNotifcation);
          } else if(thisFlag === "createRainwaterBarrel" && Game.foundWater === true) {
            notifCheck.push(true);
            console.log('here', nextNotifcation);
          } else if(thisFlag === "!createRainwaterBarrel" && Game.foundWater === false) {
            notifCheck.push(true);
            console.log('here', nextNotifcation);
          }
          console.log('Exiting loop')
        }
        console.log(notifCheck)
        console.log(notifCheck.length, nextNotifcation.flagRequirements.length);
        if(!notifCheck.includes(false) && notifCheck.length === nextNotifcation.flagRequirements.length) {
          notifcationDiv.innerHTML = nextNotifcation.desc;
        }
        notifCheck = [];
      });
    }
  },
  //The game tick will control the updates on the screen for the Fire and Water.
  //Game tick is initiated by createFire Event, through Fire.js module
  tick: function() {
    Game.checkNotifications();
    Game.update();
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
      if(Game.fireIsLit && Fire.fireLifeNum > 0) {
        // let totalCleanWater;
        Water.drinkableWaterNum = Water.drinkableWaterNum + Water.drinkableWaterGain;
        document.getElementById('cleanWater').innerHTML = Water.drinkableWaterNum;
      }
      //Creates water if the event to create water has been completed
      //Water is
      let totalWater;
      if((Water.waterNum + Water.waterGain) > Water.waterCap) {
        totalWater = Water.waterCap;
        Water.waterNum = Math.round(totalWater * 10) / 10;
      } else {
        totalWater = Water.waterNum + Water.waterGain;
        Water.waterNum = Math.round(totalWater * 10) / 10;
      }
      waterDoc.innerHTML = 'Water: ' + Water.waterNum + '%';
    }
    Game.tickAmt++;
  }
}

window.onload = Game.init();
