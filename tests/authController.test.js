// tests/authController.test.js
const request = require('supertest');
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Create a new Express application instance
const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// Mock the User model and generateToken function
jest.mock('../models/User');
jest.mock('../utils/generateToken');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('registerUser', () => {
    it('should register a new user and return a token', async () => {
      User.findOne.mockResolvedValue(null); // Simulate no existing user
      User.create.mockResolvedValue({ _id: 'userId', username: 'testuser' });
      generateToken.mockReturnValue('fakeToken');

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toBe(206);
      expect(res.body).toHaveProperty('token', 'fakeToken');
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'testuser' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 if username or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const mockUser = {
        _id: 'userId',
        username: 'testuser',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('fakeToken');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token', 'fakeToken');
    });

    it('should return 401 if credentials are invalid', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 if username or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });
  });
});
