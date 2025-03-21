// app/components/DataPointsSelector.tsx
"use client";

import { useState } from 'react';

interface DataPointsOption {
    label: string;
    value: number;
}

interface DataPointsSelectorProps {
    onChange: (dataPoints: number) => void;
    initialValue?: number;
}

const options: DataPointsOption[] = [
    { label: '10K', value: 10000 },
    { label: '100K', value: 100000 },
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
];

export default function DataPointsSelector({ onChange, initialValue = 1000000 }: DataPointsSelectorProps) {
    const [selectedValue, setSelectedValue] = useState<number>(initialValue);

    const handleChange = (value: number) => {
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Data Points:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleChange(option.value)}
                        className={`px-3 py-1 text-sm font-medium transition-colors 
              ${selectedValue === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
