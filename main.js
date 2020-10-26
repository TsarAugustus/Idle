import { events } from "./js/events.js";
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
          for (var i = 0; i < buttons.length; i++) {
            if(buttons[index].name === events[i].name) {
              //iterate through requirements and decide if there is enough material
              for (var x = 0; x < Object.keys(events[i].required[0]).length; x++) {
                console.log(Object.keys(events[i].required[0])[x]); //Gets keys, eg stone
                console.log(Object.values(events[i].required[0])[x]);// gets value, eg 5

                //TODO: Still must evaluate and remove resources if the player has enough
              }
              events[i].isEventComplete = true;
            }
          }
          Game.update();
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
    Game.update();
  },
  //Update gets called often, to check for events or requirements
  update: function(event) {

  }
}

window.onload = Game.init();
