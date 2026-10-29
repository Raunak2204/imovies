import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import { generateSeatMap, calculateEndTime } from './helpers.js';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

// ── Sample Data ──────────────────────────────────────────────────────────

const adminUsers = [
  {
    name: 'Admin User',
    email: 'admin@imovies.com',
    password: 'admin123',
    phone: '+91-9876543210',
    role: 'admin',
  },
  {
    name: 'Super Admin',
    email: 'superadmin@imovies.com',
    password: 'superadmin123',
    phone: '+91-9876543211',
    role: 'admin',
  },
];

const regularUsers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '+91-9123456780',
    role: 'user',
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91-9123456781',
    role: 'user',
  },
  {
    name: 'Amit Kumar',
    email: 'amit@example.com',
    password: 'password123',
    phone: '+91-9123456782',
    role: 'user',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    password: 'password123',
    phone: '+91-9123456783',
    role: 'user',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    password: 'password123',
    phone: '+91-9123456784',
    role: 'user',
  },
];

const moviesData = [
  {
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2024-01-15'),
    endDate: new Date('2026-12-31'),
    rating: 8.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://youtube.com/watch?v=YoHD9XEInc0',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', image: '' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', image: '' },
      { name: 'Elliot Page', role: 'Ariadne', image: '' },
    ],
    director: 'Christopher Nolan',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 8.8,
    totalReviews: 2450,
  },
  {
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: new Date('2024-02-01'),
    endDate: new Date('2026-12-31'),
    rating: 9.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    trailerUrl: 'https://youtube.com/watch?v=EXeTwQWrcwY',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', image: '' },
      { name: 'Heath Ledger', role: 'Joker', image: '' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent', image: '' },
    ],
    director: 'Christopher Nolan',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 9.0,
    totalReviews: 3120,
  },
  {
    title: 'Interstellar',
    description:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2024-03-10'),
    endDate: new Date('2026-12-31'),
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg',
    trailerUrl: 'https://youtube.com/watch?v=zSWdZVtXT7E',
    cast: [
      { name: 'Matthew McConaughey', role: 'Joseph Cooper', image: '' },
      { name: 'Anne Hathaway', role: 'Dr. Amelia Brand', image: '' },
      { name: 'Jessica Chastain', role: 'Murph', image: '' },
    ],
    director: 'Christopher Nolan',
    certificate: 'U',
    status: 'now_showing',
    averageRating: 8.7,
    totalReviews: 2890,
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: new Date('2024-04-20'),
    endDate: new Date('2026-12-31'),
    rating: 8.5,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fm6K9vYI7vdEN39HaAYqqqGhTeC.jpg',
    trailerUrl: 'https://youtube.com/watch?v=uYPbbksJxIg',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: '' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer', image: '' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: '' },
    ],
    director: 'Christopher Nolan',
    certificate: 'A',
    status: 'now_showing',
    averageRating: 8.5,
    totalReviews: 1950,
  },
  {
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 166,
    releaseDate: new Date('2024-05-15'),
    endDate: new Date('2026-12-31'),
    rating: 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
    trailerUrl: 'https://youtube.com/watch?v=Way9Dexny3w',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', image: '' },
      { name: 'Zendaya', role: 'Chani', image: '' },
      { name: 'Austin Butler', role: 'Feyd-Rautha', image: '' },
    ],
    director: 'Denis Villeneuve',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 8.6,
    totalReviews: 1560,
  },
  {
    title: 'RRR',
    description:
      'A fictional story about two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.',
    genre: ['Action', 'Drama'],
    language: 'Hindi',
    duration: 187,
    releaseDate: new Date('2024-06-01'),
    endDate: new Date('2026-12-31'),
    rating: 7.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/wE0noFU4ETjh5Fl9b6S4465Y8PW.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/kYh2l3Z09J2g3Q92wQnB8qN8Z2B.jpg',
    trailerUrl: 'https://youtube.com/watch?v=f_vbAtFSEc0',
    cast: [
      { name: 'N. T. Rama Rao Jr.', role: 'Komaram Bheem', image: '' },
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju', image: '' },
      { name: 'Alia Bhatt', role: 'Sita', image: '' },
    ],
    director: 'S. S. Rajamouli',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 7.8,
    totalReviews: 4200,
  },
  {
    title: 'Avatar: The Way of Water',
    description:
      'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: 192,
    releaseDate: new Date('2025-01-10'),
    endDate: new Date('2026-12-31'),
    rating: 7.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    trailerUrl: 'https://youtube.com/watch?v=d9MyW72ELq0',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully', image: '' },
      { name: 'Zoe Saldaña', role: 'Neytiri', image: '' },
      { name: 'Sigourney Weaver', role: 'Kiri', image: '' },
    ],
    director: 'James Cameron',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 7.6,
    totalReviews: 980,
  },
  {
    title: 'The Batman',
    description:
      'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 176,
    releaseDate: new Date('2025-02-20'),
    endDate: new Date('2026-12-31'),
    rating: 7.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    trailerUrl: 'https://youtube.com/watch?v=mqqft2x_Aa4',
    cast: [
      { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman', image: '' },
      { name: 'Zoë Kravitz', role: 'Selina Kyle', image: '' },
      { name: 'Paul Dano', role: 'The Riddler', image: '' },
    ],
    director: 'Matt Reeves',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 7.8,
    totalReviews: 720,
  },
  {
    title: 'Pathaan',
    description:
      'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 146,
    releaseDate: new Date('2025-03-15'),
    endDate: new Date('2026-12-31'),
    rating: 6.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/m9m5FjWp7e4Uj7J78YyJ2zY8k1P.jpg',
    trailerUrl: 'https://youtube.com/watch?v=vqu4z34wENw',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Pathaan', image: '' },
      { name: 'Deepika Padukone', role: 'Rubina', image: '' },
      { name: 'John Abraham', role: 'Jim', image: '' },
    ],
    director: 'Siddharth Anand',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 6.8,
    totalReviews: 3500,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: new Date('2025-04-01'),
    endDate: new Date('2026-12-31'),
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://youtube.com/watch?v=cqGjhVJWtEg',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (voice)', image: '' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)', image: '' },
      { name: 'Oscar Isaac', role: 'Miguel O\'Hara (voice)', image: '' },
    ],
    director: 'Joaquim Dos Santos',
    certificate: 'U',
    status: 'now_showing',
    averageRating: 8.7,
    totalReviews: 1850,
  },
  {
    title: 'Jawan',
    description:
      'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in the society while fulfilling a promise made years ago.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 169,
    releaseDate: new Date('2024-01-10'),
    endDate: new Date('2026-12-31'),
    rating: 8.4,
    posterUrl: 'https://image.tmdb.org/t/p/w500/lPUrfzWb7icGC6X1z0AKnYRtHGu.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/b9UCfuzwiMUVDEolGQfyua4QZ1I.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Vikram Rathore / Azad', image: '' },
      { name: 'Nayanthara', role: 'Narmada Rai', image: '' },
      { name: 'Vijay Sethupathi', role: 'Kaalie Gaikwad', image: '' },
    ],
    director: 'Atlee',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 8.4,
    totalReviews: 3420,
  },
  {
    title: 'Animal',
    description:
      'A son’s fierce love for his father turns obsessive and toxic, plunging him into a dark journey of violence and bloody vengeance.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Hindi',
    duration: 201,
    releaseDate: new Date('2024-02-15'),
    endDate: new Date('2026-12-31'),
    rating: 8.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/yOm993fn34d4sFq8pP8o6u103zP.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Dydmpfo68DA',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Ranvijay Singh', image: '' },
      { name: 'Anil Kapoor', role: 'Balbir Singh', image: '' },
      { name: 'Rashmika Mandanna', role: 'Geetanjali', image: '' },
      { name: 'Bobby Deol', role: 'Abrar Haque', image: '' },
    ],
    director: 'Sandeep Reddy Vanga',
    certificate: 'A',
    status: 'now_showing',
    averageRating: 8.0,
    totalReviews: 2980,
  },
  {
    title: 'Stree 2',
    description:
      'The town of Chanderi is being haunted again, this time by a headless entity named Sarkata that abducts modern women, forcing Vicky and his friends to reunite with the mysterious girl.',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    duration: 147,
    releaseDate: new Date('2024-08-15'),
    endDate: new Date('2026-12-31'),
    rating: 8.2,
    posterUrl: 'https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kv1xS995c7o',
    cast: [
      { name: 'Rajkummar Rao', role: 'Vicky', image: '' },
      { name: 'Shraddha Kapoor', role: 'She', image: '' },
      { name: 'Pankaj Tripathi', role: 'Rudra', image: '' },
    ],
    director: 'Amar Kaushik',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 8.2,
    totalReviews: 2650,
  },
  {
    title: 'Fighter',
    description:
      'Top IAF aviators come together in the face of imminent danger, to form Air Dragons - a specialized quick response team confronting terrorist threats.',
    genre: ['Action', 'War', 'Thriller'],
    language: 'Hindi',
    duration: 166,
    releaseDate: new Date('2024-01-25'),
    endDate: new Date('2026-12-31'),
    rating: 7.9,
    posterUrl: 'https://image.tmdb.org/t/p/w500/zqFuriKJ6pYDvf72kXNLONnuE8k.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    cast: [
      { name: 'Hrithik Roshan', role: 'Shamsher Pathania (Patty)', image: '' },
      { name: 'Deepika Padukone', role: 'Minal Rathore (Minni)', image: '' },
      { name: 'Anil Kapoor', role: 'Rakesh Jaisingh (Rocky)', image: '' },
    ],
    director: 'Siddharth Anand',
    certificate: 'UA',
    status: 'now_showing',
    averageRating: 7.9,
    totalReviews: 2150,
  },
  {
    title: 'Dunki',
    description:
      'Four friends from a village in Punjab share a common dream to go to England. Their problem is that they have neither the visa nor the ticket.',
    genre: ['Comedy', 'Drama'],
    language: 'Hindi',
    duration: 161,
    releaseDate: new Date('2024-03-20'),
    endDate: new Date('2026-12-31'),
    rating: 7.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Lee7JPuq7XWUErCoJZqCMhuBMQ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kYJv9cK7r5k',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Hardayal Singh Dhillon (Hardy)', image: '' },
      { name: 'Taapsee Pannu', role: 'Manu Randhawa', image: '' },
      { name: 'Vicky Kaushal', role: 'Sukhi', image: '' },
    ],
    director: 'Rajkumar Hirani',
    certificate: 'U',
    status: 'now_showing',
    averageRating: 7.7,
    totalReviews: 1890,
  },
  {
    title: 'War 2',
    description:
      'Major Kabir Dhaliwal returns for a perilous international mission, facing off against a formidable new rival in the YRF Spy Universe.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 160,
    releaseDate: new Date('2025-08-14'),
    endDate: new Date('2026-12-31'),
    rating: 8.5,
    posterUrl: 'https://image.tmdb.org/t/p/w500/aOSDKvqglKVa3SYy4CPXYUAfDlf.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=tQ0mzXRk-oU',
    cast: [
      { name: 'Hrithik Roshan', role: 'Major Kabir Dhaliwal', image: '' },
      { name: 'Jr. NTR', role: 'Agent Vikram', image: '' },
    ],
    director: 'Ayan Mukerji',
    certificate: 'UA',
    status: 'coming_soon',
    averageRating: 8.5,
    totalReviews: 1450,
  },
  {
    title: 'Singham Again',
    description:
      'DCP Bajirao Singham leads the Cop Universe heroes on a high-stakes cross-border rescue mission infused with epic mythology.',
    genre: ['Action', 'Drama'],
    language: 'Hindi',
    duration: 155,
    releaseDate: new Date('2025-11-01'),
    endDate: new Date('2026-12-31'),
    rating: 8.1,
    posterUrl: 'https://image.tmdb.org/t/p/w500/2JbNkHg8m7LaBy61LyrnnlenaxY.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=3R1tC8r9p3Q',
    cast: [
      { name: 'Ajay Devgn', role: 'Bajirao Singham', image: '' },
      { name: 'Kareena Kapoor Khan', role: 'Avni Kamat Singham', image: '' },
      { name: 'Deepika Padukone', role: 'SP Shakti Shetty', image: '' },
    ],
    director: 'Rohit Shetty',
    certificate: 'UA',
    status: 'coming_soon',
    averageRating: 8.1,
    totalReviews: 1240,
  },
  {
    title: 'Bhool Bhulaiyaa 3',
    description:
      'Rooh Baba ventures into the kingdom of Rakhtghat in West Bengal, where he must confront two vengeful spirits claiming to be Manjulika.',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    duration: 158,
    releaseDate: new Date('2025-10-31'),
    endDate: new Date('2026-12-31'),
    rating: 8.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/3AfHD1HoaQpQwKH8kxRdBKVmzeU.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fm6K9vYI7vdEN39HaAYqqqGhTeC.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=8yK3m5yP8r2',
    cast: [
      { name: 'Kartik Aaryan', role: 'Ruhan Randhawa (Rooh Baba)', image: '' },
      { name: 'Vidya Balan', role: 'Mallika / Manjulika', image: '' },
    ],
    director: 'Anees Bazmee',
    certificate: 'UA',
    status: 'coming_soon',
    averageRating: 8.0,
    totalReviews: 980,
  },
  {
    title: 'Brahmastra Part Two: Dev',
    description:
      'The cosmic Astraverse saga continues, revealing the dark past and unstoppable power of Dev, Shiva’s father and wielder of the Agnyastra.',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'Hindi',
    duration: 170,
    releaseDate: new Date('2026-12-01'),
    endDate: new Date('2026-12-31'),
    rating: 8.3,
    posterUrl: 'https://image.tmdb.org/t/p/w500/i1K9Bmq8oO0mkUJRNW7mXIWkzcn.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=V5Z8m3r4m5k',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Shiva', image: '' },
      { name: 'Alia Bhatt', role: 'Isha', image: '' },
      { name: 'Ranveer Singh', role: 'Dev', image: '' },
    ],
    director: 'Ayan Mukerji',
    certificate: 'UA',
    status: 'coming_soon',
    averageRating: 8.3,
    totalReviews: 1100,
  },
  {
    title: 'Tiger 3',
    description:
      'Following the events of Tiger Zinda Hai and War, Tiger and Zoya are framed as traitors by a vengeful ex-ISI terrorist and must go rogue to clear their names.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 156,
    releaseDate: new Date('2025-06-15'),
    endDate: new Date('2026-12-31'),
    rating: 7.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/7wgED7Yx9VLcNWSO91VgwicHmMD.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=vMzm3rKmsV0',
    cast: [
      { name: 'Salman Khan', role: 'Avinash Singh Rathore (Tiger)', image: '' },
      { name: 'Katrina Kaif', role: 'Zoya Humaimi', image: '' },
      { name: 'Emraan Hashmi', role: 'Aatish Rehman', image: '' },
    ],
    director: 'Maneesh Sharma',
    certificate: 'UA',
    status: 'coming_soon',
    averageRating: 7.8,
    totalReviews: 2400,
  },
];

const theatresData = [
  {
    name: 'PVR Cinemas - Phoenix Mall',
    location: {
      city: 'Mumbai',
      address: 'Phoenix Marketcity, LBS Marg, Kurla West, Mumbai 400070',
      coordinates: { lat: 19.0867, lng: 72.8893 },
    },
    screens: [
      { name: 'Screen 1 - IMAX', totalSeats: 150, seatLayout: { rows: 10, columns: 15 } },
      { name: 'Screen 2 - 4DX', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
      { name: 'Screen 3', totalSeats: 100, seatLayout: { rows: 10, columns: 10 } },
    ],
    amenities: ['Parking', 'Food Court', 'IMAX', '4DX', 'Dolby Atmos', 'Wheelchair Accessible'],
    contactNumber: '+91-22-40001234',
    email: 'pvr.phoenix@imovies.com',
    isActive: true,
  },
  {
    name: 'INOX - Garuda Mall',
    location: {
      city: 'Bangalore',
      address: 'Garuda Mall, Magrath Road, Ashok Nagar, Bangalore 560025',
      coordinates: { lat: 12.9716, lng: 77.6099 },
    },
    screens: [
      { name: 'Insignia - Screen 1', totalSeats: 100, seatLayout: { rows: 10, columns: 10 } },
      { name: 'Screen 2', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
      { name: 'Screen 3', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['Parking', 'Food Court', 'Recliner Seats', 'Dolby Atmos'],
    contactNumber: '+91-80-40005678',
    email: 'inox.garuda@imovies.com',
    isActive: true,
  },
  {
    name: 'Cinépolis - DLF Mall',
    location: {
      city: 'Delhi',
      address: 'DLF Mall of India, Sector 18, Noida, Delhi NCR 201301',
      coordinates: { lat: 28.5672, lng: 77.3218 },
    },
    screens: [
      { name: 'Macro XE - Screen 1', totalSeats: 200, seatLayout: { rows: 10, columns: 20 } },
      { name: 'Screen 2', totalSeats: 150, seatLayout: { rows: 10, columns: 15 } },
      { name: 'Screen 3', totalSeats: 100, seatLayout: { rows: 10, columns: 10 } },
      { name: 'VIP Screen 4', totalSeats: 50, seatLayout: { rows: 5, columns: 10 } },
    ],
    amenities: ['Parking', 'Food Court', 'VIP Lounge', 'Macro XE', 'Dolby Atmos', '4DX'],
    contactNumber: '+91-11-40009012',
    email: 'cinepolis.dlf@imovies.com',
    isActive: true,
  },
  {
    name: 'SPI Cinemas - Express Avenue',
    location: {
      city: 'Chennai',
      address: 'Express Avenue Mall, Whites Road, Royapettah, Chennai 600014',
      coordinates: { lat: 13.0604, lng: 80.2635 },
    },
    screens: [
      { name: 'Screen 1 - Luxe', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
      { name: 'Screen 2', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
    ],
    amenities: ['Parking', 'Food Court', 'Luxe Recliners', 'Dolby Atmos'],
    contactNumber: '+91-44-40003456',
    email: 'spi.express@imovies.com',
    isActive: true,
  },
];

// ── Seed Function ────────────────────────────────────────────────────────

export const seedDatabase = async ({ exitOnFinish = false } = {}) => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    console.log('Creating users...');
    const admins = await User.create(adminUsers);
    const users = await User.create(regularUsers);
    console.log(`  ✓ Created ${admins.length} admin users`);
    console.log(`  ✓ Created ${users.length} regular users`);

    // Create movies
    console.log('Creating movies...');
    const movies = await Movie.create(moviesData);
    console.log(`  ✓ Created ${movies.length} movies`);

    // Create theatres
    console.log('Creating theatres...');
    const theatres = await Theatre.create(theatresData);
    console.log(`  ✓ Created ${theatres.length} theatres`);

    // Create shows for now_showing movies
    console.log('Creating shows...');
    const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');
    const showsToCreate = [];

    const showTimes = ['10:00', '13:30', '17:00', '20:30'];
    const today = new Date();

    for (const movie of nowShowingMovies) {
      for (const theatre of theatres) {
        // Create shows for next 14 days
        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const showDate = new Date(today);
          showDate.setDate(showDate.getDate() + dayOffset);
          showDate.setHours(0, 0, 0, 0);

          const screen = theatre.screens[0] || { seatLayout: { rows: 10, columns: 15 } };
          const screenNumber = 1;

          for (const startTime of showTimes) {
            const endTime = calculateEndTime(startTime, movie.duration + 15);
            const rows = screen.seatLayout?.rows || 10;
            const cols = screen.seatLayout?.columns || 15;
            const seatMap = generateSeatMap(rows, cols);
            const totalSeats = rows * cols;

            showsToCreate.push({
              movie: movie._id,
              theatre: theatre._id,
              screenNumber,
              date: showDate,
              startTime,
              endTime,
              price: {
                regular: 200,
                premium: 350,
                vip: 500,
              },
              availableSeats: totalSeats,
              totalSeats,
              seatMap,
              status: 'active',
            });
          }
        }
      }
    }

    const shows = await Show.create(showsToCreate);
    console.log(`  ✓ Created ${shows.length} shows`);

    // Create initial demo bookings and payments
    console.log('Creating initial demo bookings & payments...');
    const demoBookings = [
      {
        user: users[0]._id, // Rahul Sharma
        show: shows[0]._id,
        movie: shows[0].movie,
        theatre: shows[0].theatre,
        seats: [
          { seatNumber: 'C4', seatType: 'premium', price: 350 },
          { seatNumber: 'C5', seatType: 'premium', price: 350 },
        ],
        totalAmount: 700,
        status: 'confirmed',
      },
      {
        user: users[1]._id, // Priya Patel
        show: shows[1]._id,
        movie: shows[1].movie,
        theatre: shows[1].theatre,
        seats: [
          { seatNumber: 'A1', seatType: 'vip', price: 500 },
          { seatNumber: 'A2', seatType: 'vip', price: 500 },
        ],
        totalAmount: 1000,
        status: 'confirmed',
      },
      {
        user: users[2]._id, // Amit Kumar
        show: shows[2]._id,
        movie: shows[2].movie,
        theatre: shows[2].theatre,
        seats: [
          { seatNumber: 'G1', seatType: 'regular', price: 200 },
          { seatNumber: 'G2', seatType: 'regular', price: 200 },
        ],
        totalAmount: 400,
        status: 'confirmed',
      },
      {
        user: users[4]._id, // Vikram Singh
        show: shows[3]._id,
        movie: shows[3].movie,
        theatre: shows[3].theatre,
        seats: [
          { seatNumber: 'D8', seatType: 'premium', price: 350 },
          { seatNumber: 'D9', seatType: 'premium', price: 350 },
          { seatNumber: 'D10', seatType: 'premium', price: 350 },
          { seatNumber: 'D11', seatType: 'premium', price: 350 },
        ],
        totalAmount: 1400,
        status: 'confirmed',
      },
    ];

    const createdBookings = await Booking.create(demoBookings);

    for (const b of createdBookings) {
      const p = await Payment.create({
        booking: b._id,
        user: b.user,
        amount: b.totalAmount,
        method: 'credit_card',
        transactionId: 'TXN_' + b._id.toString().slice(-8).toUpperCase(),
        status: 'success',
        paidAt: new Date(),
      });
      b.paymentId = p._id;
      await b.save();

      await User.findByIdAndUpdate(b.user, {
        $push: { bookings: b._id },
      });
    }
    console.log(`  ✓ Created ${createdBookings.length} initial confirmed bookings & payments`);

    // Summary
    console.log('\n══════════════════════════════════════');
    console.log('  Database seeded successfully!');
    console.log('══════════════════════════════════════');
    console.log(`  Admin Users:    ${admins.length}`);
    console.log(`  Regular Users:  ${users.length}`);
    console.log(`  Movies:         ${movies.length}`);
    console.log(`  Theatres:       ${theatres.length}`);
    console.log(`  Shows:          ${shows.length}`);
    console.log(`  Bookings:       ${createdBookings.length}`);
    console.log(`  Initial Profit: ₹3,500`);
    console.log('══════════════════════════════════════');
    console.log('\nAdmin credentials:');
    console.log('  Email: admin@imovies.com / Password: admin123');
    console.log('  Email: superadmin@imovies.com / Password: superadmin123');
    console.log('\nUser credentials (all have password: password123):');
    console.log('  rahul@example.com, priya@example.com, amit@example.com');
    console.log('  sneha@example.com, vikram@example.com');

    if (exitOnFinish) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    if (exitOnFinish) {
      process.exit(1);
    }
    throw error;
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('🎬 Database is empty. Automatically seeding initial movies, theatres, shows, and demo accounts...');
      await seedDatabase({ exitOnFinish: false });
      console.log('✅ Initial database auto-seed complete!');
    }
  } catch (err) {
    console.error('⚠️ Auto-seed notice:', err.message);
  }
};

// Check if run directly from CLI (e.g. `node utils/seeder.js` or `npm run seed`)
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  seedDatabase({ exitOnFinish: true });
}

export default seedDatabase;
