import React, { useState } from 'react';
import MessageDialog from "../components/MessageDialog";

const useMessage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [subtitle, setSubtitle] = useState<string>("");
    const [resolvePromise, setResolvePromise] = useState<(() => void) | null>(null);

    const message = (title: string, subtitle: string) => {
        setIsOpen(true);
        setTitle(title);
        setSubtitle(subtitle);
        return new Promise<void>((resolve) => {
            setResolvePromise(() => resolve);
        })
    };

    const handleClose = () => {
        setIsOpen(false);
        if (resolvePromise) {
            setResolvePromise(null);
        }
    };

    const MessageDialogComponent = isOpen && (
        <MessageDialog title={title} subtitle={subtitle} onClose={handleClose}></MessageDialog>
    );

    return { message, MessageDialogComponent };
}

export default useMessage;
