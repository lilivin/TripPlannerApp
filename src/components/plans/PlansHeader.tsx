import { Button } from "@/components/ui/button";

interface PlansHeaderProps {
  title: string;
  totalPlans: number;
  onCreateNew: () => void;
}

export default function PlansHeader({ title, totalPlans, onCreateNew }: PlansHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">
          {totalPlans} {totalPlans === 1 ? "plan" : "plans"} available
        </p>
      </div>
      <Button onClick={onCreateNew}>Create New Plan</Button>
    </div>
  );
}
