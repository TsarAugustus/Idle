export let skills = [
    //Basic skills, little or no previous requirements
    {
        name: 'Foraging',
        type: ['INT', 'AGI'],
        level: 1,
        active: true,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50
    }, {
        name: 'Farming',
        type: ['INT', 'STR', 'AGI'],
        level: 0,
        requirements: [{
            name: 'Foraging',
            level: 5
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50
    }, {
        name: 'Animal Husbandry',
        type: ['END', 'STR', 'AGI'],
        level: 0,
        requirements: [{
            name: 'Farming',
            level: 7
        }],
        active: false,
        currentXP: 0,
        XPToLevel: 100,
        XPPerSuccess: 50
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