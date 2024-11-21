// tests/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');

dotenv.config({ path: '.env.test' });
jest.mock('../models/User'); // Mock the User model

describe('Auth Middleware', () => {
  beforeAll(() => {
    // Mock the findById method to return a valid user object
    User.findById.mockImplementation((id) => ({
      select: jest.fn().mockResolvedValue({ _id: id, username: 'testuser' }),
    }));
  });

  it('should call next if token is valid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer ' + jwt.sign({ id: 'userId' }, process.env.JWT_SECRET),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
  });

  it('should return 401 if token is invalid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
  });
});
