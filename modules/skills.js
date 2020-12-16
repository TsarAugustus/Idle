export let skills = [
    //Basic skills, little or no previous requirements
    {
        name: 'Foraging',
        type: ['INT', 'DEX'],
        level: 0,
        active: true
    }, {
        name: 'Farming',
        type: ['INT', 'STR', 'DEX'],
        level: 0,
        requirements: [{
            name: 'Foraging',
            level: 2
        }],
        active: true
    }
];

//name = obviously the name of the skill
//type = what attribute it fits under, eg Mechanics is intelligence
//level = what level the skill is at
//requirements = if the skill requires previous skills
    // if so, then each requirement has a {name: X}, where is is skill name
    //and {level: Y} where Y is the level the skill requires to be upgraded
    //{name: X, level: Y}
//active = whether or not the skill is active. default is false, with level being 0 too