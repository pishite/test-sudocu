import React from 'react';

function Cell(props) {
    const {
        cell: {
            number,
            isHover,
            isActive,
            isDefault
        },
        chords,
        isError,
        setActive
    } = props;
    const clazz = [
        "table-cell",
        isDefault ? 'default' : null,
        isActive ? 'active' : null,
        isError ? 'error' : null,
        isHover ? 'hover' : null
    ];

    return (
        <div
            className={clazz.join(' ')}
            onClick={() => setActive(chords)}
        >
            {number}
        </div>
    )
}

export default Cell;
