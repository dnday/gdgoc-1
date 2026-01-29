import { Check } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-900 text-white p-3 rounded-xl shadow-lg">
          <Check
            className="w-8 h-8"
            strokeWidth={3}
          />
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
        RecruitPro
      </h1>
      <p className="text-gray-500 font-medium">
        The intelligent platform for modern hiring.
      </p>
    </div>
  );
}
