import { Button } from "@/components/ui/button";

interface NoPlansMessageProps {
  onCreateNew: () => void;
  isFiltered: boolean;
}

export default function NoPlansMessage({ onCreateNew, isFiltered }: NoPlansMessageProps) {
  return (
    <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {isFiltered ? "No matching plans found" : "No plans yet"}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {isFiltered
          ? "Try changing your filter criteria or create a new plan."
          : "Get started by creating your first travel plan."}
      </p>
      <div className="mt-6">
        <Button onClick={onCreateNew}>
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Plan
        </Button>
      </div>
    </div>
  );
}
