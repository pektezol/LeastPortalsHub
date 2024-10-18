import React from 'react';

import "../css/MapDeleteConfirmDialog.css"

interface MapDeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    map_id: number;
    record_id: number;
};

const MapDeleteConfirmDialog: React.FC<MapDeleteConfirmDialogProps> = ({ open, onClose, map_id, record_id }) => {
    if (open) {
        return (
            <div className='dimmer'>
                <div>
    
                </div>
            </div>
        )
    }
    
    return (
        <></>
    )
};

export default MapDeleteConfirmDialog;
