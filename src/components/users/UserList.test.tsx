import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserList from './UserList';
import * as userService from '../../services/userService';

jest.mock('../../services/userService', () => ({
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
}));

jest.mock('./UserForm', () => ({
    __esModule: true,
    default: ({ onSave, onCancel, user }: any) => (
        <div data-testid="user-form">
            UserForm Mock - {user ? 'Edit Mode' : 'Create Mode'}
        </div>
    ),
}));

describe('UserList Component', () => {
    const mockUsers = [
        {
            id: 'a2e75e2d-2838-40df-997b-c604287f569d',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'a2e75e2d-2838-40df-997b-c604287f569e',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '0987654321',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should show loading state initially', () => {
        (userService.getAllUsers as jest.Mock).mockImplementation(
            () => new Promise(() => { })
        );

        render(<UserList />);

        expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });

    test('should display users after successful load', async () => {
        (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
        render(<UserList />);

        await waitFor(() => {
            expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Total users: 2')).toBeInTheDocument();
    });

    test('should display error message when loading fails', async () => {
        (userService.getAllUsers as jest.Mock).mockRejectedValue(new Error('Failed to load users'));
        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load users')).toBeInTheDocument();
        });
    });

    test('should display empty state when no users exist', async () => {
        (userService.getAllUsers as jest.Mock).mockResolvedValue([]);
        render(<UserList />);

        await waitFor(() => {
            expect(screen.getByText('There are no users to display.')).toBeInTheDocument();
        });
    });

    test('should show form when Create User button is clicked', async () => {
        (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
        render(<UserList />);
        await waitFor(() => {
            expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
        });
        const createButton = screen.getByText('+ Create User');
        fireEvent.click(createButton);

        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByText('UserForm Mock - Create Mode')).toBeInTheDocument();
    });

    test('should show form when Edit User button is clicked', async () => {
        (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
        render(<UserList />);
        await waitFor(() => {
            expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
        });

        expect(screen.queryByText('UserForm Mock - Edit Mode')).not.toBeInTheDocument();
        const editButtons = screen.getAllByRole('button', { name: 'Edit' });
        fireEvent.click(editButtons[0]);

        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByText('UserForm Mock - Edit Mode')).toBeInTheDocument();
    });
});