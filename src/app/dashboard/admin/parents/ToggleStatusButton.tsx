"use client"

import { toggleParentStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Power, PowerOff } from "lucide-react";
import { useState } from "react";
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

interface ToggleStatusButtonProps {
    profileId: string;
    currentStatus: boolean;
}

export function ToggleStatusButton({ profileId, currentStatus }: ToggleStatusButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleToggle() {
        setIsLoading(true);
        await toggleParentStatus(profileId, currentStatus);
        setIsLoading(false);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 ${currentStatus
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }`}
                    disabled={isLoading}
                >
                    {currentStatus ? (
                        <Power className="h-4 w-4" />
                    ) : (
                        <PowerOff className="h-4 w-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {currentStatus ? "¿Desactivar acudiente?" : "¿Activar acudiente?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {currentStatus
                            ? "Al desactivar este acudiente, no podrá acceder al sistema hasta que sea reactivado."
                            : "Al activar este acudiente, podrá acceder nuevamente al sistema."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggle}>
                        {currentStatus ? "Sí, desactivar" : "Sí, activar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
