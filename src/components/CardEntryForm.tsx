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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Mock card sets for the dropdown
  const cardSets = [
    { value: "base-set", label: "Base Set" },
    { value: "jungle", label: "Jungle" },
    { value: "fossil", label: "Fossil" },
    { value: "team-rocket", label: "Team Rocket" },
    { value: "gym-heroes", label: "Gym Heroes" },
    { value: "modern-horizons", label: "Modern Horizons" },
    { value: "throne-of-eldraine", label: "Throne of Eldraine" },
    { value: "kamigawa-neon-dynasty", label: "Kamigawa: Neon Dynasty" },
  ];

  // Mock search function
  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call with timeout
    setTimeout(() => {
      const mockResults = [
        {
          name: `${searchQuery} - Card 1`,
          imageUrl:
            "https://images.unsplash.com/photo-1581345628466-d71a791144b9?w=400&q=80",
        },
        {
          name: `${searchQuery} - Card 2`,
          imageUrl:
            "https://images.unsplash.com/photo-1540151812223-c30b3fab58e6?w=400&q=80",
        },
        {
          name: `${searchQuery} - Card 3`,
          imageUrl:
            "https://images.unsplash.com/photo-1627646419341-c789dfee2c02?w=400&q=80",
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const selectCard = (card: { name: string; imageUrl: string }) => {
    setCardData({
      ...cardData,
      name: card.name,
      imageUrl: card.imageUrl,
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
        <CardTitle>{initialData.id ? "Edit Card" : "Add New Card"}</CardTitle>
        <CardDescription>
          {mode === "trade"
            ? "Add a card to your trade list"
            : "Add a card to your want list"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Card</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Search for a card..."
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
                        src={result.imageUrl}
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
            <Label htmlFor="name">Card Name</Label>
            <Input
              id="name"
              name="name"
              value={cardData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="set">Card Set</Label>
            <Select
              value={cardData.set}
              onValueChange={(value) =>
                setCardData({ ...cardData, set: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a card set" />
              </SelectTrigger>
              <SelectContent>
                {cardSets.map((set) => (
                  <SelectItem key={set.value} value={set.value}>
                    {set.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Card Condition</Label>
            <RadioGroup
              value={cardData.condition}
              onValueChange={(value) =>
                setCardData({ ...cardData, condition: value })
              }
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Mint" id="mint" />
                <Label htmlFor="mint">Mint</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Near Mint" id="near-mint" />
                <Label htmlFor="near-mint">Near Mint</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Played" id="played" />
                <Label htmlFor="played">Played</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
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

          {cardData.imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Card Preview</p>
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
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData.id ? "Update" : "Add"} Card
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardEntryForm;
