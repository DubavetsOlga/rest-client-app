export const en = {
  basic: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    restClient: 'REST Client',
    variables: 'Variables',
    history: 'History',
    main: 'Main',
    unexpectedError: 'An unexpected error occurred.',
  },
  mainPage: {
    welcome: 'Welcome',
    welcomeBack: 'Welcome back,',
    aboutProject:
      'The application offers a convenient tool for working with REST API. It includes: request editor with support for formatting and base64 encoding of the request body; response panel with display of HTTP status, headers and other details; ability to select a method (GET, POST, etc.), enter a URL and configure headers; request history for quick access to previous requests.',
    aboutSchool:
      'The project was developed as part of the training at Rolling Scopes School (RS School), a free online school that offers a unique educational experience combining theory and practice.',
  },
  auth: {
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    haveAccount: 'Already have an account?',
    doNotHaveAccount: "Don't have an account?",
    createAccount: 'Create Account',
  },
  historyPage: {
    title: 'History',
    emptyHistory: "You haven't executed any requests. It's empty here. Try:",
  },
  variablesPage: {
    title: 'Variables',
    tableTitle: 'Variable',
    tableValue: 'Value',
    variableNamePlaceholder: 'Add new variable',
    variableValuePlaceholder: 'Add value',
    variablesFilterPlaceholder: 'Filter variables'
  },
  clientPage: {},
  errorPage: {
    text: 'Page Not Found',
    link: 'Go to Main',
  },
  validations: {
    required: 'Required field',
    nameCapitalized: 'Name must start with a capital letter',
    emailInvalid: 'Invalid email address',
    passwordMinLength: 'Password must be at least 8 characters long',
    passwordStrength: 'Must include: 0-9, A-Z, a-z & special character',
    passwordsMustMatch: 'Passwords must match',
  },
  developers: {
    Volha: 'Volha Dubavets',
    Timofei: 'Timofei Naryshkin',
    Polina: 'Polina Ryabova',
    frontendDeveloper: 'Frontend Developer',
  },
  errors: {
    readError: 'Failed to load data',
    saveError: 'Failed to save data',
    deleteError: 'Failed to delete data',
  },
};

export type LanguagesObjType = typeof en;
