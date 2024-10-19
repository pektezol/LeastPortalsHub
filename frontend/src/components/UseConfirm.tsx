import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const useConfirm = ( title: string, subtitle: string ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = () => {
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolvePromise) {
            resolvePromise(true);
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        if (resolvePromise) {
            resolvePromise(false);
        }
    }

    const ConfirmDialogComponent = isOpen && (
        <ConfirmDialog title={title} subtitle={subtitle} onConfirm={handleConfirm} onCancel={handleCancel}></ConfirmDialog>
    );

    return { confirm, ConfirmDialogComponent };
}

export default useConfirm;
