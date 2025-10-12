import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, LogOut, User } from "lucide-react";
import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 text-white">
      <Link
        to={"/"}
      >
        <h1 className="text-xl font-semibold tracking-wide flex">
          <Bot className="mr-2" /> Fictional Chat
        </h1>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer">
            <User className="w-6 h-6" />
            {user && (
              <span className="text-sm font-medium">
                {user.first_name} {user.last_name}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-gray-800 text-white border border-gray-700"
        >
          <DropdownMenuLabel className="text-gray-400">
            Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            className="text-red-400 hover:bg-gray-700 cursor-pointer flex"
            onClick={logout}
          >
            <LogOut className="mr-2" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
