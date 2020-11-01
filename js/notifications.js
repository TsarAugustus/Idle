export let Notifications = {
  intro: [{
    desc: 'It\'s cold and dark. Maybe I should light a fire.',
    flagRequirements: ['!fireIsLit']
  }, {
    desc: 'I should find water.',
    flagRequirements: ['fireIsLit', '!createRainwaterBarrel']
  }, {
    desc: 'Maybe if I boil this water I can use it.',
    flagRequirements: ['fireIsLit', 'createRainwaterBarrel']
  }, {
    desc: 'I wonder if there is anyone else out there?',
    flagRequirements: ['!foundPeople', 'fireIsLit', 'createRainwaterBarrel', 'createHouse']
  }, {
    desc: 'I\'ve encountered other people while foraging. If I have more shelter they might join me.',
    flagRequirements: ['foundPeople', 'createHouse']
  }]
}
