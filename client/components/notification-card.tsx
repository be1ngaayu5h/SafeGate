import React from "react";

interface NotificationCardProps {
  title: string;
  count: number;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  count,
}) => {
  return (
    <div className="border-[1px] w-full px-4 py-3 rounded-lg shadow-lg">
      <h1 className="font-semibold">{title}</h1>
      <p className="text-gray-400">{count}</p>
    </div>
  );
};

export default NotificationCard;
