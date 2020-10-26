let Game = {
  init: function() {
    //Initializations
  },
  //Player stuff
  Player: {
    //Basic resources from foraging
    basicResources: [{
      'name': 'wood',
      'amount': 0
    }, {
      'name': 'stone',
      'amount': 0
    }]
  },
  //Forage function. Finds random object from basic resources that are available.
  //Then it updates that resources span in the divList
  forage: function() {
    const basicResources = Game.Player.basicResources;
    let randomItem = basicResources[Math.floor(Math.random() * basicResources.length)];
    let divList = document.getElementById('resources').querySelectorAll('span');

    //For loop that iterates through the resources, updates how many are in Game.Player
    //Then update
    for (var i = 0; i < basicResources.length; i++) {
      if(Game.Player.basicResources[i].name === randomItem.name) {
        Game.Player.basicResources[i].amount++;
        if(randomItem.name === divList[i].id) {
          console.log(divList[i].innerHTML = basicResources[i].amount)
        }
      }
    }
    Game.update();
  }
}
