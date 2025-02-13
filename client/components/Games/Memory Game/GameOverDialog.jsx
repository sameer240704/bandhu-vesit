"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, Repeat } from "lucide-react";

const GameOverDialog = ({
  isOpen,
  onClose,
  isVictory,
  onNextLevel,
  onRetry,
  onHome,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isVictory ? "🎉 Level Complete! 🎉" : "Game Over"}
          </DialogTitle>
          <DialogDescription className="text-lg py-4">
            {isVictory
              ? "Congratulations! You've completed this level."
              : "Don't worry! Every master was once a beginner."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onHome}>
            <Home className="mr-2" /> Home
          </Button>
          {isVictory ? (
            <Button
              onClick={onNextLevel}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Next Level <ChevronRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Try Again <Repeat className="ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverDialog;