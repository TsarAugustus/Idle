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
    //attaches an onclick function to eveery event button.
    //Might be better to fire the onclick function somewhere else, reduce callback hell
    for (var i = 0; i < buttons.length; i++) {
      (function(index) {
        //When button is clicked, fire the Game.eventUpgrade function
        buttons[index].onclick = function() {
          Game.eventUpgrade(buttons[index].name);

          //Received an error if buttons[index] wasn't evaluated
          if(buttons[index] != undefined) {
            if(buttons[index].name === 'createFire') {
              //Had a bug where fireLife wasn't appearing until tick function
              document.getElementById("fireLife").innerHTML = 'Fire: ' + Fire.fireLifeNum + '%';
              Game.fireIsLit = true;
            }
            if(buttons[index].name === 'createRainwaterBarrel') {
              document.getElementById("water").innerHTML = 'Water: ' + Water.waterNum + '%';
              Game.foundWater = true;
            }
          }
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
  //eventUpgrade function. Takes buttons name, then finds the corresponding Event
  eventUpgrade: function(buttonName) {
    const findEvent = function(eventName) {
      for (var i = 0; i < Events.length; i++) {
        if(Events[i].name === eventName) {
          return Events[i];
        }
      }
    }

    const findResourcesVsEvent = function(event) {
      //Finds # of required materials for event
      const eventAmt = Object.keys(findEvent(event).required[0]);
      //Holds an array of true/falses.
      //Any falses lead to the evaluation being failed
      let eventEvaluation = [];

      //For loop, first measures how many materials are needed for the event
      //Then checks how many resouces the player has
      //Then finally evaluates if the player has enough materials to perform the event
      //Evaluation is submitted into array, then evalued again in IF statement @line 96
      for (var i = 0; i < eventAmt.length; i++) {
        for(var j = 0; j < Player.basicResources.length; j++) {
          if(eventAmt[i] === Player.basicResources[j].name) {
            if(Object.values(findEvent(event).required[0])[i] <= Player.basicResources[j].amount) {
              eventEvaluation.push(true);
            } else {
              eventEvaluation.push(false);
            }
          }
        }
      }

      // eventEvaluation.includes(false)) //evaluates if eventEvaluation has 'false' in it, if it does , returns true
      if(!eventEvaluation.includes(false)) {
        //holy shit this took forever to figure out
        //Double For loop. Probably redundant.
        //TODO: Use .filter() or ES6 stuff to remove loop
        for (var i = 0; i < eventAmt.length; i++) {
          for(var j = 0; j < Player.basicResources.length; j++) {
            if(eventAmt[i] === Player.basicResources[j].name) {
              Player.basicResources[j].amount = Player.basicResources[j].amount - Object.values(findEvent(event).required[0])[i];
            }
          }
        }
        //Flag event. Probably redundant since event is removed?
        //TODO: Fix redundancy
        let eventFlag = findEvent(event)
        eventFlag.isEventComplete = true;
      }
    }

    //This bit is necessary to remove the button from the game.
    findResourcesVsEvent(buttonName);
    Game.update();
  },
  update: function() {
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
  }
}

window.onload = Game.init();
