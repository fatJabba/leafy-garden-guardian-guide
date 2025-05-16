
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sprout, Plus, Menu, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const { user, signOut } = useAuth();
  
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "??";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-garden-500" />
            <span className="text-xl font-semibold">PlantPal</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/add-plant">
            <Button className="hidden sm:flex bg-garden-500 hover:bg-garden-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
            <Button size="icon" className="sm:hidden bg-garden-500 hover:bg-garden-600">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
