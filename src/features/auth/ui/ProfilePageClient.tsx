"use client";

import { useState } from "react";
import { AuthDialog, type AuthDialogTab } from "./AuthDialog";
import { ProfilePanel } from "./ProfilePanel";

export function ProfilePageClient() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthDialogTab>("login");

  return (
    <>
      <ProfilePanel
        onOpenAuth={(tab) => {
          setAuthTab(tab);
          setAuthOpen(true);
        }}
      />
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </>
  );
}
