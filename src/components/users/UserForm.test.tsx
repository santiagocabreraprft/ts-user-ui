import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from './UserForm';

describe('UserForm Component', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render create user form when no user is provided', () => {
    render(<UserForm
      user={undefined}
      onSave={mockOnSave}
      onCancel={mockOnCancel}
    />
    );

    expect(screen.getByText('Create New User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  test('should render edit user form when user is provided', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    render(
      <UserForm
        user={mockUser}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit User')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  test('should show validation errors when submitting empty form', () => {
    render(
      <UserForm
        user={undefined}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const createButton = screen.getByRole('button', { name: /create/i });

    fireEvent.click(createButton);

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
  });

  test('should show validaion error for invalid email updating user', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johnexample.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    render(
      <UserForm
        user={mockUser}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  })
})