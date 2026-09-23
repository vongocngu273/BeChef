require('@testing-library/jest-dom');

// Mock clipboard API in jsdom
if (!navigator.clipboard) {
  navigator.clipboard = {
    writeText: jest.fn().mockImplementation(() => Promise.resolve())
  };
} else if (!navigator.clipboard.writeText) {
  navigator.clipboard.writeText = jest.fn().mockImplementation(() => Promise.resolve());
}
