import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, MessageSquare, ArrowRight, Star } from "lucide-react";

interface CardItem {
  id: string;
  name: string;
  set: string;
  condition: string;
  quantity: number;
  image: string;
  rarity: string;
  game: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  cardsOffered: CardItem[];
  cardsRequested: CardItem[];
}

interface MatchDiscoveryProps {
  matches?: User[];
}

const MatchDiscovery = ({ matches = defaultMatches }: MatchDiscoveryProps) => {
  const [filter, setFilter] = useState({
    game: "all",
    rarity: "all",
    condition: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);

  const filteredMatches = matches.filter((match) => {
    // Apply filters
    const gameMatch =
      filter.game === "all" ||
      match.cardsOffered.some((card) => card.game === filter.game) ||
      match.cardsRequested.some((card) => card.game === filter.game);
    const rarityMatch =
      filter.rarity === "all" ||
      match.cardsOffered.some((card) => card.rarity === filter.rarity) ||
      match.cardsRequested.some((card) => card.rarity === filter.rarity);
    const conditionMatch =
      filter.condition === "all" ||
      match.cardsOffered.some((card) => card.condition === filter.condition) ||
      match.cardsRequested.some((card) => card.condition === filter.condition);

    // Apply search
    const searchMatch =
      !searchQuery ||
      match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.cardsOffered.some((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      match.cardsRequested.some((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return gameMatch && rarityMatch && conditionMatch && searchMatch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-background">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Match Discovery</h1>
          <p className="text-muted-foreground">
            Find potential trades with other users based on your cards
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards or users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select
              value={filter.game}
              onValueChange={(value) => setFilter({ ...filter, game: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="pokemon">Pokémon</SelectItem>
                <SelectItem value="magic">Magic: The Gathering</SelectItem>
                <SelectItem value="yugioh">Yu-Gi-Oh!</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.rarity}
              onValueChange={(value) => setFilter({ ...filter, rarity: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="ultra-rare">Ultra Rare</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.condition}
              onValueChange={(value) =>
                setFilter({ ...filter, condition: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="near-mint">Near Mint</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="played">Played</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matches List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={match.avatar} alt={match.name} />
                        <AvatarFallback>
                          {match.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{match.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{match.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {match.cardsOffered.length + match.cardsRequested.length}{" "}
                      Cards
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <Tabs defaultValue="offered">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="offered">They Offer</TabsTrigger>
                      <TabsTrigger value="requested">They Want</TabsTrigger>
                    </TabsList>

                    <TabsContent value="offered" className="mt-2">
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {match.cardsOffered.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center gap-2 p-2 rounded-md border"
                            >
                              <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {card.name}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <span>{card.set}</span>
                                  <span>•</span>
                                  <span>{card.condition}</span>
                                  <span>•</span>
                                  <span>x{card.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="requested" className="mt-2">
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {match.cardsRequested.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center gap-2 p-2 rounded-md border"
                            >
                              <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {card.name}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <span>{card.set}</span>
                                  <span>•</span>
                                  <span>{card.condition}</span>
                                  <span>•</span>
                                  <span>x{card.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter>
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => setSelectedMatch(match)}
                        >
                          Propose Trade
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            Propose Trade with {selectedMatch?.name}
                          </DialogTitle>
                          <DialogDescription>
                            Review the cards you want to trade and request from
                            this user.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Cards They're Offering:
                            </h3>
                            <div className="space-y-2">
                              {selectedMatch?.cardsOffered.map((card) => (
                                <div
                                  key={card.id}
                                  className="flex items-center gap-2 p-2 rounded-md border"
                                >
                                  <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={card.image}
                                      alt={card.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {card.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <span>{card.set}</span>
                                      <span>•</span>
                                      <span>{card.condition}</span>
                                      <span>•</span>
                                      <span>x{card.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Cards They Want:
                            </h3>
                            <div className="space-y-2">
                              {selectedMatch?.cardsRequested.map((card) => (
                                <div
                                  key={card.id}
                                  className="flex items-center gap-2 p-2 rounded-md border"
                                >
                                  <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={card.image}
                                      alt={card.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {card.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <span>{card.set}</span>
                                      <span>•</span>
                                      <span>{card.condition}</span>
                                      <span>•</span>
                                      <span>x{card.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Send Trade Request</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No matches found</h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your filters or add more cards to your inventory
                to find potential trades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data for default display
const defaultMatches: User[] = [
  {
    id: "1",
    name: "Alex Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 4.8,
    cardsOffered: [
      {
        id: "o1",
        name: "Charizard",
        set: "Base Set",
        condition: "Near Mint",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1628968434441-d9c1c66dcde7?w=200&q=80",
        rarity: "rare",
        game: "pokemon",
      },
      {
        id: "o2",
        name: "Blastoise",
        set: "Base Set",
        condition: "Good",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=200&q=80",
        rarity: "rare",
        game: "pokemon",
      },
    ],
    cardsRequested: [
      {
        id: "r1",
        name: "Venusaur",
        set: "Base Set",
        condition: "Near Mint",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=200&q=80",
        rarity: "rare",
        game: "pokemon",
      },
    ],
  },
  {
    id: "2",
    name: "Jamie Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    rating: 4.5,
    cardsOffered: [
      {
        id: "o3",
        name: "Black Lotus",
        set: "Alpha",
        condition: "Good",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1529154691717-3306083d869e?w=200&q=80",
        rarity: "ultra-rare",
        game: "magic",
      },
    ],
    cardsRequested: [
      {
        id: "r2",
        name: "Mox Ruby",
        set: "Beta",
        condition: "Played",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1559480671-5c369f8c438b?w=200&q=80",
        rarity: "ultra-rare",
        game: "magic",
      },
      {
        id: "r3",
        name: "Time Walk",
        set: "Unlimited",
        condition: "Good",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1563941402830-07a3d90e44f6?w=200&q=80",
        rarity: "rare",
        game: "magic",
      },
    ],
  },
  {
    id: "3",
    name: "Morgan Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    rating: 4.2,
    cardsOffered: [
      {
        id: "o4",
        name: "Blue-Eyes White Dragon",
        set: "Legend of Blue Eyes",
        condition: "Mint",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1607736703467-37da98175754?w=200&q=80",
        rarity: "ultra-rare",
        game: "yugioh",
      },
      {
        id: "o5",
        name: "Dark Magician",
        set: "Legend of Blue Eyes",
        condition: "Near Mint",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1614935152064-04c974d8d168?w=200&q=80",
        rarity: "rare",
        game: "yugioh",
      },
    ],
    cardsRequested: [
      {
        id: "r4",
        name: "Exodia the Forbidden One",
        set: "Legend of Blue Eyes",
        condition: "Good",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1607736703467-37da98175754?w=200&q=80",
        rarity: "ultra-rare",
        game: "yugioh",
      },
    ],
  },
];

export default MatchDiscovery;
