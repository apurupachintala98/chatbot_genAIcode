import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    FormHelperText,
    DialogContentText,
    Typography,
} from '@mui/material';

const JsonButton = ({ open, handleClose, ...props }) => {
    const {
        error,
        setError,
        routeCd,
        setRouteCd,
        successMessage,
        setSuccessMessage,
        requestId,
        setRequestId, app_cd, apiUrl,
    } = props;

    const initialFormData = {
        SVRO_TO_APPROVED_YN: '',
        SVRO_TO_PROGRAM_NO: '',
        BUSINESS_FUNDED: '',
        FUNDING_COST_CENTER_NO: '',
        TGOV_REQUEST_ID: '',
        PROJECT_NAME: '',
        PROJECT_CODE: '',
        APM_NO: '',
        IT_OWNER_NAME: '',
        ARCHITECT_LEAD_NAME: '',
        BUSINES_OWNER_NAME: '',
        Architecture_Deck: '',
        Receiver_Email: '',
        file: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [apiLoading, setApiLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };


    const handleFileChange = (event) => {
        setFormData({ ...formData, file: event.target.files[0] });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validate = () => {
        const newErrors = {};
        let isError = false;

        // Only these fields are mandatory now
        const requiredFields = [
            'SVRO_TO_APPROVED_YN',
            'TGOV_REQUEST_ID',
            'PROJECT_NAME',
            'PROJECT_CODE',
            'APM_NO',
            'IT_OWNER_NAME',
            'ARCHITECT_LEAD_NAME',
            'BUSINES_OWNER_NAME',
            'Receiver_Email',
            'Architecture_Deck',
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
                isError = true;
            }
        });

        // Regex patterns for field validations
        const tgovRegex = /^TGOV\d+$/;
        const prjRegex = /^PRJ\d+$/;
        const apmRegex = /^APM\d+$/;

        if (formData.TGOV_REQUEST_ID && !tgovRegex.test(formData.TGOV_REQUEST_ID)) {
            newErrors.TGOV_REQUEST_ID = 'TGOV Request ID must start with "TGOV" followed by numbers';
            isError = true;
        }

        if (formData.PROJECT_CODE && !prjRegex.test(formData.PROJECT_CODE)) {
            newErrors.PROJECT_CODE = 'Project Code must start with "PRJ" followed by numbers';
            isError = true;
        }

        if (formData.APM_NO && !apmRegex.test(formData.APM_NO)) {
            newErrors.APM_NO = 'APM No must start with "APM" followed by numbers';
            isError = true;
        }

        // Additional email validation
        if (formData.Receiver_Email && !isValidEmail(formData.Receiver_Email)) {
            newErrors.Receiver_Email = 'Invalid email format';
            isError = true;
        }

        if (formData.Architecture_Deck === 'yes' && !formData.file) {
            newErrors.Architecture_Deck = 'File must be uploaded when Architecture Deck is set to Yes';
            isError = true;
        }

        setErrors(newErrors);
        return isError;
    };
    const createDummyFile = () => {
        const blob = new Blob(["This is a dummy file for Architecture Deck"], { type: 'application/pdf' });
        const file = new File([blob], "dummy.pdf", { type: 'application/pdf' });
        return file;
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const isError = validate();
        if (isError) {
            return; // If there's an error, stop the submission
        }

        try {
            setApiLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('app_cd', app_cd);
            formDataToSend.append('request_id', requestId);
            formDataToSend.append('route_cd', routeCd);

            // Prepare the app_info object
            const appInfo = {
                json_result_model_response: {
                    SVRO_TO_APPROVED_YN: formData.SVRO_TO_APPROVED_YN,
                    SVRO_TO_PROGRAM_NO: formData.SVRO_TO_PROGRAM_NO,
                    BUSINESS_FUNDED: formData.BUSINESS_FUNDED,
                    FUNDING_COST_CENTER_NO: formData.FUNDING_COST_CENTER_NO,
                    TGOV_REQUEST_ID: formData.TGOV_REQUEST_ID,
                    PROJECT_NAME: formData.PROJECT_NAME,
                    PROJECT_CODE: formData.PROJECT_CODE,
                    APM_NO: formData.APM_NO,
                    IT_OWNER_NAME: formData.IT_OWNER_NAME,
                    ARCHITECT_LEAD_NAME: formData.ARCHITECT_LEAD_NAME,
                    BUSINES_OWNER_NAME: formData.BUSINES_OWNER_NAME,
                    'Architecture Deck': formData.Architecture_Deck,
                    Receiver_Email: formData.Receiver_Email,
                },
                final_response_flag: "True",
            };

            // Append the app_info as a JSON string
            formDataToSend.append('json_pl_str', JSON.stringify(appInfo));

            // Handle file upload based on Architecture_Deck value
            if (formData.Architecture_Deck === 'yes') {
                if (formData.file) {
                    formDataToSend.append('file', formData.file); // Append the uploaded file
                } else {
                    throw new Error("No file uploaded for Architecture Deck");
                }
            } else if (formData.Architecture_Deck === 'no') {
                const dummyFile = createDummyFile(); // Create a dummy file
                formDataToSend.append('file', dummyFile); // Append the dummy file
            }

            // API endpoint using destructured variables
            const apiUrl = `https://arbassist.edagenaidev.awsdns.internal.das/backend/get_full_payload/?app_cd=${app_cd}&request_id=${requestId}&route_cd=${routeCd}`;

            // Make the API request
            const response = await fetch(apiUrl, {
                method: "POST", // Use POST method for data submission
                body: formDataToSend,  // Send the combined data as FormData
            });

            // Check if the response is ok
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }

            // Parse the JSON response
            const responseData = await response.json();
            if (responseData.backend_msg && responseData.backend_msg.flag === "True") {
                setShowSuccessDialog(true);
            } else {
                throw new Error(responseData.backend_msg.msg || "Backend did not confirm process completion.");
            }
            resetForm();
        } catch (error) {
            setError(error.message || "Failed to submit form");
        } finally {
            setApiLoading(false);
            handleClose();
        }
    };

    const handleDialogClose = (event, reason) => {
        if (event) {
            event.preventDefault();
        }
        resetForm();
        handleClose();
    };


    return (
        <><Dialog open={open} onClose={handleDialogClose} onExited={resetForm}>
            <DialogTitle sx={{ fontWeight: "bold" }}>Scheduler Form Submission</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal" error={!!errors.SVRO_TO_APPROVED_YN}>
                    <InputLabel>SVRO or TO Approved</InputLabel>
                    <Select
                        name="SVRO_TO_APPROVED_YN"
                        label="SVRO or TO Approved"
                        value={formData.SVRO_TO_APPROVED_YN}
                        onChange={handleChange}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </Select>
                    {errors.SVRO_TO_APPROVED_YN && <FormHelperText>{errors.SVRO_TO_APPROVED_YN}</FormHelperText>}
                </FormControl>

                <TextField
                    name="SVRO_TO_PROGRAM_NO"
                    label="SVRO or TO Program No"
                    value={formData.SVRO_TO_PROGRAM_NO}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.SVRO_TO_PROGRAM_NO}
                    helperText={errors.SVRO_TO_PROGRAM_NO} />

                <TextField
                    name="BUSINESS_FUNDED"
                    label="Business Funded"
                    value={formData.BUSINESS_FUNDED}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.BUSINESS_FUNDED}
                    helperText={errors.BUSINESS_FUNDED} />

                <TextField
                    name="FUNDING_COST_CENTER_NO"
                    label="Funding Cost Center No"
                    value={formData.FUNDING_COST_CENTER_NO}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.FUNDING_COST_CENTER_NO}
                    helperText={errors.FUNDING_COST_CENTER_NO} />

                <TextField
                    name="TGOV_REQUEST_ID"
                    label="TGOV Request ID"
                    value={formData.TGOV_REQUEST_ID}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.TGOV_REQUEST_ID}
                    helperText={errors.TGOV_REQUEST_ID} />

                <TextField
                    name="PROJECT_NAME"
                    label="Project Name"
                    value={formData.PROJECT_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.PROJECT_NAME}
                    helperText={errors.PROJECT_NAME} />

                <TextField
                    name="PROJECT_CODE"
                    label="Project Code"
                    value={formData.PROJECT_CODE}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.PROJECT_CODE}
                    helperText={errors.PROJECT_CODE} />

                <TextField
                    name="APM_NO"
                    label="APM No"
                    value={formData.APM_NO}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.APM_NO}
                    helperText={errors.APM_NO} />

                <TextField
                    name="IT_OWNER_NAME"
                    label="IT Owner Name"
                    value={formData.IT_OWNER_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.IT_OWNER_NAME}
                    helperText={errors.IT_OWNER_NAME} />

                <TextField
                    name="ARCHITECT_LEAD_NAME"
                    label="Architect Lead Name"
                    value={formData.ARCHITECT_LEAD_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.ARCHITECT_LEAD_NAME}
                    helperText={errors.ARCHITECT_LEAD_NAME} />

                <TextField
                    name="BUSINES_OWNER_NAME"
                    label="Business Owner Name"
                    value={formData.BUSINES_OWNER_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    error={!!errors.BUSINES_OWNER_NAME}
                    helperText={errors.BUSINES_OWNER_NAME} />
                <TextField
                    name="Receiver_Email"
                    label="Receiver Email"
                    value={formData.Receiver_Email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required // This is now mandatory
                    type="email"
                    error={!!errors.Receiver_Email}
                    helperText={errors.Receiver_Email} />

                <FormControl fullWidth margin="normal" error={!!errors.Architecture_Deck}>
                    <InputLabel>Architecture Deck</InputLabel>
                    <Select
                        name="Architecture_Deck"
                        label="Architecture_Deck"
                        value={formData.Architecture_Deck}
                        onChange={handleChange}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </Select>
                    {errors.Architecture_Deck && <FormHelperText>{errors.Architecture_Deck}</FormHelperText>}
                </FormControl>

                {formData.Architecture_Deck === 'yes' && (
                    <TextField
                        variant="outlined"
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        margin="normal" />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary" disabled={apiLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    type="submit"
                    disabled={apiLoading}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>

            <Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {(formData.Architecture_Deck === 'yes') && (<Typography sx={{ mt: 2 }}>File uploaded successfully as an attachment to Confluence!
                        </Typography>)}
                        <Typography sx={{ mt: 2 }}>
                            Record Inserted successfully into Confluence Portal
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            ARB review invitation sent successfully
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}> {/* Applying flexbox centering */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setShowSuccessDialog(false); // This will close the dialog
                            window.location.reload(); // This will refresh the page
                        }}
                    >
                        New Chat
                    </Button>
                </DialogActions>

            </Dialog>

        </>

    );
};

export default JsonButton;
