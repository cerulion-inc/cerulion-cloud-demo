"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

const ServerCard = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/simulator");
  };

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>Simulator</CardTitle>
        <CardDescription>Welcome to your Simulator</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Dashboard content will go here */}
      </CardContent>
    </Card>
  );
};

export default ServerCard;