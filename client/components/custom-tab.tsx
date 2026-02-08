import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./quick-action/Overview";
import Visitors from "./quick-action/Visitors";
import Security from "./quick-action/Security";

const CustomTab = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="visitors">Visitors</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Overview />
      </TabsContent>
      <TabsContent value="visitors">
        <Visitors />
      </TabsContent>
      <TabsContent value="security">
        <Security />
      </TabsContent>
    </Tabs>
  );
};

export default CustomTab;
