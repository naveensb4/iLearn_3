import React from 'react';

const CalendlyOnboarding = () => {
  return (
    <div className="onboarding-container">
      <h2>How to Set Up Your Calendly/Google Calendar Link</h2>
      <ol>
        <li>
          <strong>Create an Account on Calendly:</strong> Go to <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">Calendly</a> and create an account.
        </li>
        <li>
          <strong>Set Up Availability:</strong> Create an event specifically for coffee chats (e.g., 30-minute slots).
        </li>
        <li>
          <strong>Copy Event Link:</strong> Once the event is set up, copy the link to the event.
        </li>
        <li>
          <strong>Add the Link to Your Profile:</strong> Go to your profile in this app and paste the link under "Calendly Link".
        </li>
      </ol>
      <p>Once your link is added, others can book a coffee chat with you directly!</p>
    </div>
  );
};

export default CalendlyOnboarding;
