export const PHONE_PATTERN =
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const TOAST_DURATION = 5;

export const TOAST_GENERIC_ERROR_MESSAGE =
  'Sorry about that! We are experiencing technical difficulties, please refresh the page and try again.';

export const TOAST_MESSAGES = {
  SUCCESS: {
    FILE_UPLOAD: 'Your file has been uploaded'
  },
  ERROR: {
    FILE_UPLOAD: 'Unable to upload file.'
  }
};

export const PERMISSION_TYPES_BACKEND: any = {
  READ: 'READ',
  WRITE: 'WRITE',
  HIDE: 'HIDE'
};

export const PERMISSION_TYPES: any = {
  READ: 'View',
  WRITE: 'Edit',
  HIDE: 'Hide'
};

export const ADMIN_TYPES = [
  {
    label: 'Super Admin',
    value: 'SUPER_ADMIN',
    key: 'superAdmin',
    priority: 0,
    independent: 1
  },
  { label: 'Admin', value: 'ADMIN', key: 'admin', priority: 1, independent: 0 },
  { label: 'User', value: 'USER', key: 'user', priority: 2, independent: 0 },
  {
    label: 'Pharmacy',
    value: 'PHARMACY',
    key: 'Pharmacy',
    priority: 3,
    independent: 1
  }
];

export const SHERIFF_OFFICE_ADMIN_TYPES = [
  {
    label: 'Admin',
    value: 'SHERIFF_OFFICE_WRITER',
    key: 'admin',
    priority: 0,
    independent: 1
  },
  {
    label: 'Viewer',
    value: 'SHERIFF_OFFICE_READER',
    key: 'viewer',
    priority: 1,
    independent: 0
  }
];

export const BULK_OPTIONS = [
  { label: 'Bulk Add Admin', value: 'bulkAddAdmins', key: 'BULK_UPLOAD' },
  { label: 'Bulk Remove Admin', value: 'bulkRemoveAdmins', key: 'BULK_DELETE' }
];
export const BULK_FORMULARY_OPTIONS = [
  {
    label: 'Bulk Add Formulary',
    value: 'BULK_ADD_FORMULARY',
    key: 'BULK_UPLOAD'
  },
  {
    label: 'Bulk Remove Formulary',
    value: 'BULK_REMOVE_FORMULARY',
    key: 'BULK_DELETE'
  }
];
export const GENERIC_NAME = [
  {
    label: 'Brand',
    value: 'BRAND',
    selected: false,
    disabled: false,
    key: 'brancd'
  },
  {
    label: 'Generic',
    value: 'GENERIC',
    selected: false,
    disabled: false,
    key: 'generic'
  }
];

export const SHERIFF_OFFICE_ACCESS_ROLES = {
  SHERIFF_OFFICE_READER: 'SHERIFF_OFFICE_READER',
  SHERIFF_OFFICE_WRITER: 'SHERIFF_OFFICE_WRITER'
};

export const BOOLEAN_SELECT = [
  { label: 'Yes', value: true, key: 'true', selected: false, disabled: false },
  { label: 'No', value: false, key: 'false', selected: false, disabled: false }
];
export const ANONYMOUS_OPTION = [
  { label: 'Yes', value: 'true', key: 'checked' },
  { label: 'No', value: 'false', key: 'unchecked' }
];
export const ALL = 'All';
export const ALL_OPTION = { label: 'All', value: 'All', key: 'All' };
export const STATUS_ACTIVE_INACTIVE = [
  { label: 'Active', value: 'true', key: 'active' },
  { label: 'Inactive', value: 'false', key: 'inActive' }
];
export const PATIENT_STATUS_ACTIVE_RELEASED = [
  { label: 'Active', value: 'ACTIVE', key: 'active' },
  { label: 'Released', value: 'RELEASED', key: 'released' }
];
export const HP_REPORT_TYPE = [
  { label: 'Initial', value: 'INITIAL', key: 'active' },
  { label: 'Annual', value: 'ANNUAL', key: 'inActive' }
];
export const US_STATES = [
  { label: 'Alabama', key: 'AL', abbreviation: 'AL' },
  { label: 'Alaska', key: 'AK', abbreviation: 'AK' },
  { label: 'American Samoa', key: 'AS', abbreviation: 'AS' },
  { label: 'Arizona', key: 'AZ', abbreviation: 'AZ' },
  { label: 'Arkansas', key: 'AR', abbreviation: 'AR' },
  { label: 'California', key: 'CA', abbreviation: 'CA' },
  { label: 'Colorado', key: 'CO', abbreviation: 'CO' },
  { label: 'Connecticut', key: 'CT', abbreviation: 'CT' },
  { label: 'Delaware', key: 'DE', abbreviation: 'DE' },
  { label: 'District Of Columbia', key: 'DC', abbreviation: 'DC' },
  { label: 'Federated States Of Micronesia', key: 'FM', abbreviation: 'FM' },
  { label: 'Florida', key: 'FL', abbreviation: 'FL' },
  { label: 'Georgia', key: 'GA', abbreviation: 'GA' },
  { label: 'Guam', key: 'GU', abbreviation: 'GU' },
  { label: 'Hawaii', key: 'HI', abbreviation: 'HI' },
  { label: 'Idaho', key: 'ID', abbreviation: 'ID' },
  { label: 'Illinois', key: 'IL', abbreviation: 'IL' },
  { label: 'Indiana', key: 'IN', abbreviation: 'IN' },
  { label: 'Iowa', key: 'IA', abbreviation: 'IA' },
  { label: 'Kansas', key: 'KS', abbreviation: 'KS' },
  { label: 'Kentucky', key: 'KY', abbreviation: 'KY' },
  { label: 'Louisiana', key: 'LA', abbreviation: 'LA' },
  { label: 'Maine', key: 'ME', abbreviation: 'ME' },
  { label: 'Marshall Islands', key: 'MH', abbreviation: 'MH' },
  { label: 'Maryland', key: 'MD', abbreviation: 'MD' },
  { label: 'Massachusetts', key: 'MA', abbreviation: 'MA' },
  { label: 'Michigan', key: 'MI', abbreviation: 'MI' },
  { label: 'Minnesota', key: 'MN', abbreviation: 'MN' },
  { label: 'Mississippi', key: 'MS', abbreviation: 'MS' },
  { label: 'Missouri', key: 'MO', abbreviation: 'MO' },
  { label: 'Montana', key: 'MT', abbreviation: 'MT' },
  { label: 'Nebraska', key: 'NE', abbreviation: 'NE' },
  { label: 'Neveda', key: 'NV', abbreviation: 'NV' },
  { label: 'New Hampshire', key: 'NH', abbreviation: 'NH' },
  { label: 'New Jersey', key: 'NJ', abbreviation: 'NJ' },
  { label: 'New Mexico', key: 'NM', abbreviation: 'NM' },
  { label: 'New York', key: 'NY', abbreviation: 'NY' },
  { label: 'North Carolina', key: 'NC', abbreviation: 'NC' },
  { label: 'North Dakota', key: 'ND', abbreviation: 'ND' },
  { label: 'Northern Mariana Islands', key: 'MP', abbreviation: 'MP' },
  { label: 'Ohio', key: 'OH', abbreviation: 'OH' },
  { label: 'Oklahoma', key: 'OK', abbreviation: 'OK' },
  { label: 'Oregon', key: 'OR', abbreviation: 'OR' },
  { label: 'Palau', key: 'PW', abbreviation: 'PW' },
  { label: 'Pennsylvania', key: 'PA', abbreviation: 'PA' },
  { label: 'Puerto Rico', key: 'PR', abbreviation: 'PR' },
  { label: 'Rhode Island', key: 'RI', abbreviation: 'RI' },
  { label: 'South Carolina', key: 'SC', abbreviation: 'SC' },
  { label: 'South Dakota', key: 'SD', abbreviation: 'SD' },
  { label: 'Tennessee', key: 'TN', abbreviation: 'TN' },
  { label: 'Texas', key: 'TX', abbreviation: 'TX' },
  { label: 'Utah', key: 'UT', abbreviation: 'UT' },
  { label: 'Vermont', key: 'VT', abbreviation: 'VT' },
  { label: 'Virgin Islands', key: 'VI', abbreviation: 'VI' },
  { label: 'Virginia', key: 'VA', abbreviation: 'VA' },
  { label: 'Washington', key: 'WA', abbreviation: 'WA' },
  { label: 'Wyoming', key: 'WY', abbreviation: 'WY' },
  { label: 'Wisconsin', key: 'WI', abbreviation: 'WI' },
  { label: 'West Virginia', key: 'WV', abbreviation: 'WV' }
];

export const ADMIIN_ROLES_PRIORITY: any = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  USER: 2,
  PHARMACY: 3
};

export const ADMINS_CSV_HEADERS = [
  { label: 'id', key: 'id' },
  { label: 'firstName', key: 'firstName' },
  { label: 'lastName', key: 'lastName' },
  { label: 'email', key: 'email' },
  { label: 'facility', key: 'externalFacilityId' },
  { label: 'role', key: 'role' }
];

export const FORMULARY_CSV_HEADERS = [
  { label: 'formularyAutoId', key: 'id' },
  { label: 'isFormulary', key: 'isFormulary' },
  { label: 'drug', key: 'name' },
  { label: 'drugName', key: 'drugName' },
  { label: 'brandName', key: 'brandName' },
  { label: 'genericName', key: 'genericName' },
  { label: 'strengthUnit', key: 'strengthUnit' },
  { label: 'formulation', key: 'formulation' },
  { label: 'release', key: 'release' },
  { label: 'package', key: 'package' },
  { label: 'unitsPkg', key: 'unitsPkg' },
  { label: 'drugClass', key: 'drugClass' },
  { label: 'isControlled', key: 'isControlled' },
  { label: 'isGeneric', key: 'isGeneric' },
  { label: 'isActive', key: 'isActive' }
];

export const REFERENCE_GUIDE_DRUGS_CSV_HEADERS = [
  { label: 'formularyAutoId', key: 'fId' },
  { label: 'drug', key: 'name' },
  { label: 'category', key: 'category' },
  { label: 'subCategory', key: 'subCategory' },
  { label: 'min', key: 'min' },
  { label: 'max', key: 'max' },
  { label: 'notes', key: 'notes' }
];

export const HP_CSV_ANNUAL_HEADERS = [
  { label: 'Patient Name', key: 'patientName' },
  { label: 'Patient Number', key: 'patientNumber' },
  { label: 'Location', key: 'location' },
  { label: 'DOB', key: 'dob' },
  { label: 'Age', key: 'age' },
  { label: 'Annual H&P Due', key: 'annualDate' }
];

export const HP_CSV_INITIAL_HEADERS = [
  { label: 'Patient Name', key: 'patientName' },
  { label: 'Patient Number', key: 'patientNumber' },
  { label: 'Location', key: 'location' },
  { label: 'DOB', key: 'dob' },
  { label: 'Age', key: 'age' },
  { label: 'Last Booked', key: 'lastBooked' },
  { label: 'Initial H&P Due', key: 'initialDate' }
];

export const FORMULATIONS: any = [
  { value: 'blm', label: 'Balm', key: 'blm' },
  { value: 'cap', label: 'Capsule', key: 'cap' },
  { value: 'chw tab', label: 'Chewable Tablet', key: 'chwTab' },
  { value: 'crm', label: 'Cream', key: 'crm' },
  { value: 'flm', label: 'Film', key: 'flm' },
  { value: 'gel', label: 'Gel', key: 'gel' },
  { value: 'inh', label: 'Inhaler', key: 'inh' },
  { value: 'inj', label: 'Injection', key: 'inj' },
  { value: 'IV soln', label: 'Intravenous Solution', key: 'IVSoln' },
  { value: 'jelly', label: 'Jelly', key: 'jelly' },
  { value: 'ltn', label: 'Lotion', key: 'ltn' },
  { value: 'nasal spry', label: 'Nasal Spray', key: 'nasalSpry' },
  { value: 'neb soln', label: 'Nebulizer Solution', key: 'nebSoln' },
  { value: 'oint', label: 'Ointment', key: 'oint' },
  { value: 'opth oint', label: 'Opthalmic Ointment', key: 'opthOint' },
  { value: 'opth soln', label: 'Opthalmic Solution', key: 'opthSoln' },
  { value: 'odt', label: 'Oral Disintegrating Tablet', key: 'odt' },
  { value: 'otic soln', label: 'Otic Solution', key: 'oticSoln' },
  { value: 'pck', label: 'Packets', key: 'pck' },
  { value: 'ptch', label: 'Patch', key: 'ptch' },
  { value: 'pwdr', label: 'Powder', key: 'pwdr' },
  { value: 'pwdr inh', label: 'Powder Inhaler', key: 'pwdrInh' },
  { value: 'shmp', label: 'Shampoo', key: 'shmp' },
  { value: 'soln', label: 'Solution', key: 'soln' },
  { value: 'SL tab', label: 'Sublingual Tab', key: 'SLTab' },
  { value: 'supp', label: 'Suppository', key: 'supp' },
  { value: 'susp', label: 'Suspension', key: 'susp' },
  { value: 'syr', label: 'Syringe', key: 'syr' },
  { value: 'tab', label: 'Tablet', key: 'tab' },
  { value: 'ud', label: 'Unit Dose', key: 'ud' },
  { value: 'vial', label: 'Vial', key: 'vial' }
];

export const FORMULARY_RELEASES: any = [
  { value: 'CD', label: 'Controlled Release (CD)', key: 'CD' },
  { value: 'CR', label: 'Controlled Release (CR)', key: 'CR' },
  { value: 'DR', label: 'Delayed Release', key: 'DR' },
  { value: 'EC', label: 'Enteric Coded', key: 'EC' },
  { value: 'ER', label: 'Extended Release (ER)', key: 'ER' },
  { value: 'XL', label: 'Extended Release (XL)', key: 'XL' },
  { value: 'LA', label: 'Long Acting', key: 'LA' },
  { value: 'SA', label: 'Sustained Action', key: 'SA' },
  { value: 'SPRK', label: 'Sprinkles', key: 'SPRK' },
  { value: 'SR', label: 'Sustained Release', key: 'SR' }
];

export const FORMULARY_UNITS = [
  { label: 'MG', value: 'mg', key: 'mg' },
  { label: 'ML', value: 'ml', key: 'ml' },
  { label: 'OZ', value: 'oz', key: 'oz' },
  { label: 'UNIT', value: 'unit', key: 'unit' },
  { label: 'MCG', value: 'mcg', key: 'mcg' },
  { label: 'IU', value: 'IU', key: 'IU' },
  { label: 'GM', value: 'gm', key: 'gm' }
];

export const FORMULARY_PACKAGES: any = [
  { value: 'bag', label: 'Bag', key: 'bag' },
  { value: 'bc', label: 'Blister Card', key: 'bc' },
  { value: 'btl', label: 'Bottle', key: 'btl' },
  { value: 'inh', label: 'Inhaler', key: 'inh' },
  { value: 'tbe', label: 'Tube', key: 'tbe' },
  { value: 'syr', label: 'Syringe', key: 'syr' },
  { value: 'vial', label: 'Vial', key: 'vial' }
];

export const FORMULARY_PACKAGES_LABEL = (key: any) => {
  return FORMULARY_PACKAGES.find((p: { value: string }) => key === p.value)
    ?.label;
};

export const ADMINS_SAMPLE_FILE: any = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'someone@example.com',
    facility: 'GAGD,GACH',
    role: 'Super Admin,Admin',
    action: 'edit'
  },
  {
    id: 2,
    firstName: 'Edison',
    lastName: 'Trent',
    email: 'someone@example.com',
    facility: 'GAGD,GACH',
    role: 'Pharmacy,Pill Pass',
    action: 'delete'
  },
  {
    firstName: 'Maria',
    lastName: 'Edward',
    email: 'someone@example.com',
    facility: 'GAGD,GACH',
    role: 'Leadership,HVA',
    action: 'add'
  }
];

export const INVENTORY_BULK_UPLOAD_SAMPLE_FILE: any = [
  {
    formularyAutoId: '001',
    isFormulary: 1,
    drugName: 'DrugName1',
    brandName: 'Brand1',
    genericName: 'Generic1',
    drugClass: 'Class1',
    strengthUnit: '1mg',
    package: 'Package1',
    unitsPkg: 10,
    release: 'ReleaseType1',
    formulation: 'Formulation1',
    isGeneric: 1,
    isStock: 0,
    min: 1,
    max: 2,
    parLevel: 3,
    threshold: 4,
    isControlled: 0,
    inventoryAutoId: '0021',
    ndc: 'NDC1',
    manufacturer: 'Manufacturer1',
    lotNo: 'Lot1',
    expirationDate: '08/20/2024',
    quantity: 5,
    controlledDrugAutoId: '0031',
    controlledId: 'Controlled1',
    tr: '123xyz',
    controlledQuantity: 5,
    action: 'add'
  },
  {
    formularyAutoId: '002',
    isFormulary: 0,
    drugName: 'DrugName1',
    brandName: 'Brand1',
    genericName: 'Generic1',
    drugClass: 'Class1',
    strengthUnit: '1mg',
    package: 'Package1',
    unitsPkg: 10,
    release: 'ReleaseType1',
    formulation: 'Formulation1',
    isGeneric: 1,
    isStock: 0,
    min: 1,
    max: 2,
    parLevel: 3,
    threshold: 4,
    isControlled: 0,
    inventoryAutoId: '0022',
    ndc: 'NDC1',
    manufacturer: 'Manufacturer1',
    lotNo: 'Lot1',
    expirationDate: '08/20/2024',
    quantity: 5,
    controlledDrugAutoId: '0032',
    controlledId: 'Controlled1',
    tr: '123xyz',
    controlledQuantity: 5,
    action: 'edit'
  },
  {
    formularyAutoId: '003',
    isFormulary: 1,
    drugName: 'DrugName1',
    brandName: 'Brand1',
    genericName: 'Generic1',
    drugClass: 'Class1',
    strengthUnit: '1mg',
    package: 'Package1',
    unitsPkg: 10,
    release: 'ReleaseType1',
    formulation: 'Formulation1',
    isGeneric: 1,
    isStock: 0,
    min: 1,
    max: 2,
    parLevel: 3,
    threshold: 4,
    isControlled: 0,
    inventoryAutoId: '0023',
    ndc: 'NDC1',
    manufacturer: 'Manufacturer1',
    lotNo: 'Lot1',
    expirationDate: '08/20/2024',
    quantity: 5,
    controlledDrugAutoId: '0033',
    controlledId: 'Controlled1',
    tr: '123xyz',
    controlledQuantity: 5,
    action: 'delete'
  }
];

export const INITIAL_ALLOCATION_BULK_UPLOAD_SAMPLE_FILE: any = [
  {
    formularyAutoId: '001',
    drug: 'Apixaban 10 mg tab btl CR',
    controlledId: 'Controlled1',
    tr: '123tr',
    packageQuantity: '200',
    totalUnits: '1000',
    cart: 'cart1,cart2'
  },
  {
    formularyAutoId: '002',
    drug: 'Azithromycin 250 mg tab tbe CD',
    controlledId: 'Controlled2',
    packageQuantity: '900',
    totalUnits: '100',
    cart: 'cart3'
  },
  {
    formularyAutoId: '003',
    drug: 'Acetaminophen 10 mg tab btl CR',
    packageQuantity: '100',
    totalUnits: '5',
    cart: 'cart4,cart5'
  }
];

export const FACILITY_CONTACTS_SAMPLE_FILE: any = [
  {
    externalFacilityId: '12h634byt',
    facilityName: 'Appling County',
    contactName: 'Edison Trent',
    email: 'edison@example.com',
    phone: '4445557777',
    role: 'SUPER_ADMIN'
  },
  {
    externalFacilityId: '12h634byt',
    facilityName: 'Ginwett County',
    contactName: 'Maria Edward',
    email: 'maria@example.com',
    phone: '4445557777',
    role: 'ADMIN'
  },
  {
    externalFacilityId: '12h634byt',
    facilityName: 'Dekalb County',
    contactName: 'Abraham Thomas',
    email: 'abraham@example.com',
    phone: '4449871111',
    role: 'PHARMACY'
  }
];

export const FORMULARY_SAMPLE_FILE: any = [
  {
    formularyAutoId: 2,
    isFormulary: 1,
    drug: 'Eliquis 5 mg inh tbe inh CR',
    drugName: 'Eliquis',
    brandName: 'Eliquis',
    genericName: 'Apixaban',
    strengthUnit: '5 mg',
    formulation: 'inh',
    release: 'CR',
    package: 'tbe',
    unitsPkg: 12,
    drugClass: 'Factor Xa inhibitors',
    isControlled: 1,
    isGeneric: 0,
    isActive: 1,
    action: 'edit'
  },
  {
    formularyAutoId: '',
    drug: 'Tylenol 10 mg tab btl CR',
    isFormulary: 1,
    drugName: 'Tylenol',
    brandName: 'Tylenol',
    genericName: 'Acetaminophen',
    strengthUnit: '10 mg',
    formulation: 'tab',
    release: 'CR',
    package: 'btl',
    unitsPkg: 12,
    drugClass: 'Analgesic',
    isControlled: 0,
    isGeneric: 0,
    isActive: 1,
    action: 'add'
  },
  {
    formularyAutoId: 3,
    drug: 'Azithromycin 250 mg tab tbe CD',
    isFormulary: 0,
    drugName: 'Azithromycin',
    brandName: 'Zithromax',
    genericName: 'Azithromycin',
    strengthUnit: '250 mg',
    formulation: 'tab',
    release: 'CD',
    package: 'tbe',
    unitsPkg: 12,
    drugClass: 'Macrolides',
    isControlled: 0,
    isGeneric: 1,
    isActive: 1,
    action: 'delete'
  }
];

export const REFERENCE_GUIDE_SAMPLE_FILE: any = [
  {
    formularyAutoId: 1,
    drug: 'Apixaban 10 mg tab btl CR',
    category: 'Eliquis',
    subCategory: 'Apixaban',
    min: 1,
    max: 5,
    notes: 'Sample Note',
    action: 'add'
  },
  {
    formularyAutoId: 2,
    drug: 'Azithromycin 250 mg tab tbe CD',
    category: 'Zithromax',
    subCategory: 'Azithromycin',
    min: 1.5,
    max: 5.5,
    notes: 'Sample Note',
    action: 'edit'
  },
  {
    formularyAutoId: 3,
    drug: 'Acetaminophen 10 mg tab btl CR',
    category: 'Tylenol',
    subCategory: 'Acetaminophen',
    min: 3,
    max: 7.5,
    notes: 'Sample Note',
    action: 'delete'
  }
];

export const SERVICE_DISRUPTION_BULK_ADD_SAMPLE_FILE: any = [
  {
    date: '09/20/24',
    time: '13:00',
    patientName: 'DOE, JOHN',
    patientNumber: 'GS1234',
    service: 'X-ray',
    reason: 'Other',
    fchcStaff: 'John Doe',
    shiftSupervisorNotified: 'Other',
    comments: 'Other',
    delayPeriod: '1:00'
  },
  {
    date: '09/20/24',
    time: '10:00',
    patientName: 'DOE, JOHN',
    patientNumber: 'GS1234',
    service: 'Dental Clinic',
    reason: 'Security Officer not Available',
    fchcStaff: 'John Doe',
    shiftSupervisorNotified: 'Other',
    comments: 'Other',
    delayPeriod: '1:00'
  },
  {
    date: '09/20/24',
    time: '10:00',
    patientName: 'DOE, JOHN',
    patientNumber: 'GS1234',
    service: 'X-ray',
    reason: 'Security Officer not Available',
    fchcStaff: 'John Doe',
    shiftSupervisorNotified: 'Other',
    comments: 'Other',
    delayPeriod: '1:00'
  }
];

export const LOCATION_ADD_SAMPLE_FILE: any = [
  {
    location: '"ABC - - 001 - 111"',
    unit: '"ABC"',
    cell: '"001"',
    bed: '"111"'
  },
  {
    location: '"ABC - - 001 - 111"',
    unit: '"ABC"',
    cell: '"001"',
    bed: '"111"'
  },
  {
    location: '"ABC - - 001 - 111"',
    unit: '"ABC"',
    cell: '"001"',
    bed: '"111"'
  }
];

export const HVAS_COUNTY_SERVICES: any = [
  {
    label: 'Annual Physical Exam',
    value: 'Annual Physical Exam',
    key: 'Annual Physical Exam'
  },
  {
    label: 'Classification H&P',
    value: 'Classification H&P',
    key: 'Classification H&P'
  },
  { label: 'Dental Clinic', value: 'Dental Clinic', key: 'Dental Clinic' },
  {
    label: 'Diabetic Rounds',
    value: 'Diabetic Rounds',
    key: 'Diabetic Rounds'
  },
  {
    label: 'Infectious Disease Clinic',
    value: 'Infectious Disease Clinic',
    key: 'Infectious Disease Clinic'
  },
  { label: 'Infirmary', value: 'Infirmary', key: 'Infirmary' },
  { label: 'Intake', value: 'Intake', key: 'Intake' },
  {
    label: 'JJ2 Clinic',
    value: 'JJ2 Clinic (Sick Call, Chronic Care)',
    key: 'JJ2 Clinic (Sick Call, Chronic Care)'
  },
  { label: 'Kiosk', value: 'Kiosk', key: 'Kiosk' },
  { label: 'Mental Health', value: 'Mental Health', key: 'Mental Health' },
  { label: 'Optometry', value: 'Optometry', key: 'Optometry' },
  { label: 'Phlebotomy', value: 'Phlebotomy', key: 'Phlebotomy' },
  {
    label: 'Physical Therapy',
    value: 'Physical Therapy',
    key: 'Physical Therapy'
  },
  { label: 'Pill Call', value: 'Pill Call', key: 'Pill Call' },
  { label: 'Podiatry', value: 'Podiatry', key: 'Podiatry' },
  { label: 'Ultrasound', value: 'Ultrasound', key: 'Ultrasound' },
  { label: 'X-ray', value: 'X-ray', key: 'X-ray' }
];

export const DISRIPTION_SERVICE_REASONS: any = [
  {
    label: 'Count not Clear',
    value: 'Count not Clear',
    key: 'Count not Clear'
  },
  {
    label: 'Inspection or Shakedown',
    value: 'Inspection or Shakedown Taking Place',
    key: 'Inspection or Shakedown Taking Place'
  },
  {
    label: 'Security Officer not Available',
    value: 'Security Officer not Available',
    key: 'Security Officer not Available'
  },
  {
    label: 'Suicide Attempt',
    value: 'Suicide Attempt',
    key: 'Suicide Attempt'
  }
];

export const PERMISSIONS_TYPES = {
  READ: 'READ',
  WRITE: 'WRITE',
  HIDE: 'HIDE'
};

export const PERMISSION_PRIORITY: {
  [x: string]: number;
} = {
  WRITE: 1,
  READ: 2,
  HIDE: 3
} as const;

export const APP_ACTIONS = [
  { label: ALL, key: ALL, value: '' },
  { label: 'Create', value: 'CREATE', key: 'CREATE' },
  { label: 'Update', value: 'UPDATE', key: 'UPDATE' },
  { label: 'Remove', value: 'REMOVE', key: 'REMOVE' }
];

export const FILTER_ENTITIES = [
  { label: ALL, key: ALL, value: ALL },
  { label: 'Admin', value: 'Admin', key: 'ADMIN' },
  {
    label: 'Contact',
    value: 'Contact',
    key: 'Contact'
  },
  {
    label: 'Facilities',
    value: 'Facility',
    key: 'Facility'
  },
  {
    label: 'Facility Contact',
    value: 'FacilityContact',
    key: 'FacilityContact'
  },
  { label: 'Formulary', value: 'Formulary', key: 'Formulary' },
  {
    label: 'File',
    value: 'File',
    key: 'File'
  },
  { label: 'Inventory', value: 'Inventory', key: 'Inventory' },
  {
    label: 'Controlled Inventory',
    value: 'InventoryControl',
    key: 'InventoryControl'
  },
  {
    label: 'Lot',
    value: 'Lot',
    key: 'Lot'
  },
  {
    label: 'Process Contact',
    value: 'ProcessContact',
    key: 'ProcessContact'
  },
  {
    label: 'Process',
    value: 'Process',
    key: 'Process'
  },
  { label: 'Role', value: 'Role', key: 'ROLE' },
  {
    label: 'Role Service List',
    value: 'RoleServiceList',
    key: 'RoleServiceList'
  },
  { label: 'Safe & Issue Report', value: 'SafeReport', key: 'SafeReport' },
  { label: 'Reference Guide', value: 'ReferenceGuide', key: 'referenceGuide' },
  {
    label: 'Reference Guide Drug',
    value: 'ReferenceGuideDrug',
    key: 'referenceGuideDrug'
  }
];

export const BRIDGE_THERAPY_FILTER_TYPES = {
  RELEASED_7_DAYS: '7',
  RELEASED: 'RELEASED',
  ALL_ACTIVE: 'ALL_ACTIVE',
  ALL_PATIENTS: 'ALL_PATIENTS'
} as const;

export const BRIDGE_THERAPY_PATIENT_RELEASE_FILTER = [
  {
    key: 'Released > 7 days',
    value: BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS,
    label: 'Released > 7 days'
  },
  {
    key: 'Released',
    value: BRIDGE_THERAPY_FILTER_TYPES.RELEASED,
    label: 'Released'
  },
  {
    key: 'Active',
    value: BRIDGE_THERAPY_FILTER_TYPES.ALL_ACTIVE,
    label: 'Active'
  },
  {
    key: ALL,
    value: BRIDGE_THERAPY_FILTER_TYPES.ALL_PATIENTS,
    label: ALL
  }
];
export const COMMUNICATION_SCREENS = [
  {
    label: 'Internal Contacts',
    status: 'INTERNALCONTACTS',
    value: 'internalContacts',
    key: 'internalContacts'
  },
  {
    label: 'External Contacts',
    status: 'EXTERNALCONTACTS',
    value: 'externalContacts',
    key: 'externalContacts'
  },
  { label: 'Reports', status: 'REPORTS', value: 'reports', key: 'reports' }
];

export const COMMUNICATION_SCREENS_MOBILE = [
  {
    key: 'Internal Contacts',
    value: 'Internal Contacts',
    label: 'Internal Contacts'
  },
  {
    key: 'External Contacts',
    value: 'External Contacts',
    label: 'External Contacts'
  },
  {
    key: 'Reports',
    value: 'Reports',
    label: 'Reports'
  }
];

export const CONTACT_TYPES = {
  INTERNAL: 'Internal',
  EXTERNAL: 'External',
  BOTH: 'Both'
};

export const BRIDGE_THERAPY_STATUS_TYPES = [
  { label: 'RELEASED', value: 'RELEASED', key: 'released' },
  { label: 'ACTIVE', value: 'ACTIVE', key: 'active' }
];

export const PROCESS_TYPES = {
  REPORT: 'REPORT',
  CRON: 'CRON'
};

export const PERMISSION_TYPES_INVERSE: any = {
  View: 'READ',
  Edit: 'WRITE',
  Hide: 'HIDE'
};

export const PERMISSION_MANAGEMENT_ITEMS = [
  'dashboard',
  'serviceDisruptions',
  'safeReports',
  'safeReportSearch',
  'auditLog',
  'historyPhysical',
  'bridgeTherapy',
  'medicationLists',
  'formulary',
  'inventory',
  'facilities',
  'crons',
  'admins'
];

export const DEFAULT_PAGE_SIZE = {
  DESKTOP: 20,
  MOBILE: 20,
  SELECTOR: 100
};

export const DEFAULT_PAGE_SIZE_OPTIONS = [20, 40, 80, 100];
export const DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE = [20, 40, 80, 100];

export const SAFE_REPORT_SCREENS = {
  REPORT_HISTORY: 'Report/History',
  INVESTIGATION_REVIEW: 'Investigation/Review'
};

export const CART_RESTOCK_SCREENS = [
  { label: 'Reference Guides', value: 'referenceGuide', key: 'referenceGuide' },
  { label: 'Request Form', value: 'requestForm', key: 'requestForm' },
  { label: 'Request Logs', value: 'requestLogs', key: 'requestLogs' }
];

export const SAFE_REPORT_EVENT_SEVERITY_SCREENS = {
  NEARMISS: 'Near Miss',
  REACHEDPATIENT: 'Reached Patient'
};

export const SAFE_REPORT_TYPE_OPTIONS = [
  { label: 'SAFE', value: 'SAFE', key: 'SAFE' },
  { label: 'Issue', value: 'ISSUE', key: 'ISSUE' }
];

export const ANONYMOUS_TYPE_OPTIONS = [
  { label: 'Yes', value: 'true', key: 'YES' },
  { label: 'No', value: 'false', key: 'NO' }
];

export const FILE_EXTENSIONS = { CSV: 'csv' } as const;

export const BRIDGETHERAPY_SCREENS = [
  {
    label: 'Bridge Therapy',
    value: 'bridgeTherapy',
    key: 'bridgeTherapy',
    status: 'bridgeTherapy'
  },
  { label: 'Logs', value: 'logs', key: 'logs', status: 'logs' }
];

export const INVENTORY_NAVI_OPTIONS_CONST = {
  INVENTORY: 'Inventory',
  LOGS: 'Upload Logs'
};

export const FILE_NAVIGATION_OPTIONS = [
  {
    label: 'Service Disruption',
    status: 'SERVICE_DISRUPTION',
    value: 'serviceDisruption',
    key: 'serviceDisruption'
  },
  {
    label: 'Formulary',
    status: 'FORMULARY',
    value: 'formulary',
    key: 'formulary'
  },
  {
    label: 'Inventory',
    status: 'INVENTORY',
    value: 'inventory',
    key: 'inventory'
  },
  {
    label: 'Reference Guide',
    status: 'REFERENCE_GUIDE',
    value: 'referenceGuide',
    key: 'referenceGuide'
  },
  {
    label: 'Initial Allocation',
    status: 'INITIAL_ALLOCATION',
    value: 'initialAllocation',
    key: 'initialAllocation'
  },
  {
    label: 'User Management',
    status: 'ADMIN',
    value: 'userManagement',
    key: 'userManagement'
  }
];

export const FILE_REPOSITORY = {
  INITIAL_ALLOCATION: 'INITIAL_ALLOCATION',
  CART_REQUEST_LOG: 'CART_REQUEST_LOG'
};

export const INVENTORY_AND_FORMULARY_LEVEL_REPOSITORY = {
  INVENTORY: 'INVENTORY',
  INVENTORY_AND_FORMULARY_LEVELS: ['INVENTORY', 'FORMULARY_LEVELS']
};
export const FILE_NAVIGATION_OPTIONS_MOBILE = [
  {
    label: 'Service Disruption',
    value: 'Service Disruption',
    key: 'Service Disruption'
  },
  { label: 'Formulary', value: 'Formulary', key: 'Formulary' },
  { label: 'Inventory', value: 'Inventory', key: 'Inventory' },
  {
    label: 'Reference Guide',
    value: 'Reference Guide',
    key: 'Reference Guide'
  },
  {
    label: 'Initial Allocation',
    value: 'Initial Allocation',
    key: 'Initial Allocation'
  },
  {
    label: 'User Management',
    value: 'User Management',
    key: 'User Management'
  }
];

export const FILE_STATUS_OPTIONS = [
  { label: 'Success', value: 'PROCESSED', key: 'PROCESSED' },
  { label: 'Partial', value: 'PARTIAL', key: 'PARTIAL' },
  { label: 'Failed', value: 'FAILED', key: 'FAILED' },
  { label: 'In Process', value: 'QUEUED', key: 'QUEUED' }
];

export const FILE_STATUS = {
  PROCESSED: 'PROCESSED',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED',
  QUEUED: 'QUEUED',
  RECEIVED: 'RECEIVED'
};

export const FACILITY_CHECKLIST_ITEMS = [
  'EQUIPMENT_MALFUNCTION',
  'ENVIRONMENTAL',
  'EMPLOYEE_SAFETY',
  'MENTAL_HEALTH',
  'MEDICATION',
  'ISSUE_REPORT'
];
export const FACILITY_CHECKLIST_EVENTS = {
  MEDICATION: 'MEDICATION',
  MENTAL_HEALTH: 'MENTAL_HEALTH',
  ENVIRONMENTAL: 'ENVIRONMENTAL',
  EQUIPMENT_MALFUNCTION: 'EQUIPMENT_MALFUNCTION',
  EMPLOYEE_SAFETY: 'EMPLOYEE_SAFETY',
  ISSUE_REPORT: 'ISSUE_REPORT'
};

export const FACILITY_CHECKLIST_EVENT_DISPLAY_NAMES: any = {
  MEDICATION: 'Medication',
  MENTAL_HEALTH: 'Mental Health',
  ENVIRONMENTAL: 'Environmental',
  EQUIPMENT_MALFUNCTION: 'Equipment Malfunction',
  EMPLOYEE_SAFETY: 'Patient or Employee Safety',
  ISSUE_REPORT: 'Issue Report'
};

export const SAFE_SEVERITY_TYPES: any = {
  NEAR_MISS: 'NEAR_MISS',
  REACHED_PATIENT: 'REACHED_PATIENT'
};

export const SAFE_SEVERITY_TYPES_LABELS: any = {
  NEAR_MISS: 'Near Miss',
  REACHED_PATIENT: 'Reached Patient'
};

export const SAFE_NEAR_MISS_TYPES: any = {
  INCIDENTAL: 'INCIDENTAL',
  ACTIVE_RECOVERY: 'ACTIVE_RECOVERY'
};

export const SAFE_NEAR_MISS_TYPES_LABELS: any = {
  INCIDENTAL: 'Incidental',
  ACTIVE_RECOVERY: 'Active Recovery'
};

export const SAFE_REPORT_STATUS = {
  UNDER_INVESTIGATION: 'UNDER_INVESTIGATION',
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  CLOSED: 'CLOSED'
} as const;

export const SAFE_REPORT_TYPES = {
  SAFE: 'SAFE',
  ISSUE: 'ISSUE'
} as const;

export const SAFE_REPORT_EVENT_LOCATION = {
  INTAKE: 'INTAKE',
  MEDICAL_UNIT_INFIRMARY: 'MEDICAL_UNIT_INFIRMARY',
  CLINIC: 'CLINIC',
  HOUSING_UNIT: 'HOUSING_UNIT',
  MEDICATION_CART: 'MEDICATION_CART',
  OTHER: 'OTHER'
};

export const SAFE_REPORT_EVENT_LOCATION_LABEL: any = {
  INTAKE: 'Intake',
  MEDICAL_UNIT_INFIRMARY: 'Medical Unit Infirmary',
  CLINIC: 'Clinic',
  HOUSING_UNIT: 'Housing Unit',
  MEDICATION_CART: 'Medication Cart',
  OTHER: 'Other'
};

export const FACILITY_CHECKLIST_EVENT_PRIORITIES: any = {
  MEDICATION: '1',
  MENTAL_HEALTH: '2',
  EMPLOYEE_SAFETY: '3',
  ENVIRONMENTAL: '4',
  EQUIPMENT_MALFUNCTION: '5'
};

export const NOTIFICATION_TYPE = {
  FACILITY_CHECKLIST_INCOMPLETE: 'FACILITY_CHECKLIST_INCOMPLETE',
  INVENTORY_DEPLETE: 'INVENTORY_DEPLETE',
  ASSIGNE: 'ASSIGN',
  OWNERSHIP_TRANSFER: 'OWNERSHIP_TRANSFER',
  RETURNED_OWNER: 'RETURNED_OWNER',
  RETURNED_SENDER: 'RETURNED_SENDER',
  IN_REVIEW: 'IN_REVIEW',
  CLOSED: 'CLOSED',
  SUBMITTED: 'SUBMITTED',
  AWARENESS: 'AWARENESS',
  CONTROLLED_DRUG_DELETE: 'CONTROLLED_DRUG_DELETE',
  CONTROLLED_DRUG_STATUS: 'CONTROLLED_DRUG_STATUS',
  DISCREPANCY: 'SHIFT_COUNT_DISCREPANCY'
};

export const REQUEST_FORM_TYPE = {
  STANDARD: 'STANDARD',
  AFTER_HOURS: 'AFTER_HOUR'
};

export const REQUEST_FORM_TYPE_LABEL: any = {
  STANDARD: 'Standard',
  AFTER_HOUR: 'After-hours'
};
export const SMALL_MODAL_WIDTHS = {
  xl: '36%',
  md: '60%',
  sm: '100%'
};

export const MEDIUM_MODAL_WIDTHS = {
  xl: '48%',
  md: '80%',
  sm: '100%'
};

export const LARGE_MODAL_WIDTHS = {
  xl: '72%',
  md: '96%',
  sm: '100%'
};

export const INVENTORY_COLUMN_HEADERS = [
  { key: 'formularyAutoId', displayLabel: 'formularyAutoId' },
  { key: 'isFormulary', displayLabel: 'isFormulary' },
  { key: 'name', displayLabel: 'drug' },
  { key: 'drugName', displayLabel: 'drugName' },
  { key: 'brandName', displayLabel: 'brandName' },
  { key: 'genericName', displayLabel: 'genericName' },
  { key: 'strengthUnit', displayLabel: 'strengthUnit' },
  { key: 'formulation', displayLabel: 'formulation' },
  { key: 'release', displayLabel: 'release' },
  { key: 'package', displayLabel: 'package' },
  { key: 'unitsPkg', displayLabel: 'unitsPkg' },
  { key: 'drugClass', displayLabel: 'drugClass' },
  { key: 'isControlled', displayLabel: 'isControlled' },
  { key: 'isGeneric', displayLabel: 'isGeneric' },
  { key: 'isStock', displayLabel: 'isCentralSupply' },
  { key: 'min', displayLabel: 'min' },
  { key: 'max', displayLabel: 'max' },
  { key: 'parLevel', displayLabel: 'parLevel' },
  { key: 'threshold', displayLabel: 'threshold' },
  { key: 'inventoryAutoId', displayLabel: 'inventoryAutoId' },
  { key: 'ndc', displayLabel: 'ndc' },
  { key: 'manufacturer', displayLabel: 'manufacturer' },
  { key: 'lotNo', displayLabel: 'lotNo' },
  { key: 'expirationDate', displayLabel: 'expirationDate' },
  { key: 'isActive', displayLabel: 'ndcStatus' },
  { key: 'controlledDrugAutoId', displayLabel: 'controlledDrugAutoId' },
  { key: 'controlledId', displayLabel: 'controlledId' },
  { key: 'tr', displayLabel: 'tr' },
  { key: 'quantity', displayLabel: 'quantity' }
];

export const EXPIRED_NDC_CSV_COLUMS = [
  { key: 'formularyAutoId', displayLabel: 'formularyAutoId' },
  { key: 'isFormulary', displayLabel: 'isFormulary' },
  { key: 'name', displayLabel: 'drug' },
  { key: 'ndc', displayLabel: 'ndc' },
  { key: 'manufacturer', displayLabel: 'manufacturer' },
  { key: 'expirationDate', displayLabel: 'expirationDate' },
  { key: 'quantity', displayLabel: 'quantity' }
];

export const CENTRAL_SUPPLY_HEADERS = [
  { key: 'formularyAutoId', displayLabel: 'formularyAutoId' },
  { key: 'isFormulary', displayLabel: 'isFormulary' },
  { key: 'name', displayLabel: 'drug' },
  { key: 'brandName', displayLabel: 'brandName' },
  { key: 'genericName', displayLabel: 'genericName' },
  { key: 'strengthUnit', displayLabel: 'strengthUnit' },
  { key: 'release', displayLabel: 'release' },
  { key: 'package', displayLabel: 'package' },
  { key: 'unitsPkg', displayLabel: 'unitsPkg' },
  { key: 'drugClass', displayLabel: 'drugClass' },
  { key: 'isControlled', displayLabel: 'isControlled' },
  { key: 'isGeneric', displayLabel: 'isGeneric' },
  { key: 'totalQuantity', displayLabel: 'qtyOH' },
  { key: 'orderedQuantity', displayLabel: 'qtyOrder' }
];

export const CART_FULFILLMENT_SCREENS = {
  PICK: 'Pick',
  ALLOCATION: 'Allocation',
  RESTOCKLOGS: 'Restock Logs'
} as const;

export const PICK_TABS = {
  UNPROCESSED: 'Unprocessed',
  PROCESSED: 'Processed'
} as const;

export const ALLOCATION_TABS = {
  NON_CONTROLLED: 'Non-Controlled',
  CONTROLLED: 'Controlled',
  INITIAL_ALLOCATION: 'Initital Allocation'
} as const;

export const RESTOCK_LOGS_TABS = {
  STANDARD: 'Standard',
  AFTER_HOURS: 'After-hours',
  INITIAL_ALLOCATION: 'Initial Allocation'
} as const;

export const FILTER_STATUS_OPTIONS = [
  {
    label: ALL,
    value: ALL,
    key: ALL
  },
  {
    label: 'Deleted',
    value: 'deleted',
    key: 'deleted'
  },
  {
    label: 'Fulfilled',
    value: 'uncontrolled',
    key: 'uncontrolled'
  },
  {
    label: 'Picked',
    value: 'picked',
    key: 'picked'
  }
];

export const PICK_STATUS_BACKEND = {
  PROCESSED: 'PROCESSED',
  UNPROCESSED: 'UNPROCESSED'
};

export const ALLOCATION_STATUS_BACKEND = {
  UNFULFILLED: 'UNFULFILLED',
  FULFILLED: 'FULFILLED',
  NULL: 'null'
};

export const ANTIRETROVIRAL = 'Antiretroviral';

export const CONTROLLED_TYPES = {
  STOCK: 'STOCK',
  PATIENT_SPECIFIC: 'PATIENT_SPECIFIC'
};

export const CENTRAL_SUPPLY_LOGS_HEADERS = [
  { key: 'formularyAutoId', displayLabel: 'formularyAutoId' },
  { key: 'isFormulary', displayLabel: 'isFormulary' },
  { key: 'name', displayLabel: 'drug' },
  { key: 'brandName', displayLabel: 'brandName' },
  { key: 'genericName', displayLabel: 'genericName' },
  { key: 'strengthUnit', displayLabel: 'strengthUnit' },
  { key: 'release', displayLabel: 'release' },
  { key: 'package', displayLabel: 'package' },
  { key: 'unitsPkg', displayLabel: 'unitsPkg' },
  { key: 'drugClass', displayLabel: 'drugClass' },
  { key: 'isControlled', displayLabel: 'isControlled' },
  { key: 'isGeneric', displayLabel: 'isGeneric' },
  { key: 'formularyQuantity', displayLabel: 'qtyOH' },
  { key: 'previousOrderedQuantity', displayLabel: 'orderedQty' }
];

export const BRIDGE_THERAPY_SUPPLY_DAYS = [
  { label: '7 Days', value: 7, key: '7' },
  { label: '30 Days', value: 30, key: '30' }
];

export const FOMMULARY_AUTH_ROUTES = {
  NON_CONTROLLED: 'formularyNonControlled',
  CONTROLLED: 'formularyControlled',
  ALL_DRUG: 'formulary'
};

export const DEFAULT_PAGINATION_VALUES = {
  perPage: DEFAULT_PAGE_SIZE.DESKTOP,
  currentPage: 1,
  totalItems: 0
};

export const INVENTORY_BULK_OPTIONS = {
  RECEIVE_INVENTORY: 'RECEIVE_INVENTORY',
  SET_LEVEL: 'SET_LEVEL'
};

export const BULK_INVENTORY_FILE_PROCESSES = {
  NON_CONTROLLED_ADD: 'BULK_ADD_NON_CONTROLLED_INVENTORY_ADD',
  NON_CONTROLLED_EDIT_DELETE: 'BULK_ADD_NON_CONTROLLED_INVENTORY_EDIT_DELETE',
  CONTROLLED_ADD: 'BULK_ADD_CONTROLLED_INVENTORY_ADD',
  CONTROLLED_ADD_EDIT_DELETE: 'BULK_ADD_CONTROLLED_INVENTORY_ADD_EDIT_DELETE'
};

export const NDC_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  NONE: 'none'
};

export const SOCKET_EVENTS = {
  NOTIFICATION_COUNT: 'NOTIFICATION_COUNT',
  RECEIVE_NOTIFICATION: 'RECEIVE_NOTIFICATION'
};
