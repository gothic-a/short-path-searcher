import { coordsToString } from "../../utils"
import './styles.scss'

export const Grid = (gridData, path) => {
	if(path instanceof Error) {
        rootElement.innerText = path.message
        rootElement.style.color = 'tomato'
        return
    }

	const coordsMatrix = gridData.coordsMatrix
    const stringStart = gridData.start.join('')
    const stringEnd = gridData.end.join('')
  
	const grid = document.createElement('div')
    grid.classList.add('grid')
  
    const stringPathCoords = path.map(coordsToString)
  
    for(let row of coordsMatrix) {
        const gridRow = document.createElement('div')
        gridRow.classList.add('grid__row')

        for(let node of row) {
            const stringCoords = coordsToString(node)
            const x = node.x 
            const y = node.y

            const rowNode = document.createElement('div')
            rowNode.classList.add('grid__row-node')
            
            if(node.isBlocked) rowNode.classList.add('blocked')
            if(stringPathCoords.includes(stringCoords)) rowNode.classList.add('marked')
            if(stringCoords === stringStart) {
                rowNode.classList.add('start')
                rowNode.innerHTML += '<span class="tip">start</span>'
            }
            if(stringCoords === stringEnd) {
                rowNode.classList.add('end')
                rowNode.innerHTML += '<span class="tip">end</span>'
            }
            
            rowNode.innerHTML += `<span>[x: ${x}; y: ${y}]</span>`
            gridRow.insertAdjacentElement('beforeend', rowNode)
        }
        grid.insertAdjacentElement('beforeend', gridRow)
    }

    return grid
}

export default Grid