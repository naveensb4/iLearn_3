// src/components/CoffeeChatBooking.js

import React from 'react';
import { InlineWidget } from 'react-calendly';

const CoffeeChatBooking = ({ calendlyLink }) => {
  return (
    <div>
      <InlineWidget url={calendlyLink} />
    </div>
  );
};

export default CoffeeChatBooking;
