import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Echo',
      email: 'admin@example.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
    },
    {
      name: 'Person',
      email: 'user@example.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Daisy',
      image: '/images/dog1.jpg',
      price: 500,
      countInStock: 1,
      description: 'Good Doggo',
    },
    {
      name: 'Parker',
      image: '/images/dog2.jpg',
      price: 450,
      countInStock: 1,
      description: 'Good Doggo',
    },
    {
      name: 'Roger',
      image: '/images/dog3.jpg',
      price: 700,
      countInStock: 1,
      description: 'Good Doggo',
    },
  ],
};
export default data;