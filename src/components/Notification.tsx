interface NotificationProps {
    message: string;
  }
  
  export const Notification: React.FC<NotificationProps> = ({ message }) => {
    return <div>{message}</div>;
  };
  