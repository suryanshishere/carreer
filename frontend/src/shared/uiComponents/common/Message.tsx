import React from 'react';

interface MessageProps {
  messageData: string;
}

const Message: React.FC<MessageProps> = ({ messageData }) => {
  return (
    <div className='message text-center'>{messageData}</div>
  );
}

export default Message;
