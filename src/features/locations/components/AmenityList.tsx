import { Check } from "lucide-react";

interface AmenityListProps {
  amenities: string[];
}

export function AmenityList({ amenities }: AmenityListProps) {
  if (!amenities || amenities.length === 0) return null;
  
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {amenities.map((amenity, index) => (
        <li key={index} className="flex items-center text-sm text-muted-foreground">
          <div className="bg-brand-saffron/10 p-1 rounded-full mr-2">
            <Check className="h-3 w-3 text-brand-saffron" />
          </div>
          {amenity}
        </li>
      ))}
    </ul>
  )
}
