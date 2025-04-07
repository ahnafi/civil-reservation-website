import { useState, useMemo, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { SimpleOption } from "@/types";

export default function SearchableSelect({
                                             label,
                                             options,
                                             selectedOption,
                                             setSelectedOption,
                                             placeholder = "Cari...",
                                             searchIcon = <Search size={14} />, // slightly larger icon
                                         }: {
    label: string;
    options: SimpleOption[];
    selectedOption: SimpleOption | null;
    setSelectedOption: (option: SimpleOption | null) => void;
    placeholder?: string;
    searchIcon?: ReactNode;
}) {
    const [query, setQuery] = useState("");

    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, options]);

    const handleSelect = (option: SimpleOption) => {
        setSelectedOption(option);
        setQuery(option.name);
    };

    const handleClear = () => {
        setSelectedOption(null);
        setQuery("");
    };

    return (
        <div className="w-full max-w-xs space-y-1">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {searchIcon}
                </span>
                <input
                    type="text"
                    className="w-full pl-8 pr-7 py-1.5 text-sm shadow-sm rounded-md border border-muted bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={placeholder}
                    value={selectedOption ? selectedOption.name : query}
                    onChange={(e) => setQuery(e.target.value)}
                    readOnly={!!selectedOption}
                />
                {selectedOption && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X size={14} />
                    </button>
                )}
                {!selectedOption && query && (
                    <div className="absolute z-10 mt-1 w-full max-h-36 overflow-auto border border-muted rounded bg-background shadow-sm">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className="px-3 py-1.5 hover:bg-muted cursor-pointer text-sm"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-muted-foreground text-sm">
                                Tidak ditemukan
                            </div>
                        )}
                    </div>
                )}
            </div>
            {selectedOption && (
                <div className="text-sm text-muted-foreground mt-1">
                    Dipilih: <strong>{selectedOption.name}</strong>
                </div>
            )}
        </div>
    );
}
