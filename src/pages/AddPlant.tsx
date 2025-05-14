
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import PlantIdentification from "@/components/plant/PlantIdentification";
import PlantForm from "@/components/plant/PlantForm";
import usePlantForm from "@/hooks/usePlantForm";

const AddPlant = () => {
  const {
    imagePreview,
    identificationComplete,
    formData,
    careInstructions,
    isSaving,
    handleInputChange,
    handleIdentification,
    handleSubmit,
  } = usePlantForm();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to garden
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Plant</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <p className="text-muted-foreground">
                Take a photo of your plant for automatic identification, or add details manually.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!identificationComplete ? (
                <PlantIdentification onIdentification={handleIdentification} />
              ) : (
                <PlantForm
                  imagePreview={imagePreview}
                  formData={formData}
                  careInstructions={careInstructions}
                  handleInputChange={handleInputChange}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => history.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-garden-500 hover:bg-garden-600"
                disabled={(!identificationComplete) || isSaving}
              >
                {isSaving ? "Saving..." : "Add Plant"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddPlant;
