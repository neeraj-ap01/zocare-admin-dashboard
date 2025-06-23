import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const safeOptions = options || [];
  const safeSelected = selected || [];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (value: string) => {
    const currentSelected = safeSelected || [];
    if (currentSelected.includes(value)) {
      onChange(currentSelected.filter((item) => item !== value));
    } else {
      onChange([...currentSelected, value]);
    }
  };

  const handleRemoveItem = (value: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentSelected = safeSelected || [];
    onChange(currentSelected.filter((item) => item !== value));
  };

  const getSelectedLabels = () => {
    const currentSelected = safeSelected || [];
    return safeOptions
      .filter((option) => currentSelected.includes(option.value))
      .map((option) => option.label);
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div
        className="flex min-h-[40px] w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, index) => {
              const option = safeOptions.find((opt) => opt.label === label);
              return (
                <span
                  key={`${option?.value}-${index}`}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {label}
                  <button
                    type="button"
                    className="ml-1 hover:text-foreground"
                    onClick={(e) => option && handleRemoveItem(option.value, e)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg">
          {safeOptions.length > 0 ? (
            safeOptions.map((option) => {
              const isSelected = safeSelected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleOptionToggle(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Controlled by parent onClick
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{option.label}</span>
                </div>
              );
            })
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
