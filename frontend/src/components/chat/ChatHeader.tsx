import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, Fragment } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { clearCharacterChatHistory } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { useCharacters } from "@/hooks/useCharacters";

export default function ChatHeader({
  name,
  universe,
}: {
  name: string;
  universe: string;
}) {
  const [aiModel, setAIModel] = useState<string | null>(null);
  const { selected } = useCharacters();
  const { setMessages } = useChat(selected);

  // On mount, check if ai_model exists in localStorage
  useEffect(() => {
    const savedAIModel = localStorage.getItem("ai_model");
    if (savedAIModel) {
      setAIModel(savedAIModel);
    } else {
      localStorage.setItem("ai_model", "llama");
      setAIModel("llama");
    }
  }, []);

  const handleChange = (value: string) => {
    setAIModel(value);
    localStorage.setItem("ai_model", value);
  };

  const resetCharacterChat = async () => {
    if (selected) {
      const success = await clearCharacterChatHistory(selected.id);

      if (success)
        setMessages([])
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-t border-gray-700">
      <div className="flex items-center">
        <div className="text-lg">
          Chatting with <span className="font-semibold">{name}</span> from{" "}
          <span className="font-semibold">{universe}</span>
        </div>
        <Button
          variant="outline"
          className="ml-4 bg-transparent border-1 border-red-400 text-red-400 hover:text-red-500 hover:bg-transparent hover:border-red-600 cursor-pointer"
          onClick={() => {
            resetCharacterChat();
          }}
        >
          Clear Chat
        </Button>
      </div>

      <div className="flex items-center">
        <label className="mr-4">AI Model: </label>
        <Select value={aiModel ?? ""} onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an AI Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="llama">Llama 3.2</SelectItem>
            <SelectItem value="gemma">Gemma 3</SelectItem>
            <SelectItem value="mistral">Mistral</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
