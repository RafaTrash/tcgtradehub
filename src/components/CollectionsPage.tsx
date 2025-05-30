import React, { useState } from "react";
import { cardSets } from "./CardEntryForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CollectionsPage: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Coleções</h2>
      <div className="mb-4 max-w-xs">
        <Select value={selectedSet} onValueChange={setSelectedSet}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por coleção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as coleções</SelectItem>
            {cardSets.map((set) => (
              <SelectItem key={set.value} value={set.value}>
                {set.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Aqui você pode filtrar e exibir as coleções conforme o selectedSet */}
      <p>
        {selectedSet
          ? `Exibindo cartas da coleção: ${cardSets.find(
              (s) => s.value === selectedSet
            )?.label}`
          : "Exibindo todas as coleções"}
      </p>
      {/* ...lista de coleções/cartas filtradas... */}
    </div>
  );
};

export default CollectionsPage;