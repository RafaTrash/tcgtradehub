import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";

interface CardEntryFormProps {
  onSubmit?: (cardData: CardData) => void;
  onCancel?: () => void;
  initialData?: CardData;
  mode?: "trade" | "want";
}

interface CardData {
  id?: string;
  name: string;
  set: string;
  condition: string;
  quantity: number;
  imageUrl?: string;
  original_name?: string;
  minprc?: number;
  maxprc?: number;
}

const CardEntryForm: React.FC<CardEntryFormProps> = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {
    name: "",
    set: "",
    condition: "Near Mint",
    quantity: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1581345628466-d71a791144b9?w=400&q=80",
  },
  mode = "trade",
}) => {
  const [cardData, setCardData] = useState<CardData>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; imageUrl: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [availableSets, setAvailableSets] = useState<string[]>([]);

  // Mock search function
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/cards?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data);

      // Extrai os valores únicos de set_name dos resultados
      const sets = Array.from(
        new Set(data.map((card: any) => card.set_name).filter(Boolean))
      );
      setAvailableSets(sets);
    } catch {
      setSearchResults([]);
      setAvailableSets([]);
    }
    setIsSearching(false);
  };

  const selectCard = (card: { minprc?: string | number; name: string; set_name?: string; imageUrl?: string; local_img?: string; original_name?: string; maxprc?: number }) => {
    setCardData({
      ...cardData,
      name: card.name,
      original_name: card.original_name || "",
      set: card.set_name || "",
      imageUrl: card.local_img ? `/cards/${card.local_img}` : card.imageUrl || "",
      minprc: card.minprc
        ? typeof card.minprc === "string"
          ? Number(card.minprc.replace(",", "."))
          : card.minprc
        : undefined,
      maxprc: card.maxprc,
    });
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cardData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <CardTitle>{initialData.id ? "Editar Carta" : "Adicionar Nova Carta"}</CardTitle>
        <CardDescription>
          {mode === "trade"
            ? "Adicione uma carta à sua lista de trocas"
            : "Adicione uma carta à sua lista de desejos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Carta</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Busque por uma carta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleSearch}
                variant="outline"
                size="icon"
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md overflow-hidden">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-accent flex items-center gap-2 cursor-pointer"
                    onClick={() => selectCard(result)}
                  >
                    <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                      <img
                        src={result.local_img ? `/cards/${result.local_img}` : result.imageUrl}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Carta</Label>
            <Input
              id="name"
              name="name"
              value={cardData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_name">Nome Original (opcional)</Label>
            <Input
              id="original_name"
              name="original_name"
              value={cardData.original_name}
              onChange={handleInputChange}
            />
        </div>

          <div className="space-y-2">
            <Label htmlFor="set">Coleção</Label>
            <Input
              id="set"
              name="set"
              value={cardData.set}
              readOnly
              placeholder="Coleção será preenchida automaticamente"
            />
          </div>

          <div className="space-y-2">
            <Label>Condição da Carta</Label>
            <RadioGroup
              value={cardData.condition}
              onValueChange={(value) =>
                setCardData({ ...cardData, condition: value })
              }
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Mint" id="mint" />
                <Label htmlFor="mint">Nova (Mint)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Near Mint" id="near-mint" />
                <Label htmlFor="near-mint">Quase Nova (Near Mint)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Good" id="good" />
                <Label htmlFor="good">Boa (Good)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Played" id="played" />
                <Label htmlFor="played">Usada (Played)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Poor" id="poor" />
                <Label htmlFor="poor">Ruim (Poor)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={cardData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="minprc" className="whitespace-nowrap text-sm">Valor Mínimo</Label>
              <Input
                id="minprc"
                name="minprc"
                type="text"
                value={
                  cardData.minprc !== undefined && cardData.minprc !== null
                    ? Number(
                        typeof cardData.minprc === "string"
                          ? cardData.minprc.replace(",", ".")
                          : cardData.minprc
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      })
                    : ""
                }
                readOnly
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="maxprc" className="whitespace-nowrap text-sm">Valor Máximo</Label>
              <Input
                id="maxprc"
                name="maxprc"
                type="text"
                value={
                  cardData.maxprc !== undefined && cardData.maxprc !== null
                    ? Number(
                        typeof cardData.maxprc === "string"
                          ? cardData.maxprc.replace(",", ".")
                          : cardData.maxprc
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      })
                    : ""
                }
                readOnly
              />
            </div>
          </div>

          {cardData.imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Prévia da Carta</p>
              <div className="w-full max-w-[200px] aspect-[2.5/3.5] mx-auto bg-muted rounded-md overflow-hidden">
                <img
                  src={cardData.imageUrl}
                  alt={cardData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {initialData.id ? "Atualizar" : "Adicionar"} Carta
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardEntryForm;
