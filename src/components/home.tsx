import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogIn, Menu, Plus, Search, User } from "lucide-react";
import CardInventory from "./CardInventory";
import MatchDiscovery from "./MatchDiscovery";
import AuthModal from "./auth/AuthModal";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6 md:hidden" />
            <h1 className="text-xl font-bold">TCG Trade Platform</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("inventory")}
              className={activeTab === "inventory" ? "bg-accent" : ""}
            >
              My Inventory
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("matches")}
              className={activeTab === "matches" ? "bg-accent" : ""}
            >
              Match Discovery
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("trades")}
              className={activeTab === "trades" ? "bg-accent" : ""}
            >
              Trade Requests
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {isLoggedIn ? (
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ) : (
              <Button
                onClick={() => {
                  setIsRegisterMode(false);
                  setAuthModalOpen(true);
                }}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {!isLoggedIn ? (
          <WelcomeSection onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <div className="space-y-8">
            {/* Mobile Tabs */}
            <div className="md:hidden">
              <Tabs
                defaultValue="inventory"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="matches">Matches</TabsTrigger>
                  <TabsTrigger value="trades">Trades</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content based on active tab */}
            {activeTab === "inventory" && <CardInventory />}

            {activeTab === "matches" && <MatchDiscovery />}

            {activeTab === "trades" && <TradeRequestsSection />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2023 TCG Trade Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={() => setIsLoggedIn(true)}
        isRegister={isRegisterMode}
      />
    </div>
  );
};

const WelcomeSection = ({ onLogin = () => {} }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl">
            Welcome to TCG Trade Platform
          </CardTitle>
          <CardDescription className="text-xl">
            Connect with other collectors and trade your cards efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Register Your Cards"
              description="Add cards you want to trade and cards you're looking for"
              icon={<Plus className="h-10 w-10" />}
            />
            <FeatureCard
              title="Find Matches"
              description="Our system automatically finds users with complementary needs"
              icon={<Search className="h-10 w-10" />}
            />
            <FeatureCard
              title="Complete Trades"
              description="Connect with matched users and arrange your trades"
              icon={<User className="h-10 w-10" />}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                setIsRegisterMode(false);
                setAuthModalOpen(true);
              }}
            >
              Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setIsRegisterMode(true);
                setAuthModalOpen(true);
              }}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center p-4 text-center rounded-lg border bg-card">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const TradeRequestsSection = () => {
  // Mock data for trade requests
  const tradeRequests = [
    {
      id: 1,
      user: "Alice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      offering: ["Black Lotus", "Mox Ruby"],
      requesting: ["Time Walk", "Ancestral Recall"],
      status: "pending",
      date: "2023-06-15",
    },
    {
      id: 2,
      user: "Bob",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      offering: ["Charizard Holo", "Blastoise Holo"],
      requesting: ["Venusaur Holo", "Pikachu Illustrator"],
      status: "accepted",
      date: "2023-06-14",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trade Requests</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tradeRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={request.avatar} alt={request.user} />
                  <AvatarFallback>{request.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{request.user}</CardTitle>
                  <CardDescription>{request.date}</CardDescription>
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                >
                  {request.status === "pending" ? "Pending" : "Accepted"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">They are offering:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {request.offering.map((card, i) => (
                      <li key={i}>{card}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">They are requesting:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {request.requesting.map((card, i) => (
                      <li key={i}>{card}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Message
                </Button>
                {request.status === "pending" ? (
                  <>
                    <Button variant="destructive" size="sm">
                      Decline
                    </Button>
                    <Button size="sm">Accept</Button>
                  </>
                ) : (
                  <Button size="sm">View Details</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
