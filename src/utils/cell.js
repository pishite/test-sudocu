import startData from '../data/start';

const cellObject = {
    number: '',
    isDefault: false,
    isActive: false,
    isHover: false,
    isFull: false
};

function createCell(number = 0) {
    return this;
}

createCell.prototype = cellObject;

export function newMap() {
    const maps = (new Array(9)
            .fill('')
            .map(() =>
                new Array(9)
                    .fill('')
                    .map(() => new createCell())
            )
    );

    setActive([0,0], [7, 1], maps);

    return fillMap(startData, maps);
}

function fillMap(array, maps) {
    array.forEach((line, y) =>
            line.forEach((number, x) => {
                if (number) {
                    maps[y][x].number = number + '';
                    maps[y][x].isDefault = true;
                }
            })
        );

    return maps;
}

export function setActive(currentActiveChords, newActiveChords, maps) {
    const [ currentX, currentY ] = currentActiveChords;
    const [ newX, newY ] = newActiveChords;

    if (currentX === newX && currentY === newY)
        return maps;

    const newMaps = maps.map((line, y) => {
        if (y === newY) {
            line.forEach(cell =>
                cell.isHover = true );

            line[newX].isActive = true;
        } else if (y === currentY) {
            line.forEach(cell =>
                cell.isHover = false);

            line[newX].isHover = true;
        } else
            line.forEach((cell, x) => {
                if (x === newX)
                    cell.isHover = true;
                else if (x === currentX)
                    cell.isHover = false;
            });

        return line
    });

    newMaps[currentY][currentX].isActive = false;

    return newMaps;
}

export function setNumber([x, y], number, maps) {
    const newMaps = maps.map(line => line.map(cell => ({...cell})));

    newMaps[y][x].number = number;

    return newMaps;
}

export function getMatches([x, y], number, maps, {h, v, s}) {
    const matches = {h: new Set(h), v: new Set(v), s: new Set(s)};

    if (number && maps[y].filter(cell => cell.number === number).length)
        matches.v.add(y);
    else if (matches.v.has(y)) {
        let arr = [number];

        maps[y].forEach((cell, i) => {
            if (x !== i && cell.number)
                arr.push(cell.number)
        });

        if (arr.length === (new Set(arr)).size)
            matches.v.delete(y)
    }


    if (number && maps.filter(line => line[x].number === number).length)
        matches.h.add(x);
    else if (matches.h.has(x)) {
        let arr = [number];

        maps.forEach((line, i) => {
            if (y !== i && line[x].number)
                arr.push(line[x].number)
        });

        if (arr.length === (new Set(arr)).size)
            matches.h.delete(x)
    }


    const [square, cx, cy] = [[], Math.floor(x / 3), Math.floor(y / 3)];

    maps.forEach((line, j) => {
        if (cy*3 > j || j >= cy*3 + 3)
            return;

        line.forEach((cell, i) => {
            if (cx*3 > i || i >= cx*3 + 3)
                return;

            if (i === x && j === y) {
                if (number)
                    square.push(number);
            } else if (cell.number)
                square.push(cell.number)
        });
    });

    if (square.length === (new Set(square)).size)
        matches.s.delete(cx + '' + cy)
    else
        matches.s.add(cx + '' + cy)

    return matches;
}

export function isWin(matches, maps) {
    const {h, v, s} = matches;
    const count = 81;

    if (h.size || v.size || s.size)
        return false;

    return !maps.reduce((previous, current, i) => {
        previous = typeof previous === 'object' ? count - previous.filter(cell => cell.number).length : previous;
        return previous - current.filter(cell => cell.number).length;
    });
}
