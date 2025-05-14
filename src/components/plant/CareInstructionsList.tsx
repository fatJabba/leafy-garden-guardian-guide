
import { Leaf } from "lucide-react";

interface CareInstructionsListProps {
  instructions: string[];
}

const CareInstructionsList = ({ instructions }: CareInstructionsListProps) => {
  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 bg-garden-50 p-4 rounded-md border border-garden-100">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-garden-600" />
        <h3 className="font-medium text-garden-800">Care Instructions</h3>
      </div>
      <ul className="space-y-1">
        {instructions.map((tip, index) => (
          <li key={index} className="text-sm flex">
            <span className="text-garden-600 mr-2">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareInstructionsList;
