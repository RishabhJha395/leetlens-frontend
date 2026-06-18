export const mockUserProfile = {
  username: "leet_master",
  realName: "John Doe",
  country: "India",
  profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=leet_master",
  contestRating: 2150,
  globalRanking: 3450,
  problemsSolved: {
    total: 845,
    easy: 350,
    medium: 400,
    hard: 95
  },
  acceptanceRate: 64.2,
  contributionPoints: 4500,
  reputation: 120,
  currentStreak: 45,
  longestStreak: 120,
  badges: ["Guardian", "100 Days Badge", "Annual 2023"],
  languages: [
    { name: "C++", count: 450 },
    { name: "Python", count: 200 },
    { name: "Java", count: 195 }
  ],
  skills: [
    { name: "Dynamic Programming", level: 85 },
    { name: "Graphs", level: 90 },
    { name: "Trees", level: 75 },
    { name: "Two Pointers", level: 95 }
  ],
  recentContests: [
    { name: "Weekly Contest 380", ratingChange: +24, rank: 450, date: "2024-01-14" },
    { name: "Weekly Contest 379", ratingChange: -12, rank: 1200, date: "2024-01-07" },
    { name: "Biweekly Contest 120", ratingChange: +45, rank: 210, date: "2024-01-06" }
  ],
  activity: [
    { date: "2024-01-15", count: 4 },
    { date: "2024-01-16", count: 2 },
    { date: "2024-01-17", count: 6 },
    { date: "2024-01-18", count: 0 },
    { date: "2024-01-19", count: 3 }
  ],
  topicDistribution: [
    { subject: 'Math', A: 120, fullMark: 150 },
    { subject: 'DP', A: 98, fullMark: 150 },
    { subject: 'Graphs', A: 86, fullMark: 150 },
    { subject: 'Trees', A: 99, fullMark: 150 },
    { subject: 'Strings', A: 85, fullMark: 150 },
    { subject: 'Arrays', A: 140, fullMark: 150 },
  ]
};

export const mockComparisonData = {
  profileA: mockUserProfile,
  profileB: {
    ...mockUserProfile,
    username: "code_ninja",
    realName: "Jane Smith",
    contestRating: 1950,
    globalRanking: 12450,
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=code_ninja",
    problemsSolved: {
      total: 620,
      easy: 250,
      medium: 300,
      hard: 70
    },
    skills: [
      { name: "Dynamic Programming", level: 70 },
      { name: "Graphs", level: 80 },
      { name: "Trees", level: 85 },
      { name: "Two Pointers", level: 80 }
    ],
    topicDistribution: [
      { subject: 'Math', A: 90, fullMark: 150 },
      { subject: 'DP', A: 65, fullMark: 150 },
      { subject: 'Graphs', A: 70, fullMark: 150 },
      { subject: 'Trees', A: 110, fullMark: 150 },
      { subject: 'Strings', A: 95, fullMark: 150 },
      { subject: 'Arrays', A: 120, fullMark: 150 },
    ]
  }
};

export const mockFriendsList = ['code_ninja', 'algo_expert', 'dp_master'];