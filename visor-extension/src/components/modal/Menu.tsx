import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import MenuOptions from "./MenuOptions"

interface MenuOptionProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
}

const Menu = (props: MenuOptionProps) => {
  return (
  <div style={divStyle}>
    <MenuOptions handleSelection={props.handleSelection} keyDown={props.keyDown} />
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '160px',
}


export default Menu;
