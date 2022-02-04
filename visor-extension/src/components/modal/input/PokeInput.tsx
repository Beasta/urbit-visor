import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import { Messaging } from "../../../messaging";
import Urbit from "@urbit/http-api";
import Input from "../Input";
import { Command } from "../types";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
  clearSelected: (clear: Boolean) => void;
  selected: Command;
}

const PokeInput = (props: InputProps) => {
  return (
  <Input {...props} />
  )
};

export default PokeInput;
