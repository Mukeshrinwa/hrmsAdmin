import type { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';
import type { Document } from 'src/Interface/all_employee.interface';
import type { Department } from 'src/Interface/all_department.interface';

import dayjs from 'dayjs';
import { City, State, Country } from "country-state-city";
import React, { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import StepLabel from '@mui/material/StepLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Link, MenuItem, Typography, Autocomplete } from '@mui/material';

import useEmployeeApi from 'src/Api/all_employe/useEmployeeApi';
import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';
import shiftmanagenmetApi from 'src/Api/shift_management/shiftmanagenmetApi';
import OfficeManagementApi from 'src/Api/office_Management/OfficeManagementApi';

import { toast } from 'src/components/snackbar';

interface AddNewEmployeeProps {
  open: boolean;
  onClose: () => void;
  onAdd?: () => void;
}

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  phone: string;
  password: string;
  onShare?: () => void;
}

interface Skill {
  skillName: string;
  experienceYears: number;
  experienceMonths: number;
  proficiency: string;
  lastUsed?: string;
  certification?: any[];
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const steps = ['Employee Details', 'Professional Details', 'Upload Documents'];

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, phone, password, onShare }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 500,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '8px',
      textAlign: 'left'
    }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3., color: '#069855' }}>
        Employee added successfully
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Next Step
      </Typography>

      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Ask employee to download App Name by clicking on the below link
        <Box sx={{ mt: 1 }}>
          <Link href="https://www.google.co.in/" target="_blank" rel="noopener">
            https://www.google.co.in/
          </Link>
        </Box>
      </Typography>

      <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        Ask employee to open the App Name and enter the below details to login
      </Typography>

      <Box sx={{
        backgroundColor: '#f5f5f5',
        p: 2,
        borderRadius: 1,
        mb: 3
      }}>
        <Typography>
          <strong>Mobile Number :</strong> {phone}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Password :</strong> {password}
        </Typography>
      </Box>

      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Once logged in ask employee to go to attendance tab and Check in
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ width: '45%' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onShare}
          sx={{ width: '45%' }}
        >
          Share details with employee
        </Button>
      </Box>
    </Box>
  </Modal>
);

const AddNewEmployee: React.FC<AddNewEmployeeProps> = ({ open, onClose, onAdd }) => {
  const { fetchAllDepartments } = useDepartmentsApi();
  const { fetchofficeManagement } = OfficeManagementApi();
  const { fetchofficeShift } = shiftmanagenmetApi();
  const { addEmployee, adduserId } = useEmployeeApi();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [dobValue, setDobValue] = useState<Dayjs | null>(dayjs());
  const [dojValue, setDojValue] = useState<Dayjs | null>(dayjs());
  const [departments, setDepartments] = useState<Department[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [createdUserId, setCreatedUserId] = useState('');
  const [officeLocations, setOfficeLocations] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    companyEmail: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    joinDate: '',
    employeeType: '',
    branchId: '',
    departmentId: '',
    totalWorkExperience: {
      years: 0,
      months: 0
    },
    skills: [] as Skill[],
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });

  useEffect(() => {
    setCountries(Country.getAllCountries());
    loadDepartments();
    fetchOfficeData();
    fetchShiftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryChange = (newValue: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        country: newValue?.name || ""
      }
    }));

    if (newValue) {
      const statesList = State.getStatesOfCountry(newValue.isoCode);
      setStates(statesList);
      setCities([]);
    }
  };

  const handleStateChange = (newValue: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        state: newValue?.name || ""
      }
    }));

    if (newValue) {
      const citiesList = City.getCitiesOfState(newValue.countryCode, newValue.isoCode);
      setCities(citiesList);
    }
  };

  const handleCityChange = (newValue: any) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: newValue?.name || ""
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const names = name.split('.');
    if (names.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (names.length === 2) {
      const [key, subKey] = names;
      if (key === 'totalWorkExperience') {
        setFormData(prev => ({
          ...prev,
          totalWorkExperience: {
            ...prev.totalWorkExperience,
            [subKey]: Number(value)
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [key as keyof typeof formData]: {
            ...prev[key as keyof typeof formData] as any,
            [subKey]: value
          }
        }));
      }
    }
  };

  const handleDateChange = (newDate: Dayjs | null, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: newDate ? newDate.format('YYYY-MM-DD') : ''
    }));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      try {
        const userPayload = {
          mobile: formData.phone,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          branchId: "6914e5e9e101edc475d7674c",
          companyId: "6914e5e9e101edc475d7674c",
          role: "EMPLOYEE",
          permissions: ["*"],
        };

        const response = await adduserId(userPayload as any);
        const newUserId = response?.user?.id;
        const tempPassword = response?.temporaryPassword;

        if (!newUserId) {
          toast.error("User creation failed: invalid response from server");
          return;
        }

        setCreatedUserId(newUserId);
        setGeneratedPassword(tempPassword || 'Password@123');

        setActiveStep(prev => prev + 1);
        
        toast.success("User created successfully!");

      } catch (error: any) {
        console.error("Error creating user:", error);
        const errMsg = error?.response?.data?.message || error?.message;
        if (errMsg && errMsg.includes("already exists")) {
          toast.error("This mobile / email already registered");
        } else {
          toast.error("Failed to create user account");
        }
      }
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const loadDepartments = async () => {
    try {
      const response = await fetchAllDepartments();
      if (response && Array.isArray(response.data)) {
        const formattedDepartments: Department[] = response.data.map((dept: any) => ({
          ...dept,
          id: dept._id || dept.id // Ensure id property exists
        }));
        setDepartments(formattedDepartments);
      } else {
        console.error('Invalid data format', response);
      }
    } catch (error) {
      console.error('Failed to fetch departments', error);
    }
  };

  const fetchOfficeData = async () => {
    try {
      const response = await fetchofficeManagement();
      if (response) {
        setOfficeLocations(response);
      }
    } catch (error) {
      console.error('Failed to fetch office locations', error);
    }
  };

  const fetchShiftData = async () => {
    try {
      const response = await fetchofficeShift();
      if (response && Array.isArray(response)) {
        const formatted = response.map((s: any) => ({
          _id: s.id,
          name: s.name,
          start_time: s.startTime,
          end_time: s.endTime,
          breakDuration: s.breakDuration,
          workingDays: s.workingDays,
          isActive: s.isActive,
          description: s.description,
          earlyCheckInAllowed: s.earlyCheckInAllowed,
          lateThreshold: s.lateThreshold
        }));
        setShifts(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch shifts", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const newDocuments: Document[] = [];
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/png')) {
          const reader = new FileReader();
          reader.onload = () => {
            const newDoc = {
              document_type: "",
              document_url: "",
              file,
              preview: reader.result as string
            };
            newDocuments.push(newDoc);
            if (newDocuments.length === files.length) {
              setDocuments(prev => [...prev, ...newDocuments]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          toast.error(`File ${file.name} is not an image`);
        }
      });
    }
  };

  const handleShareCredentials = () => {
    const message = `New Employee Credentials:\nPhone: ${formData.phone}\nPassword: ${generatedPassword}\n\nDownload the app here: https://www.google.co.in/`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Credentials shared successfully!");
    setSuccessModalOpen(false);
    onClose();
  };

  const handleAddEmployee = async () => {
    try {
      const employeePayload = {
        userId: createdUserId,
        employeeId: formData.employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyEmail: formData.companyEmail,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender ? formData.gender.toUpperCase() : "",
        joinDate: formData.joinDate,
        employeeType: formData.employeeType,
        branchId: formData.branchId || "6914e5e9e101edc475d7674c",
        departmentId: formData.departmentId || "",
        totalWorkExperience: formData.totalWorkExperience,
        skills,
        address: {
          street: formData.address.street || "",
          city: formData.address.city || "",
          state: formData.address.state || "",
          country: formData.address.country || "",
          zipCode: formData.address.zipCode || ""
        },
        emergencyContact: {
          name: formData.emergencyContact.name || "",
          relationship: formData.emergencyContact.relationship || "",
          phone: formData.emergencyContact.phone || ""
        }
      };

      console.log("Final Employee Payload:", JSON.stringify(employeePayload, null, 2));
      console.log("Department ID:", formData.departmentId);
      console.log("Selected Department:", selectedDepartment);

      await addEmployee(employeePayload as any);

      toast.success("Employee added successfully!");

      // Reset form
      setFormData({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        companyEmail: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        joinDate: '',
        employeeType: '',
        branchId: '',
        departmentId: '',
        totalWorkExperience: {
          years: 0,
          months: 0
        },
        skills: [],
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: ""
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
        },
      });

      setSelectedDepartment(null);
      setSelectedBranch(null);
      setSelectedEmployeeType(null);
      setSkills([]);
      setDocuments([]);
      setDobValue(dayjs());
      setDojValue(dayjs());
      setCreatedUserId('');
      setGeneratedPassword('');
      setActiveStep(0);

      setSuccessModalOpen(true);
      if (onAdd) onAdd();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error("Failed to add employee");
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const addSkill = () => {
    const newSkill: Skill = {
      skillName: '',
      experienceYears: 0,
      experienceMonths: 0,
      proficiency: 'BEGINNER'
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setSkills(updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="phone"
                  label="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({
                      ...prev,
                      phone: numericValue
                    }));
                  }}
                  fullWidth
                  margin="normal"
                  type="tel"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]{10}",
                  }}
                  error={formData.phone.length !== 10}
                  helperText={
                    formData.phone.length !== 10
                      ? "Please enter exactly 10 digits"
                      : "Enter 10-digit mobile number"
                  }
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="email"
                  label="Personal Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={dobValue}
                    onChange={newValue => {
                      setDobValue(newValue);
                      handleDateChange(newValue, 'dateOfBirth');
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)', marginTop: '-15px' }}>
                <TextField
                  name="employeeId"
                  label="Employee Id"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  select
                  name="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Emergency contact details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="emergencyContact.name"
                  label="Full Name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="emergencyContact.relationship"
                  label="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="emergencyContact.phone"
                  label="Phone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({
                      ...prev,
                      emergencyContact: {
                        ...prev.emergencyContact,
                        phone: numericValue,
                      }
                    }));
                  }}
                  fullWidth
                  margin="normal"
                  type="tel"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box sx={{ flex: "1 1 calc(33% - 16px)" }}>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, newValue) => handleCountryChange(newValue)}
                  value={countries.find(c => c.name === formData.address.country) || null}
                  renderInput={(params) => (
                    <TextField {...params} label="Country" fullWidth />
                  )}
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(33% - 16px)" }}>
                <Autocomplete
                  options={states}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, newValue) => handleStateChange(newValue)}
                  value={states.find(s => s.name === formData.address.state) || null}
                  disabled={states.length === 0}
                  renderInput={(params) => (
                    <TextField {...params} label="State" fullWidth />
                  )}
                />
              </Box>
              <Box sx={{ flex: "1 1 calc(33% - 16px)" }}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, newValue) => handleCityChange(newValue)}
                  value={cities.find(c => c.name === formData.address.city) || null}
                  disabled={cities.length === 0}
                  renderInput={(params) => (
                    <TextField {...params} label="City" fullWidth />
                  )}
                />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
                  <TextField
                    name="address.street"
                    label="Street"
                    value={formData.address.street || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 16px)" }}>
                  <TextField
                    name="address.zipCode"
                    label="Zip Code"
                    value={formData.address.zipCode || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Professional details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <Autocomplete
                  options={departments}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedDepartment}
                  onChange={(event, newValue: Department | null) => {
                    console.log("Department selected:", newValue);
                    setSelectedDepartment(newValue);
                    if (newValue) {
                      setFormData(prev => ({
                        ...prev,
                        departmentId: newValue.id || ''
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        departmentId: ''
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      fullWidth
                      margin="normal"
                      helperText={formData.departmentId ? `Selected ID: ${formData.departmentId}` : "Select a department"}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <Autocomplete
                  options={[
                    { id: '1', name: 'Full Time', value: 'FULL_TIME' },
                    { id: '2', name: 'Part Time', value: 'PART_TIME' },
                    { id: '3', name: 'On Probation', value: 'ON_PROBATION' },
                    { id: '4', name: 'On Notice Period', value: 'NOTICE_PERIOD' },
                  ]}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedEmployeeType}
                  onChange={(event, newValue) => {
                    console.log("Employee Type selected:", newValue);
                    setSelectedEmployeeType(newValue);
                    if (newValue) {
                      setFormData(prev => ({
                        ...prev,
                        employeeType: newValue.value
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        employeeType: ''
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee Type"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Joining"
                    value={dojValue}
                    onChange={newValue => {
                      setDojValue(newValue);
                      handleDateChange(newValue, 'joinDate');
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="companyEmail"
                  label="Company Email"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <Autocomplete
                  options={officeLocations}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedBranch}
                  onChange={(event, newValue) => {
                    console.log("Branch selected:", newValue);
                    setSelectedBranch(newValue);
                    if (newValue) {
                      setFormData(prev => ({
                        ...prev,
                        branchId: newValue._id
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        branchId: ''
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <Autocomplete
                  options={shifts}
                  getOptionLabel={(option) =>
                    `${option.name} (${formatTime(option.start_time)} - ${formatTime(option.end_time)})` || ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Working Shift"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Work Experience
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="totalWorkExperience.years"
                  label="Total Years"
                  value={formData.totalWorkExperience.years}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                <TextField
                  name="totalWorkExperience.months"
                  label="Total Months"
                  value={formData.totalWorkExperience.months}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0, max: 11 }}
                />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Button variant="outlined" onClick={addSkill} sx={{ mb: 2 }}>
              Add Skill
            </Button>
            {skills.map((skill, index) => (
              <Box key={index} sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Skill {index + 1}</Typography>
                  <Button size="small" color="error" onClick={() => removeSkill(index)}>
                    Remove
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                    <TextField
                      label="Skill Name"
                      value={skill.skillName}
                      onChange={(e) => updateSkill(index, 'skillName', e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <TextField
                      label="Years"
                      type="number"
                      value={skill.experienceYears}
                      onChange={(e) => updateSkill(index, 'experienceYears', parseInt(e.target.value, 10) || 0)}
                      fullWidth
                      margin="normal"
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(25% - 16px)' }}>
                    <TextField
                      label="Months"
                      type="number"
                      value={skill.experienceMonths}
                      onChange={(e) => updateSkill(index, 'experienceMonths', parseInt(e.target.value, 10) || 0)}
                      fullWidth
                      margin="normal"
                      size="small"
                      inputProps={{ min: 0, max: 11 }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                    <TextField
                      select
                      label="Proficiency"
                      value={skill.proficiency}
                      onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    >
                      <MenuItem value="BEGINNER">Beginner</MenuItem>
                      <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                      <MenuItem value="ADVANCED">Advanced</MenuItem>
                      <MenuItem value="EXPERT">Expert</MenuItem>
                    </TextField>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 16px)' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Last Used"
                        value={skill.lastUsed ? dayjs(skill.lastUsed) : null}
                        onChange={(newValue) => updateSkill(index, 'lastUsed', newValue?.format('YYYY-MM-DD'))}
                        slotProps={{ textField: { size: 'small', fullWidth: true, margin: 'normal' } }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Documents
            </Typography>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="contained"
              component="label"
              sx={{ mb: 2 }}
            >
              Upload Documents
              <input
                type="file"
                accept="image/png"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
              />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {documents.map((doc, index) => (
                <Box key={index} sx={{ position: 'relative', width: 150 }}>
                  <img
                    src={doc.preview}
                    alt={`Document ${index}`}
                    style={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 4
                    }}
                  />
                  <TextField
                    label="Document Type"
                    value={doc.document_type}
                    onChange={(e) => {
                      const updatedDocs = [...documents];
                      updatedDocs[index].document_type = e.target.value;
                      setDocuments(updatedDocs);
                    }}
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const updatedDocs = [...documents];
                      updatedDocs.splice(index, 1);
                      setDocuments(updatedDocs);
                    }}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleAddEmployee : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Add Employee' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <SuccessModal
        open={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          onClose();
        }}
        phone={formData.phone}
        password={generatedPassword}
        onShare={handleShareCredentials}
      />
    </>
  );
};

export default AddNewEmployee;