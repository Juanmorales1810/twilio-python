"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Seleccionar opción...",
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setOpen(!open)}
                className={cn("w-full justify-between", className)}
            >
                {selectedOption?.label || placeholder}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>

            {open && (
                <div className="absolute top-full z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => {
                                    onValueChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
