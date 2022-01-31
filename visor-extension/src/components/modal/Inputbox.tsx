import React from "react";
import * as CSS from "csstype";
import { useEffect, useState, useRef } from "react";
import Urbit from "@urbit/http-api";
import PokeInput from "./input/PokeInput";
import ScryInput from "./input/ScryInput";
import BitcoinInput from "./input/BitcoinInput";
import SubscribeInput from "./input/SubscribeInput";
import SpiderInput from "./input/SpiderInput";
import TerminalInput from "./input/TerminalInput";


interface InputProps {
  selected: String;
  baseFocus: Boolean;
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
  clearSelected: (clear: Boolean) => void;
  spaceAllowed: (space: Boolean) => void;
}


const Inputbox = (props: InputProps) => {
  const baseInput = useRef(null);
  useEffect(() => {if (!props.selected) baseInput.current.focus()}, [props.baseFocus])
  return (
    <div style={divStyle} className="modal-input-box">
      {(() => {
        switch (props.selected) {
          case 'poke':
            return (
              <PokeInput
                nextArg={props.nextArg}
                sendCommand={props.sendCommand}
                airlockResponse={props.airlockResponse}
                clearSelected={props.clearSelected}
              />
            );
            break;
          case 'scry':
            return (
              <ScryInput
                nextArg={props.nextArg}
                sendCommand={props.sendCommand}
                airlockResponse={props.airlockResponse}
              />
            );
            break;
          case 'bitcoin':
            return <BitcoinInput nextArg={props.nextArg} sendCommand={props.sendCommand} />;
            break;
          case 'subscribe':
            return (
              <SubscribeInput
                nextArg={props.nextArg}
                sendCommand={props.sendCommand}
                airlockResponse={props.airlockResponse}
              />
            );
            break;
          case 'thread':
            return (
              <SpiderInput
                nextArg={props.nextArg}
                sendCommand={props.sendCommand}
                airlockResponse={props.airlockResponse}
              />
            );
            break;
          case 'terminal':
            return (
              <TerminalInput
                nextArg={props.nextArg}
                sendCommand={props.sendCommand}
                airlockResponse={props.airlockResponse}
              />
            );
            break;
          default:
            return <input ref={baseInput} type={'text'} style={inputStyle} />;
        }
      })()}
    </div>
  );
};

const inputStyle: CSS.Properties = {
  fontSize: '18px',
  height: '34px',
  width: '-webkit-fill-available',
  padding: '0',
};

const divStyle: CSS.Properties = {
  padding: '2px',
  fontSize: '18px',
  height: '34px',
  outline: 'none',
};

export default Inputbox;