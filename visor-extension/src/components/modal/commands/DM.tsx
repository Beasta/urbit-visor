import { Command } from "../types";
import React from "react";
import UrbitInterface from '@urbit/http-api';
import { addDmMessage } from '@urbit/api';


export const DM: Command = {
  command: 'poke',
  title: 'message',
  description: 'send a message to a ship',
  arguments: ['ship', 'message'],
  schema: [(props: any[]) => addDmMessage(props[0], props[1][0].innerHTML, [{text: props[2][1].innerHTML}])],
}

