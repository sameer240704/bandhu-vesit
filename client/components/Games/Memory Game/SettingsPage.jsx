"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SettingsPage = ({ onNavigate, onBack, settings, onUpdateSettings }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border-4 border-indigo-200">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className={`text-indigo-600`}
          >
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h2>
          <div className="w-24"></div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-lg">Sound Effects</span>
            <Button
              variant={settings.soundEnabled ? "default" : "outline"}
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  soundEnabled: !settings.soundEnabled,
                })
              }
            >
              {settings.soundEnabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg">Background Music</span>
            <Button
              variant={settings.musicEnabled ? "default" : "outline"}
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  musicEnabled: !settings.musicEnabled,
                })
              }
            >
              {settings.musicEnabled ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
