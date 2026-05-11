import type { Data } from '@/src/Interface/holidays.interface';

import React, { useEffect, useReducer } from 'react';

import { Box, Modal, Stack, Button, TextField, Typography } from '@mui/material';

import useHolidaysApi from 'src/Api/holidays/holidaysApi';

interface EditHolidayModalProps {
    open: boolean;
    onClose: () => void;
    holiday: Data | null;
    onUpdate: () => void; 
}

interface State {
    formData: Data | null;
}

type Action =
    | { type: 'SET_FORM_DATA'; payload: Data }
    | { type: 'UPDATE_FIELD'; payload: { name: string; value: string | number } };

const initialState: State = {
    formData: null,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_FORM_DATA':
            return { ...state, formData: action.payload };
        case 'UPDATE_FIELD':
            return {
                ...state,
                formData: state.formData
                    ? { ...state.formData, [action.payload.name]: action.payload.value }
                    : null,
            };
        default:
            return state;
    }
};

const removeUnwantedProperties = (obj: any, properties: string[]) => {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
        if (!properties.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

const EditHolidayModal: React.FC<EditHolidayModalProps> = ({ open, onClose, holiday, onUpdate }) => {
    const { updateHolidays } = useHolidaysApi();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (holiday) {
            dispatch({ type: 'SET_FORM_DATA', payload: holiday });
        }
    }, [holiday]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'UPDATE_FIELD',
            payload: { name: e.target.name, value: e.target.value },
        });
    };

    const handleSubmit = async () => {
        if (state.formData) {
            const cleanedData = removeUnwantedProperties(state.formData, [
                '_id', 'createdAt', 'updatedAt', '__v', 'start_date', 'end_date'
            ]);
            cleanedData.coverage_amount = Number(cleanedData.coverage_amount);
    
            if (state.formData.employee_id) {
                if (typeof state.formData.employee_id === 'object') {
                    cleanedData.employee_id = state.formData.employee_id._id;
                } else if (typeof state.formData.employee_id === 'string') {
                    cleanedData.employee_id = state.formData.employee_id;
                }
            }
            
            await updateHolidays(state.formData._id, cleanedData);
            onUpdate();
            onClose();
        }
    };

    // Helper function to get employee name safely
    const getEmployeeName = () => {
        if (!state.formData?.employee_id) return '';
        
        if (typeof state.formData.employee_id === 'object') {
            return `${state.formData.employee_id.first_name} ${state.formData.employee_id.last_name}`;
        }
        
        return 'Employee'; 
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Holiday
                </Typography>
                {state.formData && (
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            name="employee_id"
                            label="Employee Name"
                            value={getEmployeeName()}
                            onChange={handleChange}
                            disabled
                        />
                        <TextField
                            fullWidth
                            name="benefit_type"
                            label="Benefit Type"
                            value={state.formData.benefit_type}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            name="provider"
                            label="Provider"
                            value={state.formData.provider}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            name="policy_number"
                            label="Policy Number"
                            value={state.formData.policy_number}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            name="coverage_amount"
                            label="Coverage Amount"
                            value={state.formData.coverage_amount}
                            onChange={handleChange}
                        />
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Update
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
};

export default EditHolidayModal;