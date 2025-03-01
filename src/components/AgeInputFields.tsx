import { ChevronDown, ChevronUp } from "lucide-react";
import DefaultInput from "./DefaultInput";
import DefaultText from "./DefaultText";
import '../styles/AgeInputFields.css'

interface AgeInputFieldsProps {
  ageMin: number;
  ageMax: number;
  onMinAgeChange: (value: number) => void;
  onMaxAgeChange: (value: number) => void;
}

export default function AgeInputFields({ ageMin, ageMax, onMinAgeChange, onMaxAgeChange }: AgeInputFieldsProps) {
  return (
    <div className="flex gap-4 mt-4">
      <div>
        <DefaultText weight="bold" className="block">Min Age</DefaultText>
        <div className="flex flex-row items-center">
          <DefaultInput
            readOnly
            id="min-age"
            value={ageMin}
            className="mt-2 h-10"
          />
          <div className="flex flex-col items-center mt-2">
            <ChevronUp className="chevron" onClick={() => onMinAgeChange(ageMin + 1)} />
            <ChevronDown className="chevron" onClick={() => onMinAgeChange(Math.max(0, ageMin - 1))} />
          </div>
        </div>
      </div>
      <div>
        <DefaultText weight="bold" className="block">Max Age</DefaultText>
        <div className="flex flex-row items-center">
          <DefaultInput
            readOnly
            id="max-age"
            value={ageMax}
            className="mt-2 h-10"
          />
          <div className="flex flex-col items-center mt-2">
            <ChevronUp className="chevron" onClick={() => onMaxAgeChange(ageMax + 1)} />
            <ChevronDown className="chevron" onClick={() => onMaxAgeChange(Math.max(ageMin, ageMax - 1))} />
          </div>
        </div>
      </div>
    </div>
  );
};
