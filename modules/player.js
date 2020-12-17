let Player = {
    items: [{
        name: 'Pole',
        amount: 6
    }, {
        name: 'Thread',
        amount: 3
    }]
   
}

let playerFind = function(item) {
    console.log('Inside PlayerFind. Finding: ', item)
    if(item === undefined) {
        // console.log(item)
    }
    if(Player.items.filter(itemName => itemName.name === item)[0] != undefined) {
        console.log('Found item inside players inventory')
        return Player.items.filter(itemName => itemName.name === item)[0]
    } else {
        console.log('Doesnt exist?')
        return false;
    }
}


export { Player, playerFind }