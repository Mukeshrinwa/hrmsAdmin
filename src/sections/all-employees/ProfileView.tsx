import type { ChangeEvent } from 'react';
import type { EmployeeTableData, Document as ApiDocument } from 'src/Interface/profile_employeeinterface';

import React, { useEffect, useReducer } from 'react';

import { Box, Tab, Tabs, Grid, List, styled, ListItem, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

type InfoItem = {
    label: string;
    value: string;
};

type Document = {
    name: string;
    url: string;
    _id?: string;
};
interface SalaryData {
    basic_salary: number;
    bonuses: number;
    deductions: number;
    net_salary: number;
    ctcPerYear: number;
    payment_status: string;
}
interface ProfileViewProps {
  employee: EmployeeTableData | null;
  salaryData: SalaryData | null;
}

const initialState = {
  activeTab: 'personal',
  documents: [] as Document[],
};

type ProfileViewAction =
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string };

const reducer = (state: typeof initialState, action: ProfileViewAction) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.name !== action.payload),
      };
    default:
      return state;
  }
};

const formatToIndianTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = hours % 12 || 12;
    return `${twelveHourFormat}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
};

const renderList = (data: InfoItem[]) => (
    <Grid container spacing={2}>
        {data.map((item, index) =>
            item.label.startsWith('---') ? (
                <Grid item xs={12} key={index}>
                    <Box
                        mt={1.5}
                        mb={2}
                        textAlign="left"
                        fontWeight="bold"
                        fontSize={21}
                        letterSpacing={2}
                    >
                        {item.label.replace(/-/g, '').trim()}
                    </Box>
                </Grid>
            ) : (
                <Grid item xs={12} sm={6} key={index}>
                    <Box mb={2}>
                        <strong>{item.label}</strong>: {item.value}
                    </Box>
                </Grid>
            )
        )}
    </Grid>
);

const ProfileView: React.FC<ProfileViewProps> = ({ employee, salaryData }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Sync documents when employee data changes
  useEffect(() => {
    if (employee && employee.documents) {
      const docs = employee.documents
        .filter((doc): doc is ApiDocument => doc !== null)
        .map(doc => ({
          name: doc.document_type,
          url: doc.document_url,
          _id: doc._id
        }));
      dispatch({ type: 'SET_DOCUMENTS', payload: docs });
    }
  }, [employee]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: newValue });
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const newDocuments = Array.from(event.target.files || []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    newDocuments.forEach((doc) => {
      dispatch({ type: 'ADD_DOCUMENT', payload: doc });
    });
  };

  const handleDelete = (docName: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: docName });
  };

  const UploadContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '20px',
  });

  const UploadText = styled('div')({
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  });

  const UploadInstructions = styled('div')({
    marginTop: '5px',
    fontSize: '12px',
    color: '#888',
  });

  const renderDocumentsInfo = () => (
    <Box>
      <UploadContainer style={{ border: '1px dotted #CACACA', padding: '12px' }}>
        <input
          accept="*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleUpload}
        />
        <IconButton component="span">
          <Iconify icon="material-symbols:file-upload" width={40} height={40} />
        </IconButton>
        <UploadText>Click to Upload or drag and drop</UploadText>
        <UploadInstructions>(Max. File size: 25 MB)</UploadInstructions>
      </UploadContainer>

      <List>
        {state.documents.map((doc, index) => (
          <ListItem
            key={doc._id || index}
            style={{
              border: '1px solid #CACACA',
              display: 'flex',
              borderRadius: '5px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p>{doc.name}</p>
            </div>
            <div>
              <IconButton href={doc.url} target="_blank" rel="noopener noreferrer">
                <Iconify icon="icon-park-outline:download-two" />
              </IconButton>
              <IconButton onClick={() => handleDelete(doc.name)}>
                <Iconify icon="fluent:delete-28-regular" />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Safe data access with fallbacks
  const personalInfo = employee ? [
    { label: 'First Name', value: employee.first_name || 'N/A' },
    { label: 'Last Name', value: employee.last_name || 'N/A' },
    { label: 'Mobile Number', value: employee.phone || 'N/A' },
    { label: 'Email Address', value: employee.email || 'N/A' },
    { label: 'Date of Birth', value: employee.date_of_birth || 'N/A' },
    { label: 'Gender', value: employee.gender || 'N/A' },
    { label: 'Marital Status', value: employee.marital_status || 'N/A' },

    { label: '--- Emergency Contact Details ---', value: '' },
    { label: 'Full Name', value: employee.emergency_contact?.name || 'N/A' },
    { label: 'Relationship', value: employee.emergency_contact?.relationship || 'N/A' },
    { label: 'Mobile Number', value: employee.emergency_contact?.phone || 'N/A' },

    { label: '---  Address  ---', value: '' },
    {
      label: 'Address',
      value: employee.address 
        ? `${employee.address.street || ''}, ${employee.address.city || ''}, 
           ${employee.address.state || ''}, ${employee.address.country || ''},
           ${employee.address.postal_code || ''}`
        : 'N/A'
    },
    { label: 'State', value: employee.address?.state || 'N/A' },
    { label: 'Zip Code', value: employee.address?.postal_code || 'N/A' },
  ] : [];

  const professionalInfo = employee ? [
    { label: 'Employee ID', value: employee.employee_id || 'N/A' },
    { label: 'Employee Type', value: employee.employee_type || 'N/A' },
    { label: 'Position', value: employee.position || 'N/A' },
    { label: 'Department', value: employee.department_id?.name || 'N/A' },
    { label: 'Company Email ID', value: employee.company_email || 'N/A' },
    { label: 'Joining Date', value: employee.date_of_joining || 'N/A' },
    { label: 'Office Name', value: employee.office_id?.name || 'N/A' },
    {
      label: 'Office Location',
      value: employee.office_id?.location 
        ? `${employee.office_id.location.address || ''}, 
           ${employee.office_id.location.city || ''}, 
           ${employee.office_id.location.state || ''}, 
           ${employee.office_id.location.country || ''} 
           ${employee.office_id.location.postal_code || ''}`
        : 'N/A'
    },
    {
      label: 'Working Shift',
      value: employee.shift_id 
        ? `${employee.shift_id.name || 'N/A'} (${formatToIndianTime(employee.shift_id.start_time)} - ${formatToIndianTime(employee.shift_id.end_time)})`
        : 'N/A'
    },
    { label: '---  Salary  ---', value: '' },
    {
      label: 'Basic Salary',
      value: salaryData ? formatCurrency(salaryData.basic_salary) : 'N/A'
    },
    {
      label: 'Bonuses',
      value: salaryData ? formatCurrency(salaryData.bonuses) : 'N/A'
    },
    {
      label: 'Deductions',
      value: salaryData ? formatCurrency(salaryData.deductions) : 'N/A'
    },
    {
      label: 'Net Salary',
      value: salaryData ? formatCurrency(salaryData.net_salary) : 'N/A'
    },
    {
      label: 'CTC per Year',
      value: salaryData ? formatCurrency(salaryData.ctcPerYear) : 'N/A'
    },
    {
      label: 'Payment Status',
      value: salaryData?.payment_status || 'N/A'
    },
  ] : [];

  const accountInfo = employee ? [
    { label: 'Bank Name', value: employee.bank_details?.bank_name || 'N/A' },
    { label: 'Account Number', value: employee.bank_details?.account_number || 'N/A' },
    { label: 'IFSC Code', value: employee.bank_details?.ifsc_code || 'N/A' },
  ] : [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ margin: '15px' }}>
        <Box className="container">
          <Tabs
            value={state.activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Information" value="personal" />
            <Tab label="Professional Information" value="professional" />
            <Tab label="Documents" value="documents" />
            <Tab label="Bank Detail" value="account" />
          </Tabs>
          <Box mt={3}>
            {state.activeTab === 'personal' && renderList(personalInfo)}
            {state.activeTab === 'professional' && renderList(professionalInfo)}
            {state.activeTab === 'documents' && renderDocumentsInfo()}
            {state.activeTab === 'account' && renderList(accountInfo)}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProfileView;