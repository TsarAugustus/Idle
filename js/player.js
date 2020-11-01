export let Player = {
  //Basic resources from foraging
  basicResources: [{
    'name': 'wood',
    'amount': 100,
    'woodToPlanks': 10
  }, {
    'name': 'stone',
    'amount': 100
  }, {
    'name': 'leaves',
    'amount': 100
  }],
  accumulatedResources: [{
    name: 'cleanWater',
    amount: 0
  }, {
    name: 'woodPlanks',
    amount: 100,
    plankInc: 1
  }],
  name: undefined,
  currentTitle: undefined,
  prestigeModifier: 1
}
