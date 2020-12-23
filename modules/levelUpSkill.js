import { attributes, updateAttributes } from './attributes.js';

//this function is called when a skill levels up, from the updateSkills function
export function levelUpSkill(skill) {
    //level up the skill, and apply a new XPToLevel
    skill.level++;
    skill.currentXP = 0;
    skill.XPToLevel = Math.round(skill.XPToLevel * 1.6);

    //update the attributes, as a new skill has leveled up as well
    let primaryAttributes = attributes.filter(type => type.type === 'Primary');
    for(let attribute of primaryAttributes) {
        for(let skillAttribute of skill.type) {
            if(skillAttribute === attribute.name) {
                attribute.level = attribute.level + Math.round((skill.level / skill.type.length) / 4);  
            }
        }
    }
    updateAttributes(skill); 

}