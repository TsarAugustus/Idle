//Import modules.
import { Events } from "./js/events.js";
import { Player } from "./js/Player.js";
import { Water } from "./js/Water.js"
import { Fire } from "./js/Fire.js";

export let Game = {
  init: function() {
    Game.fireIsLit = false;
    Game.foundWater = false;
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

        //For loop. Goes through the # of Events, then dynamically assigns the name/value of them on the buttons
        for(let j = 0; j < Events.length; j++) {
          if(buttons[index].name === Events[j].name) {
            let nameValue = [];
            nameValue.push(Object.values(Events[j])[3])
            for(let k = 0; k < Object.keys(Events[j].required[0]).length; k++) {
              let name = Object.keys(Events[j].required[0])[k].charAt(0).toUpperCase() + Object.keys(Events[j].required[0])[k].slice(1);
              let cost = Object.values(Events[j].required[0])[k];
              nameValue.push(name + ': ' + cost)
            }
            //VERY hacky?
            //TODO: make this better
            buttons[index].innerHTML = nameValue.join("<br>");
          }
        }
      })(i)
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
        const thisValue = Object.values(findEvent.required[0])[eventResource]
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
      console.log('nice');
      let removePlayerMaterials = playerResources.find(function(items) {
        // console.log(items)
        // console.log(Object.keys(findEvent.required[0]));
        for(var eventItem in Object.keys(findEvent.required[0])){
          if(Object.keys(findEvent.required[0])[eventItem] === items.name) {
            console.log(items, Object.values(findEvent.required[0])[eventItem]);
            items.amount = items.amount - Object.values(findEvent.required[0])[eventItem];
            findEvent.isEventComplete = true;
            break;
          }
        }
      });
    }
    Game.update();
  },
  update: function() {
    if(Game.fireIsLit) {
      document.getElementById('fireLife').innerHTML = 'Fire: ' + Fire.fireLifeNum + '%';
    }
    //check flags
    //Currently removes the event when completed. Maybe transferring it elsewhere to track it would be better
    for (var i = 0; i < Events.length; i++) {
      if(Events[i].isEventComplete === true) {
        const docName = document.getElementsByName(Object.values(Events[0])[0]);
        docName[0].style.display = "none";

        //removes the most recent event
        Events.shift();
      }
    }
    //If theres no events, do something
    //TODO: Generate random events after game completion
    if(!Events[0]) {
      document.getElementById("oneTimeEvents").innerHTML = "<h2> No events left </h2>"
      console.log('No events');
    } else {
      //gets the requirements
      const req = Events[0].required[0];
      for (var i = 0; i < Player.basicResources.length; i++) {
        for(var j = 0; j < Object.values(req).length; j++) {
          if(Object.keys(req)[j] === Player.basicResources[i].name) {
            if((Player.basicResources[i].amount/Object.values(req)[j]) >= 0.5) {
              const docName = document.getElementsByName(Object.values(Events[0])[0]);
              docName[0].style.display = 'block';
            }
          }
        }
      }
    }
    let divList = document.getElementById('basicResources').querySelectorAll('span');
    for (var i = 0; i < Player.basicResources.length; i++) {
      if(divList[i].id === Player.basicResources[i].name) {
        divList[i].innerHTML = Player.basicResources[i].amount;
      }
    }
  },
  //The game tick will control the updates on the screen for the Fire and Water.
  //Game tick is initiated by createFire Event, through Fire.js module
  tick: function() {
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
      if(Fire.fireLifeNum != 0) {
        let totalWater;
        totalWater = Water.waterNum + Water.waterGain;
        Water.waterNum = Math.round(totalWater * 10) / 10;
        waterDoc.innerHTML = 'Water: ' + totalWater + '%';
        console.log(Water)
      }
    }
  }
}

window.onload = Game.init();
