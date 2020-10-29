//Events should be added into this list by smallest event to largest(eg Campfire to Space station)
//Events are researchable 'blueprints' for the buildings/Upgrades
//would be wise to allow multiple events to be displayed, rather than lowest to most
export let Events = [{
  'name': 'createFire',
  'isEventComplete': false,
  'required': [{
    'wood': 10,
    'stone': 5
  }],
  'desc': 'Create a Fire'
}, {
  'name': 'createHouse',
  'isEventComplete': false,
  'required': [{
    'stone': 30
  }],
  'desc': 'Create a House'
}, {
  'name': 'createRainwaterBarrel',
  'isEventComplete': false,
  'required':[{
    'wood': 10,
    'stone': 10,
    'leaves': 10
  }],
  'desc': 'Create Rainwater Barrel'
}]
