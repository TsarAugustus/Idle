let Player = {
    items: []
   
}

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