//Events should be added into this list by smallest event to largest(eg Campfire to Space station)
//Events are researchable 'blueprints' for the buildings/Upgrades
//would be wise to allow multiple events to be displayed, rather than lowest to most
export let Events = [{
  'name': 'createFire',
  'isEventComplete': false,
  'available': false,
  'required': [{
    'wood': 10,
    'stone': 5
  }],
  'desc': 'Create a Fire'
}, {
  'name': 'createHouse',
  'isEventComplete': false,
  'available': false,
  'required': [{
    'wood': 5,
    'stone': 30,
    'woodPlanks': 10
  }],
  'desc': 'Create a House'
}, {
  'name': 'createRainwaterBarrel',
  'isEventComplete': false,
  'available': false,
  'required':[{
    'wood': 20,
    'stone': 20,
    'leaves': 20
  }],
  'desc': 'Create Rainwater Barrel'
}]
