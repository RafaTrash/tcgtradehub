import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CardInventory from "./CardInventory";
import CardEntryForm from "./CardEntryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CardItem {
  id: string;
  name: string;
  set: string;
  condition: string;
  quantity: number;
  imageUrl: string;
}

const CardRegistrationPage: React.FC = () => {
  const [cardsToTrade, setCardsToTrade] = useState<CardItem[]>([
    {
      id: "1",
      name: "Black Lotus",
      set: "Alpha",
      condition: "Near Mint",
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1614785246339-c60c6807f88f?w=400&q=80",
    },
    {
      id: "2",
      name: "Charizard",
      set: "Base Set",
      condition: "Good",
      quantity: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=400&q=80",
    },
  ]);

  const [cardsWanted, setCardsWanted] = useState<CardItem[]>([
    {
      id: "3",
      name: "Mox Ruby",
      set: "Beta",
      condition: "Any",
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1627626775846-122b778965ae?w=400&q=80",
    },
    {
      id: "4",
      name: "Blastoise",
      set: "Base Set",
      condition: "Mint",
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1628968434441-d9c8d344a532?w=400&q=80",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [activeTab, setActiveTab] = useState<"trade" | "wanted">("trade");

  const handleAddCard = (
    type: "trade" | "wanted",
    card: Omit<CardItem, "id">,
  ) => {
    const newCard = {
      ...card,
      id: Math.random().toString(36).substring(2, 11),
    };

    if (type === "trade") {
      setCardsToTrade([...cardsToTrade, newCard]);
    } else {
      setCardsWanted([...cardsWanted, newCard]);
    }
    setIsAddDialogOpen(false);
  };

  const handleEditCard = (type: "trade" | "wanted", card: CardItem) => {
    if (type === "trade") {
      setCardsToTrade(cardsToTrade.map((c) => (c.id === card.id ? card : c)));
    } else {
      setCardsWanted(cardsWanted.map((c) => (c.id === card.id ? card : c)));
    }
    setIsEditDialogOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (type: "trade" | "wanted", cardId: string) => {
    if (type === "trade") {
      setCardsToTrade(cardsToTrade.filter((card) => card.id !== cardId));
    } else {
      setCardsWanted(cardsWanted.filter((card) => card.id !== cardId));
    }
  };

  return (
    <div className="container mx-auto py-8 bg-background">
      <h1 className="text-3xl font-bold mb-6">My Card Collection</h1>

      <CardInventory
        cardsToTrade={cardsToTrade}
        cardsWanted={cardsWanted}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
      />

      {/* Edit Card Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <CardEntryForm
              onSubmit={(cardData) =>
                handleEditCard(activeTab, { ...cardData, id: selectedCard.id })
              }
              initialData={selectedCard}
              onCancel={() => setIsEditDialogOpen(false)}
              mode={activeTab}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardRegistrationPage;
