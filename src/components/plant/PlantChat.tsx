
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plant } from "@/lib/plant-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PlantChatProps {
  plant: Plant;
}

// Mock AI responses based on different plant types and questions
const getMockAIResponse = (plant: Plant, question: string): string => {
  question = question.toLowerCase();
  
  // Generic responses
  if (question.includes("hello") || question.includes("hi")) {
    return `Hello! I'm happy to answer any questions about your ${plant.name}. What would you like to know?`;
  }
  
  if (question.includes("water") || question.includes("watering")) {
    if (plant.wateringFrequency === "low") {
      return `Your ${plant.name} has low watering needs. ${plant.wateringInstructions}`;
    } else if (plant.wateringFrequency === "medium") {
      return `Your ${plant.name} has moderate watering needs. ${plant.wateringInstructions}`;
    } else {
      return `Your ${plant.name} requires frequent watering. ${plant.wateringInstructions}`;
    }
  }
  
  if (question.includes("light") || question.includes("sun") || question.includes("sunlight")) {
    if (plant.sunlight === "low") {
      return `Your ${plant.name} thrives in low light conditions. It's perfect for areas away from windows or in rooms with minimal natural light.`;
    } else if (plant.sunlight === "partial") {
      return `Your ${plant.name} prefers partial sunlight. Bright, indirect light is ideal - near a window with filtered light works well.`;
    } else {
      return `Your ${plant.name} loves bright light. Place it near a south-facing window where it can get several hours of direct sunlight daily.`;
    }
  }
  
  if (question.includes("temperature") || question.includes("warm") || question.includes("cold")) {
    if (plant.temperature === "cool") {
      return `Your ${plant.name} prefers cooler temperatures, ideally between 55-65°F (13-18°C). Keep it away from heaters and warm drafts.`;
    } else if (plant.temperature === "average") {
      return `Your ${plant.name} thrives in average room temperatures between 65-75°F (18-24°C), which is perfect for most homes.`;
    } else {
      return `Your ${plant.name} enjoys warm conditions between 75-85°F (24-29°C). Make sure it's not exposed to cold drafts or air conditioning vents.`;
    }
  }
  
  if (question.includes("fertilize") || question.includes("fertilizer") || question.includes("feed")) {
    return `For your ${plant.name}, use a balanced houseplant fertilizer diluted to half strength during the growing season (spring and summer). Reduce or eliminate fertilization during fall and winter when growth naturally slows.`;
  }
  
  if (question.includes("propagate") || question.includes("propagation") || question.includes("cutting")) {
    return `${plant.name} can typically be propagated through stem cuttings. Take a 4-6 inch cutting just below a node, remove lower leaves, and place in water or moist soil. Keep warm and humid until roots develop.`;
  }
  
  if (question.includes("pest") || question.includes("bugs") || question.includes("insects")) {
    return `Common pests for ${plant.name} include spider mites, mealybugs, and scale insects. Regularly inspect the leaves (top and bottom) and stems. Treat early infestations with neem oil or insecticidal soap, ensuring to follow the product instructions carefully.`;
  }
  
  // If no specific topic is matched, provide general care tips
  return `Your ${plant.name} (${plant.species}) thrives with ${plant.wateringFrequency} watering, ${plant.sunlight} light, and ${plant.temperature} temperatures. ${plant.description} Here's a key tip: ${plant.careInstructions[Math.floor(Math.random() * plant.careInstructions.length)]}`;
};

const PlantChat = ({ plant }: PlantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your plant assistant. I can answer questions about your ${plant.name}. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI thinking and typing
    setTimeout(() => {
      const aiResponse = getMockAIResponse(plant, input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-md">
      <div className="bg-muted p-3 border-b">
        <h3 className="font-medium">Plant Assistant</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-garden-500 text-white"
                    : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form
        onSubmit={handleSubmit}
        className="border-t p-3 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your plant..."
          className="flex-1"
          disabled={isTyping}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isTyping}
          className="bg-garden-500 hover:bg-garden-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default PlantChat;
