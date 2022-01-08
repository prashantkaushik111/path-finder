const pathFind = document.getElementById('path-find');
const heading = document.getElementById('matrix-head');
const startButton = document.getElementById('start');
const selectAlgo = document.getElementById('select-algo');
const cancelButton = document.getElementById('cancel');
const alignSelect = document.getElementById('align-select');
let startIndex = [];
let endIndex = [];
let hurdles = [];
let grid = [];


startButton.addEventListener('click', ()=> {
    startButton.disabled = true;
    heading.innerHTML = selectAlgo.value;
    if(heading.innerHTML === 'DFS') {
        dfs();
    } 
    else {
        bfs();
    }
});

cancelButton.addEventListener('click', ()=> {
    window.location.reload();
});
let delX = [-1,0,1,0];
let delY = [0,1,0,-1];
function isValid(a,b,c,d) {
    if((a < 0) || (b < 0) || (a>=c) || (b>=d)) {
        return false;
    }
    return true;
}

async function dfsUtil(i, j) {
    if((i === endIndex[0]) && (j === endIndex[1])) {
        return true;
    }
    const rows = document.querySelectorAll('tr');
    const gridColumn = rows[i].childNodes;
    // console.log('gridColumn', gridColumn);
    console.log('s', i, j);
    if((i !== startIndex[0]) || (j !== startIndex[1])) {
        gridColumn[j].style.backgroundColor = 'blue';

        await new Promise((resolve, reject) => {
            setTimeout(()=> {
                resolve();
            }, 100);
        });
    }
    for(let k=0; k <4; k++) {
        const dx = i + delX[k];
        const dy = j + delY[k];
        let result = false;
        if(isValid(dx, dy, grid.length, grid[0].length) && (grid[dx][dy] !== 3) && (grid[dx][dy] !== -100)) {
            grid[dx][dy] = 3;
          await dfsUtil(dx, dy).then((value)=> {
                console.log('value1', value);
               result = value;
            });
            if(result) {
                return true;
            }
        }
    }

    if((i !== startIndex[0]) || (j !== startIndex[1])) {
        gridColumn[j].style.backgroundColor = '';

        await new Promise((resolve, reject) => {
            setTimeout(()=> {
                resolve();
            }, 100)
        });
    }
    return false;
}
function dfs() {
    hurdles.forEach(([a, b]) => {
        grid[a][b] = -100;
    })
    grid[startIndex[0]][startIndex[1]] = 3;
    grid[endIndex[0]][endIndex[1]] = 2;
    console.log('start', startIndex[0], startIndex[1]);
    dfsUtil(startIndex[0], startIndex[1]);
}
async function bfsUtil(i, j) {
    let queue = [];
    queue.push([i, j]);
    const rows = document.querySelectorAll('tr');
    while(queue.length > 0) {
        let enq = queue.shift();
        
        const gridColumn = rows[enq[0]].childNodes;
        console.log('enq', enq, grid.length, grid[0].length, gridColumn);
        if((enq[0] === endIndex[0])&&(enq[1] === endIndex[1])) {
            console.log('xit');
            break;
        }
        if((enq[0] !== startIndex[0]) || (enq[1] !== startIndex[1])) {
            gridColumn[enq[1]].style.backgroundColor = 'blue';

            await new Promise((resolve, reject) => {
                setTimeout(()=> {
                    resolve();
                }, 100);
            });
        }
        for(let k = 0; k <4; k++) {
            const dx = enq[0] + delX[k];
            const dy = enq[1] + delY[k];
            console.log('aa',dx, dy)
            if(isValid(dx, dy, grid.length, grid[0].length) && (grid[dx][dy] !== 3) && (grid[dx][dy] !== -100)) {
                grid[dx][dy] = 3;
                queue.push([dx, dy]);
            }
        }
    }
}
function bfs() {
    hurdles.forEach(([a, b]) => {
        grid[a][b] = -100;
    })
    grid[startIndex[0]][startIndex[1]] = 3;
    grid[endIndex[0]][endIndex[1]] = 2;
    console.log('start', startIndex[0], startIndex[1]);
    bfsUtil(startIndex[0], startIndex[1]);
}
function getRandomInRange(start, end) {
    return Math.floor(Math.random()*(end - start)) + start;
}

function initializeTable() {
    const rows = getRandomInRange(10, 20);
    const cols = getRandomInRange(10, 20);
    console.log('rows', rows, cols);
    const fragment = document.createDocumentFragment();
    
    for(let j=0; j<rows; j++) {
        const coloumnFragment = document.createDocumentFragment();
        const rowElement = document.createElement('tr');
        const row = [];
        for(let i=0; i < cols; i++) {
            const colElement = document.createElement('td');
            row.push(0);
            colElement.addEventListener('click', function() {
                if(startIndex.length === 0) {
                    startIndex.push(j);
                    startIndex.push(i);
                    colElement.style.backgroundColor = 'red';
                    heading.innerHTML = 'Select Destination';
                }
                else if(endIndex.length === 0) {
                    if((j === startIndex[0])&&(i === startIndex[1])) {
                        return;
                    }
                    endIndex.push(j);
                    endIndex.push(i);
                    startButton.disabled = false;
                    colElement.style.backgroundColor = 'green';
                    heading.innerHTML = 'Select Obstacles';
                    alignSelect.style.display = 'block';
                }
                else {
                    if(((j === startIndex[0])&&(i === startIndex[1])) || ((j === endIndex[0])&&(i === endIndex[1]))) {
                        return;
                    }
                    if(heading.innerHTML !== 'Select Obstacles') {
                        return;
                    }
                    let hurdleIndex = [];
                    hurdleIndex.push(j);
                    hurdleIndex.push(i);
                    hurdles.push(hurdleIndex);
                    colElement.style.backgroundColor = 'black';
                }
                console.log(i, j);
            });
            coloumnFragment.appendChild(colElement);
        }
        grid.push(row);
        rowElement.appendChild(coloumnFragment);
        fragment.appendChild(rowElement);
    }

    pathFind.appendChild(fragment);
}

initializeTable();

console.log('grid', grid);
// const rows = document.querySelectorAll('tr');
// const gridColumn = rows[0].childNodes
// console.log('rows', rows, gridColumn[0].style.backgroundColor = 'green');
