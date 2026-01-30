import { Check } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="bg-gray-900 text-white p-2.5 sm:p-3 rounded-xl shadow-lg">
          <Check
            className="w-6 h-6 sm:w-8 sm:h-8"
            strokeWidth={3}
          />
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1.5 sm:mb-2 tracking-tight">
        RecruitPro
      </h1>
      <p className="text-sm sm:text-base text-gray-500 font-medium">
        The intelligent platform for modern hiring.
      </p>
    </div>
  );
}
