const insertElement = (element, parent) => {
    const rootElement = document.getElementById(parent)

    rootElement.insertAdjacentElement('beforeend', element) 
}

export const render = (elements, rootId = 'root') => {
    if(Array.isArray(elements)) {
        for(const element of elements) {
            insertElement(element, rootId)
        }
    } else {
        insertElement(elements, rootId)
    }
}

export function getGridFromMatrix(gridList, startX, startY, endX, endY) {
    const start = [startX, startY]
    const end = [endX, endY]

    const graph = new Graph(gridList)
    const path = Graph.shortPath(graph, start, end)
    
    const grid = {
    	coordsMatrix: Grid.generateMatrixFromGrid(gridList), 
        start, 
        end
    }

    return { path, grid };
}

export const coordsToString = (c) => `${c.x}${c.y}`

export class Grid {
    constructor(gridList) {
        if(gridList) return this.generateGraphFromGrid(gridList)
    }

    static generateMatrixFromGrid(gridList) {
        return gridList.map((string, idx) => {
            let splitted = string.split('')
            let x = 0
            while(x < splitted.length) {
                splitted[x] = { 
                    isBlocked: splitted[x] === 'X',
                    x,
                    y: idx
                }
                x++
            }
            return splitted
        })
    }

    generateGraphFromGrid(gridList) {
        const coordsMatrix = Grid.generateMatrixFromGrid(gridList)

        let graph = {}
        let counter = 1
    
        const matrixHeight = coordsMatrix.length 
        const matrixWidth = coordsMatrix[0].length  
    
        for(let i = 0; i < coordsMatrix.length; i++) {
            for(let j = 0; j < coordsMatrix[i].length; j++) {
                if(coordsMatrix[i][j].isBlocked) continue
    
                graph[counter] = { coords: { x: coordsMatrix[i][j].x, y: coordsMatrix[i][j].y } }
                counter += 1
            }
        }
    
        const nodesCoordsToString = []
    
        for(let node in graph) {
            nodesCoordsToString.push([graph[node].coords.x, graph[node].coords.y].join(''))
        }
    
        for(let node in graph) {
            const x = graph[node].coords.x
            const y = graph[node].coords.y
            
            const edges = this._generateEdges(x, y, { matrixHeight, matrixWidth }, graph, nodesCoordsToString)
            
            graph[node].edges = edges
        }
    
        return graph
    }

    _generateEdges (x, y, borders, graph, nodesCoords) {
        const moves = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            
            [x, y - 1],
            [x, y + 1],
            
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
        ] 
    
        const coordMoves = moves
            .filter(move => {
                return nodesCoords.includes(move.join('')) 
                	&& move.every((i, idx) => (
                  	idx === 0 ? i <= borders.matrixWidth : i <= borders.matrixHeight
                  ) && i >= 0 )
            })
            .map(coord => coord.join(''))
    
        const edges = []
    
        for(let node in graph) {
            const graphNodeToString = [
            	graph[node].coords.x, 
              graph[node].coords.y
            ].join('')
            if(coordMoves.includes(graphNodeToString)) edges.push(node)
        }
    
        return edges
    }
}

export class Graph extends Grid {
    constructor(gridList) {
        super()
        if(gridList) return super.generateGraphFromGrid(gridList)
    }

    static graphFromGrid(grid) {
        return new Grid(grid)
    }

    static _coordToGraphNode(graph, coord) {
        for(let node in graph) {
            const graphNodeToSrting = [graph[node].coords.x, graph[node].coords.y].join('')
            if(graphNodeToSrting === coord.join('')) return node
        }
    }

    static _graphNodeToCoord(graph, nodes) {
        return nodes.map(node => {
            return graph[node].coords
        })
    }

    static shortPath(graph, start, end) {
        const nodeStart = this._coordToGraphNode(graph, start)
        const nodeEnd = this._coordToGraphNode(graph, end)
        
        if(!nodeStart || !nodeEnd ) {
          	return new Error('Start or end point out of provided grid. Either spotted at blocked cell.')
        }
    
        const parents = {}
        const queue = [nodeStart]
        let pathNodes = []
    
        while(queue.length !== 0) {
            const current = queue.shift()
    
            if(current === nodeEnd) {
                pathBack(nodeEnd)
                break
            }
    
            Object.values(graph[current].edges).forEach(e => {
                if(!queue.includes(e)) { 
                    queue.push(e)
                    if(parents[e]) return 
                    else parents[e] = current
                }
            })
        }
    
        function pathBack(node) {
            if(node === nodeStart) return pathNodes.push(node)
            
            pathNodes.push(node)
            return pathBack(parents[node])
        }
    
        return this._graphNodeToCoord(graph, pathNodes.reverse())
    }
}
