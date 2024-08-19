"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

function PWAPrompt() {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      console.log(e);
      // e.prompt()
    });
  }, []);

  const onClose = () => {}
  return  <Dialog open onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Install Our App</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={() => {}}>Crop</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
}

export default PWAPrompt;
