import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import CardEntryForm from "./CardEntryForm";

interface CardItem {
  id: string;
  name: string;
  set: string;
  condition: string;
  quantity: number;
  imageUrl: string;
}

interface CardInventoryProps {
  onAddCard?: (type: "trade" | "wanted", card: Omit<CardItem, "id">) => void;
  onEditCard?: (type: "trade" | "wanted", card: CardItem) => void;
  onDeleteCard?: (type: "trade" | "wanted", cardId: string) => void;
}

const CardInventory: React.FC<CardInventoryProps> = ({
  onAddCard = () => {},
  onEditCard = () => {},
  onDeleteCard = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("trade");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  // Novo estado para as cartas
  const [cardsToTrade, setCardsToTrade] = useState<CardItem[]>([]);
  const [cardsWanted, setCardsWanted] = useState<CardItem[]>([]);

  // Buscar cartas da API ao montar o componente
  useEffect(() => {
    fetch("http://localhost:4000/api/cards")
      .then((res) => res.json())
      .then((data) => {
        // Supondo que cada card tem um campo "type": "trade" ou "wanted"
        setCardsToTrade(data.filter((c: CardItem) => c.type === "trade"));
        setCardsWanted(data.filter((c: CardItem) => c.type === "wanted"));
      });
  }, []);

  const handleAddCard = (card: Omit<CardItem, "id">) => {
    onAddCard(activeTab as "trade" | "wanted", card);
    setIsAddDialogOpen(false);
  };

  const handleEditCard = (card: CardItem) => {
    onEditCard(activeTab as "trade" | "wanted", card);
    setIsEditDialogOpen(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    onDeleteCard(activeTab as "trade" | "wanted", cardId);
  };

  const openEditDialog = (card: CardItem) => {
    setSelectedCard(card);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventário de Cartas</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Adicionar Carta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Adicionar Nova Carta em{" "}
                {activeTab === "trade" ? "Troca" : "Desejadas"}
              </DialogTitle>
            </DialogHeader>
            <CardEntryForm onSubmit={handleAddCard} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="trade"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="trade">Cartas para Troca</TabsTrigger>
          <TabsTrigger value="wanted">Cartas Desejadas</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="mt-4">
          {cardsToTrade.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Nenhuma carta adicionada para troca ainda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Adicione sua primeira carta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cardsToTrade.map((card) => (
                <CardDisplay
                  key={card.id}
                  card={card}
                  onEdit={() => openEditDialog(card)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wanted" className="mt-4">
          {cardsWanted.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Nenhuma carta adicionada à lista de desejos ainda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Adicione sua primeira carta desejada
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cardsWanted.map((card) => (
                <CardDisplay
                  key={card.id}
                  card={card}
                  onEdit={() => openEditDialog(card)}
                  onDelete={() => handleDeleteCard(card.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Editar Carta Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Carta</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <CardEntryForm
              onSubmit={(cardData) =>
                handleEditCard({ ...cardData, id: selectedCard.id })
              }
              initialValues={selectedCard}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CardDisplayProps {
  card: CardItem;
  onEdit: () => void;
  onDelete: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{card.name}</CardTitle>
        <CardDescription>{card.set}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex justify-between items-center">
          <Badge variant="outline">{card.condition}</Badge>
          <span className="text-sm font-medium">Qtd: {card.quantity}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2 border-t">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardInventory;
