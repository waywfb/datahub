// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import sinon from 'sinon';
import replaceAllInserter from 'string.prototype.replaceall';

// Mock window.matchMedia interface.
// See https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// and https://github.com/ant-design/ant-design/issues/21096.
global.matchMedia =
    global.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
    });

const { location } = window;
delete window.location;
window.location = { ...location, replace: () => {} };
sinon.stub(window.location, 'replace');
jest.mock('js-cookie', () => ({ get: () => 'urn:li:corpuser:2' }));
jest.mock('./app/entity/shared/tabs/Documentation/components/editor/Editor');

// In case string.prototype.replaceAll not in node version (<15)
replaceAllInserter.shim();
