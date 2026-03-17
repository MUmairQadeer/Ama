'use client'
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        if (response.data.success == true) {
            onMessageDelete(message._id)
            console.log("m", message._id)
            toast.success("Message Deleted Sucessfully")
        }
        else {
            toast.error("Error While Deleting Message")
        }
    }

    return (
        <Card className="group relative hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden rounded-xl">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
                <CardTitle className="text-base md:text-lg font-semibold leading-snug pr-8 text-foreground">
                    "{message.content}"
                </CardTitle>
                {/* Alert-dailog */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this message and remove it from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded-md">
                        {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default MessageCard