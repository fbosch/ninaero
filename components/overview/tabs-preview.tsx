import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ninaero/ui/tabs";

export function TabsPreview() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-72">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-2">
        Overview panel
      </TabsContent>
      <TabsContent value="details" className="p-2">
        Details panel
      </TabsContent>
    </Tabs>
  );
}
