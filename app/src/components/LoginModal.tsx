
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { Button } from "./ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  isLoading?: boolean;
}

export const LoginModal = ({ isOpen, onClose, onLogin, isLoading }: LoginModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet to Continue</DialogTitle>
          <DialogDescription>
            Please connect your wallet to access the app.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Button 
            onClick={onLogin}
            // className="bg-[#FF8133] hover:bg-[#FF8133]/90 text-white"
            className="bg-[#FF8133]/10 text-[#FF8133] hover:bg-[#FF8133]/20 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
