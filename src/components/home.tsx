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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState(null); // Store user info if needed
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [editError, setEditError] = useState("");

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      // Save user session (in state or localStorage)
      setUser(data.user);
      setIsLoggedIn(true);
      setActiveTab("inventory"); // Move to My Inventory
      setLoginModalOpen(false);  // Close modal
    } catch {
      setLoginError("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6 md:hidden" />
            <h1 className="text-xl font-bold">Plataforma de Troca TCG</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("inventory")}
              className={activeTab === "inventory" ? "bg-accent" : ""}
            >
              Meu Inventário
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("matches")}
              className={activeTab === "matches" ? "bg-accent" : ""}
            >
              Descobrir Trocas
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("trades")}
              className={activeTab === "trades" ? "bg-accent" : ""}
            >
              Solicitações de Troca
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                      alt="Usuário"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setEditForm({
                      name: user?.name || "",
                      email: user?.email || "",
                      avatar: user?.avatar || "",
                    });
                    setEditProfileOpen(true);
                  }}>
                    Editar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUser(null);
                      setActiveTab("inventory");
                    }}
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setLoginModalOpen(true)}>
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {!isLoggedIn ? (
          <WelcomeSection
            onLogin={() => setLoginModalOpen(true)}
            onRegister={() => setRegisterModalOpen(true)}
          />
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
                  <TabsTrigger value="inventory">Inventário</TabsTrigger>
                  <TabsTrigger value="matches">Trocas</TabsTrigger>
                  <TabsTrigger value="trades">Solicitações</TabsTrigger>
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
          <p>© 2023 Plataforma de Troca TCG. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrar</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block mb-1">E-mail</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Senha</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            {loginError && <div className="text-red-500">{loginError}</div>}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar</DialogTitle>
          </DialogHeader>
          <RegistrationForm onSuccess={() => setRegisterModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setEditError("");
              try {
                // Call your backend to update user info (implement /api/profile in backend)
                const res = await fetch("http://localhost:4000/api/profile", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(editForm),
                });
                if (!res.ok) {
                  const data = await res.json();
                  setEditError(data.error || "Falha ao atualizar");
                  return;
                }
                // Update user state
                setUser({ ...user, ...editForm });
                setEditProfileOpen(false);
              } catch {
                setEditError("Falha ao atualizar");
              }
            }}
          >
            <div>
              <label className="block mb-1">Nome</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="name"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">E-mail</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="email"
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">URL do Avatar</label>
              <input
                className="w-full border rounded px-2 py-1"
                name="avatar"
                type="url"
                value={editForm.avatar}
                onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
              />
            </div>
            {editError && <div className="text-red-500">{editError}</div>}
            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const WelcomeSection = ({ onLogin = () => {}, onRegister = () => {} }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl">
            Bem-vindo à Plataforma de Troca TCG
          </CardTitle>
          <CardDescription className="text-xl">
            Conecte-se com outros colecionadores e troque suas cartas de forma eficiente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Cadastre suas cartas"
              description="Adicione cartas para troca e cartas que você procura"
              icon={<Plus className="h-10 w-10" />}
            />
            <FeatureCard
              title="Encontre Trocas"
              description="Nosso sistema encontra automaticamente usuários com interesses complementares"
              icon={<Search className="h-10 w-10" />}
            />
            <FeatureCard
              title="Complete Trocas"
              description="Conecte-se com usuários compatíveis e realize suas trocas"
              icon={<User className="h-10 w-10" />}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setLoginModalOpen(true)}>
              Entrar
            </Button>
            <Button size="lg" variant="outline" onClick={onRegister}>
              Registrar
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
        <h2 className="text-2xl font-bold">Solicitações de Troca</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            Ordenar
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
                  {request.status === "pending" ? "Pendente" : "Aceita"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Oferecendo:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {request.offering.map((card, i) => (
                      <li key={i}>{card}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Solicitando:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {request.requesting.map((card, i) => (
                      <li key={i}>{card}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Mensagem
                </Button>
                {request.status === "pending" ? (
                  <>
                    <Button variant="destructive" size="sm">
                      Recusar
                    </Button>
                    <Button size="sm">Aceitar</Button>
                  </>
                ) : (
                  <Button size="sm">Ver Detalhes</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RegistrationForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Falha no cadastro");
        return;
      }
      alert("Cadastro realizado!");
      onSuccess();
    } catch (err) {
      setError("Falha no cadastro");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1">Nome</label>
        <input
          className="w-full border rounded px-2 py-1"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1">E-mail</label>
        <input
          className="w-full border rounded px-2 py-1"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Senha</label>
        <input
          className="w-full border rounded px-2 py-1"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" className="w-full">
        Registrar
      </Button>
    </form>
  );
};

export default HomePage;
