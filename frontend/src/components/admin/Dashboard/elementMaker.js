// ElementMaker.js

import React from "react";

// Creat an ElementMaker component
function elementMaker(props) {
  return (
    // Render a <span> element
    <span>
      {
        // Use JavaScript's ternary operator to specify <span>'s inner content
        props.showInputEle ? (
          <textarea 
            type="number"
            value={props.value}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            style={{width: "300px", height: "250px"}}
            autoFocus
          />
        ) : (
          <h2 
            onDoubleClick={props.handleDoubleClick}
          >
            {props.value}
          </h2>
        )
      }
    </span>
  );
}

export default elementMaker;