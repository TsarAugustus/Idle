import { Events } from "./js/events.js";
import { Player } from "./js/Player.js"

let Game = {
  eventPercent: [{
    'name': 'createFire',
    'amt': {
      'wood': 5,
      'stone': 0
    }
  }],
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
        buttons[index].style.display = "none";
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
    let randomItem = basicResources[Math.floor(Math.random() * basicResources.length)];
    let divList = document.getElementById('resources').querySelectorAll('span');

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
    Game.update();
  },
  eventUpgrade: function(buttonName) {
    const findEvent = function(eventName) {
      for (var i = 0; i < Events.length; i++) {
        if(Events[i].name === eventName) {
          return Events[i];
        }
      }
    }
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

      // eventStuff.includes(false)) //evaluates if eventStuff has 'false' in it, if it does , returns true
      if(!eventStuff.includes(false)) {
        //holy shit this took forever to figure out
        for (var i = 0; i < eventAmt.length; i++) {
          for(var j = 0; j < Player.basicResources.length; j++) {
            if(eventAmt[i] === Player.basicResources[j].name) {
              Player.basicResources[j].amount = Player.basicResources[j].amount - Object.values(findEvent(event).required[0])[i];
            }
          }
        }
        let eventFlag = findEvent(event)
        eventFlag.isEventComplete = true;
      }
    }

    findResourcesVsEvent(buttonName);
    Game.update();
  },
  update: function() {
    //check flags
    for (var i = 0; i < Events.length; i++) {
      if(Events[i].isEventComplete === true) {
        const docName = document.getElementsByName(Object.values(Events[0])[0]);
        docName[0].style.display = "none";
        console.log(docName[0])

        //removes the most recent event
        Events.shift();
      }
    }
    //gets the requirements
    const req = Events[0].required[0];
    for (var i = 0; i < Player.basicResources.length; i++) {
      for(var j = 0; j < Object.values(req).length; j++) {
        if(Object.keys(req)[j] === Player.basicResources[i].name) {
          console.log(Events[0])
          if((Player.basicResources[i].amount/Object.values(req)[j]) >= 0.5) {
            const docName = document.getElementsByName(Object.values(Events[0])[0]);
            docName[0].style.display = 'block';
          }
        }
      }
    }

    let divList = document.getElementById('resources').querySelectorAll('span');
    for (var i = 0; i < Player.basicResources.length; i++) {
      if(divList[i].id === Player.basicResources[i].name) {
        divList[i].innerHTML = Player.basicResources[i].amount;
      }
    }
  }
}

window.onload = Game.init();
