import { attributes, updateAttributes } from './attributes.js';
import { focusList, focusAmount } from '../main.js'

//this function is called when a skill levels up, from the updateSkills function
export function levelUpSkill(skill) {
    //level up the skill, and apply a new XPToLevel
    skill.level++;
    skill.XPToLevel = Math.round(skill.XPToLevel * 1.6);

    //this is the element for the focus buttons
    // the '2' here is arbitrary, and must be switched for something better later
    //this is just for prototyping
    if(!skill.uniqueSkill && skill.level >= 2 & !document.getElementById(skill.name + 'UnFocus') && !document.getElementById(skill.name + 'Focus')) {
        //create the focus button next to each skill
        let focusElement = document.createElement('button');
        focusElement.id = skill.name + 'Focus';
        focusElement.classList.add('focusElement');
        focusElement.innerHTML = 'Focus';
        //the onclick function checks if the skill exists in the focus list
        //if it does, it doesnt apply the focus, as it is already being focused
        //likewise, if it doesnt exists, it pushes the skill to the focus list
        focusElement.onclick = function() {
            let focusListSkill = focusList.find(skillItem => skillItem.name === skill.name);
            if(!focusListSkill && focusList.length < focusAmount) {
                focusList.push(skill);
                document.getElementById(skill.name).classList.add('focus');

                this.parentNode.removeChild(focusElement)
                //the unfocus button
                let unFocusElement = document.createElement('button');
                unFocusElement.id = skill.name + 'UnFocus';
                unFocusElement.classList.add('UnfocusElement');
                unFocusElement.innerHTML = 'Unfocus';
                unFocusElement.onclick = function() {
                    for(let focusedSkill in focusList) {
                        if(focusList[focusedSkill].name === skill.name) {
                            //remove the focus class
                            document.getElementById(skill.name).classList.remove('focus');
                            //remove this item from the focuslist
                            focusList.splice(focusedSkill, 1);
                            //this is used to remove the unfocus button from the screen
                            document.getElementById(skill.name + 'Div').appendChild(focusElement);
                            this.parentNode.removeChild(this);
                        }
                    }
                }
                //apply the unfocus element to the screen
                document.getElementById(skill.name + 'Div').appendChild(unFocusElement);
            }
        }
        //add the focus element to the screen
        document.getElementById(skill.name + 'Div').appendChild(focusElement);

    }

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