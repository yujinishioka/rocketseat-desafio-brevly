"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title = "Confirmar",
  description = "Tem certeza que deseja continuar?",
}: Readonly<ConfirmDeleteDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription className="text-black opacity-75">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button variant="secondary" onClick={onConfirm} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
