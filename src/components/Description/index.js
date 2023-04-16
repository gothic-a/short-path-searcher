import { coordsToString } from "../../utils"
import './styles.scss'

const Description = ({start, end}, path) => {	
    const description = document.createElement('div')
    description.classList.add('description')
    
    const steps = document.createElement('div')
    steps.classList.add('steps')
    
    steps.innerHTML = path.map((step, idx) => {
        const stepToString = coordsToString(step) 
        return idx === path.length - 1 
            ? `<span>[x:${step.x}, y:${step.y}]</span>` 
            : `<span>[x:${step.x}, y:${step.y}] =></span>`  
    }).join(' ')
    
    const stepsCount = `<span>Steps count: ${path.length - 1}</span>` 

    description.insertAdjacentHTML('beforeend', stepsCount)
    
    return description
}

export default Description