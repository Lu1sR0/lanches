"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, ChefHat, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface CartItem extends MenuItem {
  quantity: number
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "X-Burger Especial",
    description: "Hambúrguer artesanal, queijo cheddar, bacon, alface, tomate e molho especial",
    price: 28.9,
    category: "Lanches",
    image: "/gourmet-cheeseburger-bacon.png",
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, tomate fresco e manjericão",
    price: 45.0,
    category: "Pizzas",
    image: "/margherita-pizza-basil.png",
  },
  {
    id: "3",
    name: "Batata Frita Grande",
    description: "Porção generosa de batatas fritas crocantes",
    price: 18.0,
    category: "Acompanhamentos",
    image: "/french-fries-in-basket.jpg",
  },
  {
    id: "4",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná ou Fanta",
    price: 6.0,
    category: "Bebidas",
    image: "/soda-can-drink.jpg",
  },
  {
    id: "5",
    name: "Filé à Parmegiana",
    description: "Filé empanado com molho de tomate, queijo e acompanhamentos",
    price: 42.9,
    category: "Pratos",
    image: "/chicken-parmigiana-with-fries.jpg",
  },
  {
    id: "6",
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela, calabresa e cebola",
    price: 48.0,
    category: "Pizzas",
    image: "/pepperoni-pizza.png",
  },
  {
    id: "7",
    name: "Suco Natural",
    description: "Laranja, limão, maracujá ou abacaxi",
    price: 10.0,
    category: "Bebidas",
    image: "/fresh-orange-juice.png",
  },
  {
    id: "8",
    name: "X-Salada",
    description: "Hambúrguer, queijo, alface, tomate, milho e batata palha",
    price: 22.0,
    category: "Lanches",
    image: "/classic-burger-with-salad.jpg",
  },
]

const categories = ["Todos", ...Array.from(new Set(menuItems.map((item) => item.category)))]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const filteredItems =
    selectedCategory === "Todos" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
      )
      return updated.filter((item) => item.quantity > 0)
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const sendToWhatsApp = () => {
    const phone = "5511989918871" // Substitua pelo número do WhatsApp do restaurante
    let message = "*🍔 Novo Pedido*\n\n"

    cart.forEach((item) => {
      message += `*${item.quantity}x* ${item.name}\n`
      message += `R$ ${(item.price * item.quantity).toFixed(2)}\n\n`
    })

    message += `*Total: R$ ${total.toFixed(2)}*`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Restaurante Sabor da Casa</h1>
                <p className="text-sm opacity-90">Faça seu pedido agora</p>
              </div>
            </div>
            <Button size="lg" variant="secondary" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-[100px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">{item.category}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-balance">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">R$ {item.price.toFixed(2)}</span>
                  <Button onClick={() => addToCart(item)} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card shadow-2xl transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b p-4 bg-primary text-primary-foreground">
            <h2 className="text-xl font-bold">Seu Pedido</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-primary-foreground/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm">Adicione itens do cardápio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.name}</h4>
                          <p className="text-sm text-primary font-bold mb-2">R$ {item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 bg-muted/50">
              <div className="mb-4">
                <div className="flex justify-between text-lg font-semibold mb-2">
                  <span>Total:</span>
                  <span className="text-primary text-2xl">R$ {total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
                </p>
              </div>
              <Button size="lg" className="w-full text-lg" onClick={sendToWhatsApp}>
                Enviar Pedido no WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      )}
    </div>
  )
}
