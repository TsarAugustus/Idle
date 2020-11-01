import { Game } from "../main.js";
import { Notifications } from "./notifications.js";

export function checkNotifications() {
  //this will check the notifcations and update them if any are available
  const notifcationDiv = document.getElementById('notifications');
  let notif = Notifications.intro;

  //Every 10 seconds(calculated from tick, 10 seconds is the animation speed of the notifcations css)
  if((Game.tickAmt % 10) === 0) {
    //Empty container for pushing true/false into
    let notifCheck = [];
    const check = notif.filter(function(nextNotifcation) {
      for(var flag in nextNotifcation.flagRequirements) {
        //shorthand
        let thisFlag = nextNotifcation.flagRequirements[flag];

        if(thisFlag === '!fireIsLit' && Game.fireIsLit === false) {
          notifcationDiv.innerHTML = nextNotifcation.desc;
        }

        //Check if any of these tags are true.
        //Some notifications require events to not be completed.
        if(thisFlag === "fireIsLit" && Game.fireIsLit === true) {
          notifCheck.push(true);
        } else if(thisFlag === 'createRainwaterBarrel' && Game.foundWater === true) {
          notifCheck.push(true);
        } else if(thisFlag === '!createRainwaterBarrel' && Game.foundWater === false) {
          notifCheck.push(true);
        } else if(thisFlag === 'createHouse' && Game.createHouse === true) {
          notifCheck.push(true);
        } else if(thisFlag === '!foundPeople' && Game.foundPeople === false){
          notifCheck.push(true);
        } else if (thisFlag === 'foundPeople' && Game.foundPeople === true) {
          notifCheck.push(true)
        }
      }

      //evaluate the notifCheck array,
      if(notifCheck.length === nextNotifcation.flagRequirements.length) {
        notifcationDiv.innerHTML = nextNotifcation.desc;
      }
      notifCheck = [];
    });
  }
}
