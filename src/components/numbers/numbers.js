import React from 'react';

function Numbers(props) {
    const { setNumber } = props;

    return (
        <ul className="panel-number">
            {(new Array(9)
                .fill(1)
                .map((i, number) =>
                    (<li onClick={() => {
                        setNumber('' + (number + 1));
                        return false
                    }}>
                        <a href="#">{number + 1}</a>
                    </li>)
                )
            )}

            <li onClick={() => {
                setNumber('');
                return false
            }}>
                <a href="#">✕</a>
            </li>
        </ul>
    )
}

export default Numbers;
