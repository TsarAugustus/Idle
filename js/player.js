export let Player = {
  //Basic resources from foraging
  basicResources: [{
    'name': 'wood',
    'amount': 100,
    'woodToPlanks': 10,
  }, {
    'name': 'stone',
    'amount': 0,
  }, {
    'name': 'leaves',
    'amount': 0
  }],
  accumulatedResources: [{
    name: 'cleanWater',
    amount: 0
  }, {
    name: 'woodPlanks',
    amount: 0,
    plankInc: 0.1
  }],
  name: undefined,
  currentTitle: undefined
}
