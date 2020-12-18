let Player = {
    items: []
   
}

//I think I want to merge the 'inventory'  with the items.
//i should have an 'amount' property on the items, and they corrolates to
//how much the player has on them
let playerFind = function(item) {
    if(item === undefined) {
        // console.log(item)
    }
    if(Player.items.filter(itemName => itemName.name === item)[0] != undefined) {
        return Player.items.filter(itemName => itemName.name === item)[0]
    } else {
        return false;
    }
}


export { Player, playerFind }