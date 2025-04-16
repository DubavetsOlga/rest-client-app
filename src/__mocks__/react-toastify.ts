module.exports = {
  ToastContainer: jest.fn(({ children }) => children),
  Flip: jest.fn(),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
  },
};
