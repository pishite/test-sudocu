import React, { Component } from 'react';
import Cell from "../cell";
import '../../sass/main.sass';

import { newMap, setActive, setNumber, getMatches, isWin } from '../../utils/cell';
import Numbers from "../numbers";

class App extends Component
{
    state = {
        cells: newMap(),
        activeCell: [7, 1],
        matches: {h: new Set(), v: new Set(), s: new Set()}
    };

    componentDidMount() {
        document.addEventListener('keypress', (event) => {
            this.setNumber(event.key);
        });
    }

    setActive = ([x, y]) => {
        const { activeCell, cells } = this.state;

        this.setState({
            activeCell: [x, y],
            cells: setActive(activeCell, [x, y], cells)
        });
    };

    setNumber = (number = '') => {
        const { activeCell: [x, y], cells } = this.state;

        if (cells[y][x].isDefault || cells[y][x].number === number)
            return;

        const { activeCell } = this.state;
        const matches = getMatches(activeCell, number, cells, this.state.matches);

        number = /^[1-9]$/.test(number) ? number : '';

        this.setState({
            cells: setNumber(activeCell, number, cells),
            matches
        });
    };

    render() {
        const { cells, matches } = this.state;

        if (isWin(matches, cells))
            return 'you win!';

        return (
            <div className="sudoku">

                <div className="table">
                    {cells.map((el, y) => {
                        const isError = matches.v.has(y)
                        const cy = Math.floor(y / 3);

                        return (
                            <div key={y} className="table-row">
                                {el.map((number, x) =>
                                    <Cell key={x}
                                          chords={[x, y]}
                                          cell={number}
                                          isError={isError || matches.h.has(x) || matches.s.has(Math.floor(x / 3) + '' + cy)}
                                          setActive={this.setActive}/>
                                )}
                            </div>
                        )
                    })}
                </div>

                <Numbers setNumber={this.setNumber}/>

            </div>
        )
    }
}

export default App;
