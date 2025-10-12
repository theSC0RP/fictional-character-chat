import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

export default function ClearChatButton({ resetCharacterChat }: { resetCharacterChat: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="ml-4 bg-transparent border border-red-400 text-red-400 hover:text-red-500 hover:bg-transparent hover:border-red-600 cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" /> Clear Chat
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-80 bg-gray-900 text-white border border-gray-700 rounded-xl shadow-lg"
      >
        <p className="text-sm text-gray-300 mb-4">
          Are you sure you want to clear the chat? This action can’t be undone.
        </p>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            className="bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-200 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={() => resetCharacterChat()}
          >
            Yes, Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
