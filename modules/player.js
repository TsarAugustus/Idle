let Player = {
    items: []
   
}

//I think I want to merge the 'inventory'  with the items.
//i should have an 'amount' property on the items, and they corrolates to
//how much the player has on them
let playerFind = function(item) {
    if(item === undefined) {
    }
    if(Player.items.filter(itemName => itemName.name === item)[0] != undefined) {
        return Player.items.filter(itemName => itemName.name === item)[0]
    } else {
        return false;
    }
}

function updateTickItems() {
    let specialTickItems = Player.items.filter(item => item.special);
    if(specialTickItems.length > 0) {
        for(let item of specialTickItems) {
            if(item.special.inc < 0) {
                if(item.special.current > item.special.min) {
                    item.special.current += item.special.inc;
                } else {
                    item.special.current = item.special.min;
                }

            } else if(item.special.inc > 0) {
                if(item.special.current < item.special.max) {
                    item.special.current += item.special.inc;
                } else {
                    item.special.current = item.special.max
                }
            }
        }
    }
}

export { Player, playerFind, updateTickItems }