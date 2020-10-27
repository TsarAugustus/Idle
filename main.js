import { Events } from "./js/events.js";
import { Player } from "./js/Player.js"

let Game = {
  eventButtons: [],
  init: function() {
    //Initializations

    let buttons = document.getElementsByClassName('button');
    let forage = document.getElementById('forage').onclick = function() {
      Game.forage();
    }
    //attaches an onclick function to eveery event button.
    //Might be better to fire the onclick function somewhere else, reduce callback hell
    for (var i = 0; i < buttons.length; i++) {
      (function(index) {
        buttons[index].onclick = function() {
          Game.eventUpgrade(buttons[index].name);
        }
      })(i)
    }
  },
  //Forage function. Finds random object from basic resources that are available.
  //Then it updates that resources span in the divList
  forage: function() {
    const basicResources = Player.basicResources;
    let randomItem = basicResources[Math.floor(Math.random() * basicResources.length)];
    let divList = document.getElementById('resources').querySelectorAll('span');

    //For loop that iterates through the resources, updates how many are in Player
    //Then update
    for (var i = 0; i < basicResources.length; i++) {
      if(Player.basicResources[i].name === randomItem.name) {
        Player.basicResources[i].amount++;
        if(randomItem.name === divList[i].id) {
          console.log(divList[i].innerHTML = basicResources[i].amount)
        }
      }
    }
  },
  eventUpgrade: function(buttonName) {
    const findEvent = function(eventName) {
      for (var i = 0; i < Events.length; i++) {
        if(Events[i].name === eventName) {
          return Events[i];
        }
      }
    }
    // console.log(Object.keys(findEvent(buttonName).required[0]));
    // console.log(Player.basicResources[0])
    const findResourcesVsEvent = function(event) {
      const eventAmt = Object.keys(findEvent(event).required[0]);
      let eventStuff = [];

      for (var i = 0; i < eventAmt.length; i++) {
        for(var j = 0; j < Player.basicResources.length; j++) {
          if(eventAmt[i] === Player.basicResources[j].name) {
            if(Object.values(findEvent(event).required[0])[i] <= Player.basicResources[j].amount) {
              eventStuff.push(true);
            } else {
              eventStuff.push(false);
            }
          }
        }
      }

      // console.log('available materials?: ' + eventStuff.includes(false)) //evaluates if eventStuff has 'false' in it, if it does , returns true
      if(!eventStuff.includes(false)) {
        //holy shit this took forever to figure out
        for (var i = 0; i < eventAmt.length; i++) {
          for(var j = 0; j < Player.basicResources.length; j++) {
            if(eventAmt[i] === Player.basicResources[j].name) {
              console.log(Player.basicResources[j].amount - Object.values(findEvent(event).required[0])[i])
              Player.basicResources[j].amount = Player.basicResources[j].amount - Object.values(findEvent(event).required[0])[i];
            }
          }
        }
      }
    }
    findResourcesVsEvent(buttonName);
    Game.update();
  },
  update: function() {
    let divList = document.getElementById('resources').querySelectorAll('span');
    for (var i = 0; i < Player.basicResources.length; i++) {
      if(divList[i].id === Player.basicResources[i].name) {
        divList[i].innerHTML = Player.basicResources[i].amount;
      }
    }
  }
}

window.onload = Game.init();
