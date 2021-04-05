import React from 'react';

function Selector({ item, index, id }) {
    return (
        <option value={item}>{item}</option>
    );
}

export default Selector;
