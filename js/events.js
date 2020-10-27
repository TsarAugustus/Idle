//Events should be added into this list by smallest event to largest(eg Campfire to Space station)

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
}]
