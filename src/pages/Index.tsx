
import NavBar from "@/components/NavBar";
import PlantCard from "@/components/PlantCard";
import EmptyState from "@/components/EmptyState";
import { getActivePlants, getCompostedPlants } from "@/lib/plant-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const activePlants = getActivePlants();
  const compostedPlants = getCompostedPlants();
  const hasActivePlants = activePlants.length > 0;
  const hasCompostedPlants = compostedPlants.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Garden</h1>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Plants</TabsTrigger>
            <TabsTrigger value="indoor">Indoor</TabsTrigger>
            <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            <TabsTrigger value="compost">Compost</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {hasActivePlants ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activePlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    id={plant.id}
                    name={plant.name}
                    species={plant.species}
                    imageUrl={plant.imageUrl}
                    lastWatered={plant.lastWatered}
                    wateringFrequency={plant.wateringFrequency}
                    sunlight={plant.sunlight}
                    temperature={plant.temperature}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No plants yet"
                description="Add your first plant to start tracking your garden."
                actionLabel="Add Plant"
                actionLink="/add-plant"
              />
            )}
          </TabsContent>
          <TabsContent value="indoor" className="mt-6">
            <EmptyState
              title="No indoor plants"
              description="Add indoor plants to see them here."
              actionLabel="Add Indoor Plant"
              actionLink="/add-plant"
            />
          </TabsContent>
          <TabsContent value="outdoor" className="mt-6">
            <EmptyState
              title="No outdoor plants"
              description="Add outdoor plants to see them here."
              actionLabel="Add Outdoor Plant"
              actionLink="/add-plant"
            />
          </TabsContent>
          <TabsContent value="compost" className="mt-6">
            {hasCompostedPlants ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {compostedPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    id={plant.id}
                    name={plant.name}
                    species={plant.species}
                    imageUrl={plant.imageUrl}
                    lastWatered={plant.lastWatered}
                    wateringFrequency={plant.wateringFrequency}
                    sunlight={plant.sunlight}
                    temperature={plant.temperature}
                    composted
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No composted plants"
                description="Plants you delete will appear here."
                actionLabel="Back to Garden"
                actionLink="/"
              />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 p-6 rounded-lg garden-pattern">
          <h2 className="text-xl font-semibold mb-3">Garden Tips</h2>
          <p className="mb-4">Watering reminder: Check your Monstera Deliciosa, it might need water soon!</p>
          <p>Spring is a great time to check your soil quality and add nutrients if needed.</p>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ♥ for your plants. <a href="#" className="font-medium underline underline-offset-4">Get garden advice</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
