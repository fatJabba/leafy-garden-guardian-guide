
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionLink,
  icon = <Leaf className="h-12 w-12 text-garden-500 mb-4" />,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      <Button asChild className="mt-4 bg-garden-500 hover:bg-garden-600">
        <Link to={actionLink}>{actionLabel}</Link>
      </Button>
    </div>
  );
};

export default EmptyState;
