
import { Button } from "@/components/ui/button";
import { Sprout, Plus, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-garden-500" />
            <span className="text-xl font-semibold">PlantPal</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <UserMenu />
          
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/add-plant">
            <Button className="hidden sm:flex bg-garden-500 hover:bg-garden-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
            <Button size="icon" className="sm:hidden bg-garden-500 hover:bg-garden-600">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
