/**
 * Comprehensive Mock Data and Generators for IMovies
 * Ensures that all 4 cinema halls, seat layouts, movie posters, and booking flows
 * work reliably even when offline or if the database is in the process of seeding.
 */

export const MOCK_MOVIES = [
  {
    _id: 'movie_inception_01',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: '2024-01-15',
    rating: 8.8,
    averageRating: 8.8,
    totalReviews: 2450,
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://youtube.com/watch?v=YoHD9XEInc0',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
      { name: 'Elliot Page', role: 'Ariadne' },
      { name: 'Tom Hardy', role: 'Eames' },
    ],
  },
  {
    _id: 'movie_dark_knight_02',
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: '2024-02-01',
    rating: 9.0,
    averageRating: 9.0,
    totalReviews: 3120,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    trailerUrl: 'https://youtube.com/watch?v=EXeTwQWrcwY',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', role: 'Joker' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent' },
    ],
  },
  {
    _id: 'movie_interstellar_03',
    title: 'Interstellar',
    description:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: '2024-03-10',
    rating: 8.7,
    averageRating: 8.7,
    totalReviews: 2890,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg',
    trailerUrl: 'https://youtube.com/watch?v=zSWdZVtXT7E',
    certificate: 'U',
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', role: 'Joseph Cooper' },
      { name: 'Anne Hathaway', role: 'Dr. Amelia Brand' },
      { name: 'Jessica Chastain', role: 'Murph' },
    ],
  },
  {
    _id: 'movie_oppenheimer_04',
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: '2024-04-20',
    rating: 8.5,
    averageRating: 8.5,
    totalReviews: 1950,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fm6K9vYI7vdEN39HaAYqqqGhTeC.jpg',
    trailerUrl: 'https://youtube.com/watch?v=uYPbbksJxIg',
    certificate: 'A',
    status: 'now_showing',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss' },
    ],
  },
  {
    _id: 'movie_dune2_05',
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 166,
    releaseDate: '2024-05-15',
    rating: 8.6,
    averageRating: 8.6,
    totalReviews: 1560,
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
    trailerUrl: 'https://youtube.com/watch?v=Way9Dexny3w',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides' },
      { name: 'Zendaya', role: 'Chani' },
      { name: 'Austin Butler', role: 'Feyd-Rautha' },
    ],
  },
  {
    _id: 'movie_rrr_06',
    title: 'RRR',
    description:
      'A fictional story about two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.',
    genre: ['Action', 'Drama'],
    language: 'Hindi',
    duration: 187,
    releaseDate: '2024-06-01',
    rating: 7.8,
    averageRating: 7.8,
    totalReviews: 4200,
    posterUrl: 'https://image.tmdb.org/t/p/w500/wE0noFU4ETjh5Fl9b6S4465Y8PW.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/kYh2l3Z09J2g3Q92wQnB8qN8Z2B.jpg',
    trailerUrl: 'https://youtube.com/watch?v=f_vbAtFSEc0',
    certificate: 'UA',
    status: 'now_showing',
    director: 'S. S. Rajamouli',
    cast: [
      { name: 'N. T. Rama Rao Jr.', role: 'Komaram Bheem' },
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
      { name: 'Alia Bhatt', role: 'Sita' },
    ],
  },
  {
    _id: 'movie_avatar2_07',
    title: 'Avatar: The Way of Water',
    description:
      'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    duration: 192,
    releaseDate: '2025-01-10',
    rating: 7.6,
    averageRating: 7.6,
    totalReviews: 980,
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    trailerUrl: 'https://youtube.com/watch?v=d9MyW72ELq0',
    certificate: 'UA',
    status: 'now_showing',
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully' },
      { name: 'Zoe Saldaña', role: 'Neytiri' },
      { name: 'Sigourney Weaver', role: 'Kiri' },
    ],
  },
  {
    _id: 'movie_batman_08',
    title: 'The Batman',
    description:
      'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 176,
    releaseDate: '2025-02-20',
    rating: 7.8,
    averageRating: 7.8,
    totalReviews: 720,
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    trailerUrl: 'https://youtube.com/watch?v=mqqft2x_Aa4',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Matt Reeves',
    cast: [
      { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman' },
      { name: 'Zoë Kravitz', role: 'Selina Kyle' },
      { name: 'Paul Dano', role: 'The Riddler' },
    ],
  },
  {
    _id: 'movie_pathaan_09',
    title: 'Pathaan',
    description:
      'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 146,
    releaseDate: '2025-03-15',
    rating: 6.8,
    averageRating: 6.8,
    totalReviews: 3500,
    posterUrl: 'https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/m9m5FjWp7e4Uj7J78YyJ2zY8k1P.jpg',
    trailerUrl: 'https://youtube.com/watch?v=vqu4z34wENw',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Siddharth Anand',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Pathaan' },
      { name: 'Deepika Padukone', role: 'Rubina' },
      { name: 'John Abraham', role: 'Jim' },
    ],
  },
  {
    _id: 'movie_spiderverse_10',
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: '2025-04-01',
    rating: 8.7,
    averageRating: 8.7,
    totalReviews: 1850,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://youtube.com/watch?v=cqGjhVJWtEg',
    certificate: 'U',
    status: 'coming_soon',
    director: 'Joaquim Dos Santos',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales (voice)' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)' },
      { name: 'Oscar Isaac', role: 'Miguel O\'Hara (voice)' },
    ],
  },
  {
    _id: 'movie_jawan_11',
    title: 'Jawan',
    description:
      'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in the society while fulfilling a promise made years ago.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 169,
    releaseDate: '2024-01-10',
    rating: 8.4,
    averageRating: 8.4,
    totalReviews: 3420,
    posterUrl: 'https://image.tmdb.org/t/p/w500/lPUrfzWb7icGC6X1z0AKnYRtHGu.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/b9UCfuzwiMUVDEolGQfyua4QZ1I.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Atlee',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Vikram Rathore / Azad' },
      { name: 'Nayanthara', role: 'Narmada Rai' },
      { name: 'Vijay Sethupathi', role: 'Kaalie Gaikwad' },
    ],
  },
  {
    _id: 'movie_animal_12',
    title: 'Animal',
    description:
      'A son’s fierce love for his father turns obsessive and toxic, plunging him into a dark journey of violence and bloody vengeance.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Hindi',
    duration: 201,
    releaseDate: '2024-02-15',
    rating: 8.0,
    averageRating: 8.0,
    totalReviews: 2980,
    posterUrl: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/yOm993fn34d4sFq8pP8o6u103zP.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Dydmpfo68DA',
    certificate: 'A',
    status: 'now_showing',
    director: 'Sandeep Reddy Vanga',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Ranvijay Singh' },
      { name: 'Anil Kapoor', role: 'Balbir Singh' },
      { name: 'Rashmika Mandanna', role: 'Geetanjali' },
      { name: 'Bobby Deol', role: 'Abrar Haque' },
    ],
  },
  {
    _id: 'movie_stree2_13',
    title: 'Stree 2',
    description:
      'The town of Chanderi is being haunted again, this time by a headless entity named Sarkata that abducts modern women, forcing Vicky and his friends to reunite with the mysterious girl.',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    duration: 147,
    releaseDate: '2024-08-15',
    rating: 8.2,
    averageRating: 8.2,
    totalReviews: 2650,
    posterUrl: 'https://image.tmdb.org/t/p/w500/nfnhwfUEFuSOxxf4jDdBlY6Lccw.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kv1xS995c7o',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Amar Kaushik',
    cast: [
      { name: 'Rajkummar Rao', role: 'Vicky' },
      { name: 'Shraddha Kapoor', role: 'She' },
      { name: 'Pankaj Tripathi', role: 'Rudra' },
      { name: 'Abhishek Banerjee', role: 'Jana' },
    ],
  },
  {
    _id: 'movie_fighter_14',
    title: 'Fighter',
    description:
      'Top IAF aviators come together in the face of imminent danger, to form Air Dragons - a specialized quick response team confronting terrorist threats.',
    genre: ['Action', 'War', 'Thriller'],
    language: 'Hindi',
    duration: 166,
    releaseDate: '2024-01-25',
    rating: 7.9,
    averageRating: 7.9,
    totalReviews: 2150,
    posterUrl: 'https://image.tmdb.org/t/p/w500/zqFuriKJ6pYDvf72kXNLONnuE8k.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    certificate: 'UA',
    status: 'now_showing',
    director: 'Siddharth Anand',
    cast: [
      { name: 'Hrithik Roshan', role: 'Shamsher Pathania (Patty)' },
      { name: 'Deepika Padukone', role: 'Minal Rathore (Minni)' },
      { name: 'Anil Kapoor', role: 'Rakesh Jaisingh (Rocky)' },
    ],
  },
  {
    _id: 'movie_dunki_15',
    title: 'Dunki',
    description:
      'Four friends from a village in Punjab share a common dream to go to England. Their problem is that they have neither the visa nor the ticket.',
    genre: ['Comedy', 'Drama'],
    language: 'Hindi',
    duration: 161,
    releaseDate: '2024-03-20',
    rating: 7.7,
    averageRating: 7.7,
    totalReviews: 1890,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Lee7JPuq7XWUErCoJZqCMhuBMQ.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVfjko.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=kYJv9cK7r5k',
    certificate: 'U',
    status: 'now_showing',
    director: 'Rajkumar Hirani',
    cast: [
      { name: 'Shah Rukh Khan', role: 'Hardayal Singh Dhillon (Hardy)' },
      { name: 'Taapsee Pannu', role: 'Manu Randhawa' },
      { name: 'Vicky Kaushal', role: 'Sukhi' },
      { name: 'Boman Irani', role: 'Geetu Gulati' },
    ],
  },
  {
    _id: 'movie_war2_16',
    title: 'War 2',
    description:
      'Major Kabir Dhaliwal returns for a perilous international mission, facing off against a formidable new rival in the YRF Spy Universe.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 160,
    releaseDate: '2025-08-14',
    rating: 8.5,
    averageRating: 8.5,
    totalReviews: 1450,
    posterUrl: 'https://image.tmdb.org/t/p/w500/aOSDKvqglKVa3SYy4CPXYUAfDlf.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=tQ0mzXRk-oU',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Ayan Mukerji',
    cast: [
      { name: 'Hrithik Roshan', role: 'Major Kabir Dhaliwal' },
      { name: 'Jr. NTR', role: 'Agent Vikram' },
      { name: 'Kiara Advani', role: 'Special Agent' },
    ],
  },
  {
    _id: 'movie_singhamagain_17',
    title: 'Singham Again',
    description:
      'DCP Bajirao Singham leads the Cop Universe heroes on a high-stakes cross-border rescue mission infused with epic mythology.',
    genre: ['Action', 'Drama'],
    language: 'Hindi',
    duration: 155,
    releaseDate: '2025-11-01',
    rating: 8.1,
    averageRating: 8.1,
    totalReviews: 1240,
    posterUrl: 'https://image.tmdb.org/t/p/w500/2JbNkHg8m7LaBy61LyrnnlenaxY.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=3R1tC8r9p3Q',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Rohit Shetty',
    cast: [
      { name: 'Ajay Devgn', role: 'Bajirao Singham' },
      { name: 'Kareena Kapoor Khan', role: 'Avni Kamat Singham' },
      { name: 'Deepika Padukone', role: 'SP Shakti Shetty' },
      { name: 'Ranveer Singh', role: 'Sangram Bhalerao (Simmba)' },
    ],
  },
  {
    _id: 'movie_bhoolbhulaiyaa3_18',
    title: 'Bhool Bhulaiyaa 3',
    description:
      'Rooh Baba ventures into the kingdom of Rakhtghat in West Bengal, where he must confront two vengeful spirits claiming to be Manjulika.',
    genre: ['Comedy', 'Horror'],
    language: 'Hindi',
    duration: 158,
    releaseDate: '2025-10-31',
    rating: 8.0,
    averageRating: 8.0,
    totalReviews: 980,
    posterUrl: 'https://image.tmdb.org/t/p/w500/3AfHD1HoaQpQwKH8kxRdBKVmzeU.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/fm6K9vYI7vdEN39HaAYqqqGhTeC.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=8yK3m5yP8r2',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Anees Bazmee',
    cast: [
      { name: 'Kartik Aaryan', role: 'Ruhan Randhawa (Rooh Baba)' },
      { name: 'Vidya Balan', role: 'Mallika / Manjulika' },
      { name: 'Madhuri Dixit', role: 'Mandira / Anjulika' },
      { name: 'Triptii Dimri', role: 'Meera' },
    ],
  },
  {
    _id: 'movie_brahmastra2_19',
    title: 'Brahmastra Part Two: Dev',
    description:
      'The cosmic Astraverse saga continues, revealing the dark past and unstoppable power of Dev, Shiva’s father and wielder of the Agnyastra.',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'Hindi',
    duration: 170,
    releaseDate: '2026-12-01',
    rating: 8.3,
    averageRating: 8.3,
    totalReviews: 1100,
    posterUrl: 'https://image.tmdb.org/t/p/w500/i1K9Bmq8oO0mkUJRNW7mXIWkzcn.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=V5Z8m3r4m5k',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Ayan Mukerji',
    cast: [
      { name: 'Ranbir Kapoor', role: 'Shiva' },
      { name: 'Alia Bhatt', role: 'Isha' },
      { name: 'Ranveer Singh', role: 'Dev' },
      { name: 'Amitabh Bachchan', role: 'Guruji' },
    ],
  },
  {
    _id: 'movie_tiger3_20',
    title: 'Tiger 3',
    description:
      'Following the events of Tiger Zinda Hai and War, Tiger and Zoya are framed as traitors by a vengeful ex-ISI terrorist and must go rogue to clear their names.',
    genre: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 156,
    releaseDate: '2025-06-15',
    rating: 7.8,
    averageRating: 7.8,
    totalReviews: 2400,
    posterUrl: 'https://image.tmdb.org/t/p/w500/7wgED7Yx9VLcNWSO91VgwicHmMD.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=vMzm3rKmsV0',
    certificate: 'UA',
    status: 'coming_soon',
    director: 'Maneesh Sharma',
    cast: [
      { name: 'Salman Khan', role: 'Avinash Singh Rathore (Tiger)' },
      { name: 'Katrina Kaif', role: 'Zoya Humaimi' },
      { name: 'Emraan Hashmi', role: 'Aatish Rehman' },
      { name: 'Shah Rukh Khan', role: 'Pathaan (Cameo)' },
    ],
  },
];

/**
 * 4 Example Cinema Halls / Theatres
 */
export const MOCK_THEATRES = [
  {
    _id: 'theatre_pvr_phoenix_01',
    name: 'PVR ICON: Gold & IMAX',
    location: {
      city: 'Mumbai',
      address: 'Phoenix Marketcity, Level 3, LBS Marg, Kurla West, Mumbai 400070',
      coordinates: { lat: 19.0867, lng: 72.8893 },
    },
    screens: [
      { name: 'Screen 1 - IMAX Laser', totalSeats: 150, seatLayout: { rows: 10, columns: 15 } },
      { name: 'Screen 2 - 4DX Sensory', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
      { name: 'Screen 3 - Gold Class', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['IMAX 4K Laser', 'Dolby Atmos', '4DX Sensory', 'VIP Recliners', 'Gourmet Food Court', 'Valet Parking'],
    contactNumber: '+91-22-40001234',
    email: 'pvr.phoenix@imovies.com',
    isActive: true,
  },
  {
    _id: 'theatre_inox_garuda_02',
    name: 'INOX Insignia: Laserplex',
    location: {
      city: 'Bangalore',
      address: 'Garuda Mall, 4th Floor, Magrath Road, Ashok Nagar, Bengaluru 560025',
      coordinates: { lat: 12.9716, lng: 77.6099 },
    },
    screens: [
      { name: 'Screen 1 - Insignia Royale', totalSeats: 100, seatLayout: { rows: 10, columns: 10 } },
      { name: 'Screen 2 - Dolby Atmos', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
      { name: 'Screen 3 - Club Screen', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['Laser Projection', 'Dolby Atmos 7.1', 'Plush Recliners', 'Butler on Call', 'Multi-Cuisine Cafe'],
    contactNumber: '+91-80-40005678',
    email: 'inox.garuda@imovies.com',
    isActive: true,
  },
  {
    _id: 'theatre_cinepolis_dlf_03',
    name: 'Cinépolis VIP: Macro XE',
    location: {
      city: 'Delhi NCR',
      address: 'DLF Mall of India, 4th Floor, Sector 18, Noida, Delhi NCR 201301',
      coordinates: { lat: 28.5672, lng: 77.3218 },
    },
    screens: [
      { name: 'Screen 1 - Macro XE Giant Screen', totalSeats: 150, seatLayout: { rows: 10, columns: 15 } },
      { name: 'Screen 2 - VIP Lounge', totalSeats: 90, seatLayout: { rows: 6, columns: 15 } },
    ],
    amenities: ['Macro XE Giant Screen', 'Dolby Atmos', 'VIP Leather Recliners', 'In-Seat Dining', 'Free Wi-Fi'],
    contactNumber: '+91-11-40009012',
    email: 'cinepolis.dlf@imovies.com',
    isActive: true,
  },
  {
    _id: 'theatre_spi_express_04',
    name: 'SPI Cinemas: Luxe Royale',
    location: {
      city: 'Chennai',
      address: 'Express Avenue Mall, 3rd Floor, Whites Road, Royapettah, Chennai 600014',
      coordinates: { lat: 13.0604, lng: 80.2635 },
    },
    screens: [
      { name: 'Screen 1 - Luxe Screen', totalSeats: 150, seatLayout: { rows: 10, columns: 15 } },
      { name: 'Screen 2 - Dolby Cinema', totalSeats: 120, seatLayout: { rows: 8, columns: 15 } },
    ],
    amenities: ['4K RGB Laser', 'Dolby Atmos Sound', 'Ergonomic Luxury Seats', 'Fresh Popcorn Bar', 'Wheelchair Friendly'],
    contactNumber: '+91-44-40003456',
    email: 'spi.express@imovies.com',
    isActive: true,
  },
];

/**
 * Generate a full 150-seat layout for a theatre screen
 * Rows A-B: VIP (₹500)
 * Rows C-F: Premium (₹350)
 * Rows G-J: Regular (₹200)
 */
export const generateMockSeatMap = (rowsCount = 10, colsCount = 15) => {
  const seatMap = {};
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Predictable pseudo-random booked seats for realism
  const bookedSeatCodes = ['A4', 'A5', 'B8', 'B9', 'C6', 'C7', 'C8', 'D10', 'D11', 'E5', 'E6', 'G7', 'G8', 'H12'];

  for (let r = 0; r < Math.min(rowsCount, rowLabels.length); r++) {
    const row = rowLabels[r];
    for (let c = 1; c <= colsCount; c++) {
      const code = `${row}${c}`;
      if (bookedSeatCodes.includes(code)) {
        seatMap[code] = 'booked';
      } else {
        seatMap[code] = 'available';
      }
    }
  }

  return seatMap;
};

/**
 * Generate mock shows for a given movie and date across all 4 cinema halls
 */
export const getMockGroupedTheatres = (movieId, dateStr) => {
  let movie = MOCK_MOVIES.find(
    (m) => m._id === movieId || m.title?.toLowerCase() === movieId?.toLowerCase()
  );
  if (!movie) {
    try {
      const stored = JSON.parse(sessionStorage.getItem('imovies_selected_movie') || 'null');
      if (stored && (stored._id === movieId || stored.title?.toLowerCase() === movieId?.toLowerCase())) {
        movie = stored;
      }
    } catch {}
  }
  if (!movie) movie = MOCK_MOVIES[0];

  // Strictly block shows for Coming Soon movies
  if (movie.status === 'coming_soon') {
    return [];
  }

  const showTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM'];
  const movieSlug = (movie.title || 'mv').toLowerCase().replace(/[^a-z0-9]/g, '');

  return MOCK_THEATRES.map((theatre, tIndex) => {
    // Stagger showtimes slightly per theatre
    const theatreShowTimes = showTimes.slice(tIndex % 2, 4);

    const shows = theatreShowTimes.map((time, sIndex) => {
      const showId = `mock_show_${movieSlug}_${movie._id}_${theatre._id}_${dateStr || 'today'}_${sIndex}`;
      const showObj = {
        _id: showId,
        movie,
        theatre,
        screenNumber: (sIndex % (theatre.screens.length || 1)) + 1,
        date: dateStr || new Date().toISOString().split('T')[0],
        startTime: time,
        endTime: calculateMockEndTime(time, movie.duration || 145),
        price: {
          regular: 200,
          premium: 350,
          vip: 500,
        },
        availableSeats: 136 - sIndex * 8,
        totalSeats: 150,
        status: 'active',
      };

      try {
        const cached = JSON.parse(sessionStorage.getItem('imovies_cached_shows') || '{}');
        cached[showId] = showObj;
        sessionStorage.setItem('imovies_cached_shows', JSON.stringify(cached));
      } catch {}

      return showObj;
    });

    return {
      theatre,
      shows,
    };
  });
};

/**
 * Retrieve a mock show by ID
 */
export const getMockShowById = (showId) => {
  // 1. Check cached shows in sessionStorage
  try {
    const cached = JSON.parse(sessionStorage.getItem('imovies_cached_shows') || '{}');
    if (cached[showId] && cached[showId].movie) {
      return cached[showId];
    }
  } catch {}

  let foundMovie = null;

  // 2. Match movie from showId string
  for (const m of MOCK_MOVIES) {
    const slug = m.title?.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (showId && (showId.includes(m._id) || (slug && showId.toLowerCase().includes(slug)))) {
      foundMovie = m;
      break;
    }
  }

  // 3. Fallback to active selected movie from sessionStorage
  if (!foundMovie) {
    try {
      const stored = JSON.parse(sessionStorage.getItem('imovies_selected_movie') || 'null');
      if (stored && stored.title) {
        foundMovie = stored;
      }
    } catch {}
  }

  if (!foundMovie) {
    foundMovie = MOCK_MOVIES[0];
  }

  let foundTheatre = MOCK_THEATRES[0];
  for (const t of MOCK_THEATRES) {
    if (showId && showId.includes(t._id)) {
      foundTheatre = t;
      break;
    }
  }

  const generatedShow = {
    _id: showId,
    movie: foundMovie,
    theatre: foundTheatre,
    screenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '05:00 PM',
    endTime: '07:45 PM',
    price: {
      regular: 200,
      premium: 350,
      vip: 500,
    },
    availableSeats: 136,
    totalSeats: 150,
    seatMap: generateMockSeatMap(10, 15),
    status: 'active',
  };

  try {
    const cached = JSON.parse(sessionStorage.getItem('imovies_cached_shows') || '{}');
    cached[showId] = generatedShow;
    sessionStorage.setItem('imovies_cached_shows', JSON.stringify(cached));
  } catch {}

  return generatedShow;
};

function calculateMockEndTime(startTime, durationMinutes) {
  const parts = startTime.split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = parts[1] || 'PM';

  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const totalMin = h * 60 + m + durationMinutes + 15;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  const endAmpm = endH >= 12 ? 'PM' : 'AM';
  const displayH = endH % 12 === 0 ? 12 : endH % 12;

  return `${displayH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')} ${endAmpm}`;
}

/**
 * Mock Booking Storage in localStorage
 */
export const saveMockBooking = (bookingData) => {
  try {
    const existing = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
    existing.unshift(bookingData);
    localStorage.setItem('imovies_mock_bookings', JSON.stringify(existing));
  } catch (err) {
    console.error('Error saving mock booking:', err);
  }
};

export const getMockBookingById = (bookingId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
    const found = existing.find((b) => b._id === bookingId || b.bookingNumber === bookingId);
    if (found && found.movie) return found;
  } catch (err) {
    console.error('Error getting mock booking:', err);
  }

  // Check if any booking exists in storage
  try {
    const existing = JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
    if (existing.length > 0 && existing[0].movie) return existing[0];
  } catch {}

  // Fallback realistic booking using active selected movie
  let activeMovie = MOCK_MOVIES[0];
  try {
    const saved = JSON.parse(sessionStorage.getItem('imovies_selected_movie') || 'null');
    if (saved && saved.title) activeMovie = saved;
  } catch {}

  return {
    _id: bookingId || 'BK' + Date.now().toString(36).toUpperCase(),
    movie: activeMovie,
    theatre: MOCK_THEATRES[0],
    show: {
      _id: 'show_default',
      date: new Date().toISOString(),
      startTime: '05:00 PM',
      endTime: '07:45 PM',
      screenNumber: 1,
      price: { regular: 200, premium: 350, vip: 500 },
    },
    seats: [
      { seatNumber: 'VIP-A4', seatType: 'vip', price: 500 },
      { seatNumber: 'VIP-A5', seatType: 'vip', price: 500 },
    ],
    totalAmount: 1000,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
};
