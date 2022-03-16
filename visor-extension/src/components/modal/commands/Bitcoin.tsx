import { Command } from '../types';
import React from 'react';
import bitcoinIcon from '../../../icons/bitcoin.svg';

const Icon = () => <img src={bitcoinIcon} />;

export const Bitcoin: Command = {
  title: 'Bitcoin',
  icon: <Icon />,
  description: 'open Bitcoin wallet',
};
