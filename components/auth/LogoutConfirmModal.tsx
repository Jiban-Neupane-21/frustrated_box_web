// components/auth/LogoutConfirmModal.tsx
"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface LogoutConfirmModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onLogoutTriggered?: () => void;
}

export function LogoutConfirmModal({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  onLogoutTriggered,
}: LogoutConfirmModalProps) {
  const { logout } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (next: boolean) => {
    if (isControlled) {
      setControlledOpen?.(next);
    } else {
      setInternalOpen(next);
    }
  };
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      onLogoutTriggered?.();
      await logout();
    } finally {
      setIsLoggingOut(false);
      setIsOpen?.(false);
    }
  };
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!isLoggingOut) setIsOpen(next);
      }}
    >
      {trigger ? (
        <AlertDialogTrigger render={trigger} />
      ) : !isControlled ? (
        <AlertDialogTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-400 transition hover:bg-red-950/40 hover:text-red-400 text-left cursor-pointer"
            />
          }
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent className="border border-[#2a0808] bg-[#0d0d0f] text-zinc-100 max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100 text-base">
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400">
            You will need to sign back in to view uncensored feeds, manage
            communities, or drop new vents.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isLoggingOut}
            className="border-zinc-800 bg-[#141416] text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirmLogout();
            }}
            disabled={isLoggingOut}
            className="bg-red-800 hover:bg-red-700 text-white font-medium text-xs border border-red-700 cursor-pointer"
          >
            {isLoggingOut ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Signing out...
              </span>
            ) : (
              "Sign Out"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
