import { mockComparisonData } from '../mockData/userMock';

const fetchWithRetry = async (url, retries = 3, options = {}) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1500)); 
        continue;
      }
      return await res.json();
    } catch (error) {
      if (i === retries - 1) return {};
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return {};
};

export const getUserProfile = async (username) => {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum { difficulty count submissions }
            totalSubmissionNum { difficulty submissions }
          }
          submitStats {
            acSubmissionNum { difficulty count submissions }
            totalSubmissionNum { difficulty submissions }
          }
          profile {
            reputation
            ranking
            userAvatar
            realName
            countryName
          }
          badges {
            id
            displayName
            icon
            creationDate
          }
          tagProblemCounts {
            advanced { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            fundamental { tagName problemsSolved }
          }
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
          topPercentage
        }
        userContestRankingHistory(username: $username) {
          contest { title startTime }
          rating
        }
      }
    `;

    const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/leetcode/graphql`, 3, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } })
    });

    if (!res?.data?.matchedUser) {
      return null;
    }

    const { matchedUser, userContestRanking, userContestRankingHistory } = res.data;
    const profile = matchedUser.profile;
    
    let totalAc = 0;
    let totalSub = 0;
    matchedUser.submitStatsGlobal?.acSubmissionNum?.forEach(item => {
      if (item.difficulty === 'All') totalAc = item.submissions;
    });
    matchedUser.submitStatsGlobal?.totalSubmissionNum?.forEach(item => {
      if (item.difficulty === 'All') totalSub = item.submissions;
    });
    const acceptanceRate = totalSub > 0 ? Number(((totalAc / totalSub) * 100).toFixed(1)) : 0;

    const solvedStats = {};
    matchedUser.submitStatsGlobal?.acSubmissionNum?.forEach(item => {
      solvedStats[item.difficulty.toLowerCase()] = item.count;
    });

    const tagCounts = matchedUser.tagProblemCounts || {};
    let allTags = [];
    if (Array.isArray(tagCounts.advanced)) allTags = allTags.concat(tagCounts.advanced.map(t => ({ ...t, difficulty: 'Advanced' })));
    if (Array.isArray(tagCounts.intermediate)) allTags = allTags.concat(tagCounts.intermediate.map(t => ({ ...t, difficulty: 'Intermediate' })));
    if (Array.isArray(tagCounts.fundamental)) allTags = allTags.concat(tagCounts.fundamental.map(t => ({ ...t, difficulty: 'Fundamental' })));
    
    const parsedSkills = allTags.map(s => ({
      name: s.tagName,
      level: s.problemsSolved,
      difficulty: s.difficulty
    }));
    
    const topicDistribution = parsedSkills.map(s => ({
      subject: s.name,
      A: s.level,
      fullMark: Math.max(s.level + 10, 50)
    })).slice(0, 6);

    const topicGroups = {
      'Arrays': ['Array'],
      'Linked List': ['Linked List'],
      'Graph': ['Union Find', 'Topological Sort', 'Shortest Path', 'Graph', 'Graph Theory'],
      'Tree': ['Binary Tree', 'Tree', 'Binary Search Tree'],
      'DP': ['Dynamic Programming'],
      'Queue & Stack': ['Queue', 'Stack', 'Monotonic Stack', 'Monotonic Queue'],
      'Hashmap': ['Hash Table'],
      'Backtracking': ['Backtracking'],
      'String': ['String']
    };

    const groupedMap = new Map();
    Object.keys(topicGroups).forEach(group => groupedMap.set(group, 0));

    parsedSkills.forEach(skill => {
      for (const [groupName, tags] of Object.entries(topicGroups)) {
        if (tags.includes(skill.name)) {
          groupedMap.set(groupName, groupedMap.get(groupName) + skill.level);
        }
      }
    });

    const groupedTopicDistribution = Array.from(groupedMap.entries())
      .filter(([name, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recentContests = (userContestRankingHistory || [])
      .map((c, i, arr) => {
        const prevRating = i > 0 ? arr[i-1].rating : c.rating;
        return {
          name: c.contest?.title || 'Contest',
          ratingChange: c.rating - prevRating, 
          date: c.contest?.startTime ? new Date(c.contest.startTime * 1000).toISOString().split('T')[0] : 'Unknown',
          rating: Math.round(c.rating)
        };
      });

    const languages = matchedUser.languageProblemCount || [];
    languages.sort((a, b) => b.problemsSolved - a.problemsSolved);
    // Rename to fit expected format if needed
    const formattedLanguages = languages.map(l => ({ name: l.languageName, count: l.problemsSolved }));

    let profilePicture = profile.userAvatar;
    if (!profilePicture || profilePicture.includes('default_avatar')) {
      profilePicture = `https://assets.leetcode.com/users/default_avatar.jpg`;
    }

    return {
      username: username,
      realName: profile.realName || username,
      country: profile.countryName || 'Unknown',
      profilePicture,
      contestRating: Math.round(userContestRanking?.rating || 1500),
      globalRanking: profile.ranking || 0,
      topPercentage: userContestRanking?.topPercentage || 0,
      problemsSolved: {
        total: solvedStats.all || 0,
        easy: solvedStats.easy || 0,
        medium: solvedStats.medium || 0,
        hard: solvedStats.hard || 0
      },
      acceptanceRate,
      reputation: profile.reputation || 0,
      currentStreak: 0,
      badges: matchedUser.badges || [],
      activeBadge: matchedUser.badges?.[0] || null,
      languages: formattedLanguages,
      skills: parsedSkills,
      recentContests,
      activity: [], 
      topicDistribution,
      groupedTopicDistribution
    };
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    return null;
  }
};

export const getComparisonData = async (usernameA, usernameB) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockComparisonData), 500);
  });
};

export const getFriendsList = async (username) => {
  try {
    const fetchFriends = async (queryName) => {
      const q = `query { ${queryName}(userSlug: "${username}") { users { userSlug, realName, userAvatar } } }`;
      const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/leetcode/graphql`, 3, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      return res?.data?.[queryName]?.users || [];
    };

    const [followers, following] = await Promise.all([
      fetchFriends('followers'),
      fetchFriends('following')
    ]);

    const friendsMap = new Map();
    followers.forEach(f => {
      let avatar = f.userAvatar;
      if (!avatar || avatar.includes('default_avatar')) avatar = 'https://assets.leetcode.com/users/default_avatar.jpg';
      friendsMap.set(f.userSlug, { username: f.userSlug, displayName: f.realName || f.userSlug, avatarUrl: avatar });
    });
    following.forEach(f => {
      let avatar = f.userAvatar;
      if (!avatar || avatar.includes('default_avatar')) avatar = 'https://assets.leetcode.com/users/default_avatar.jpg';
      friendsMap.set(f.userSlug, { username: f.userSlug, displayName: f.realName || f.userSlug, avatarUrl: avatar });
    });
    
    return Array.from(friendsMap.values());
  } catch (error) {
    console.error("Error fetching friends natively via GraphQL proxy:", error);
    return [];
  }
};

export const fetchUserAndFriendsData = async (username) => {
  try {
    const profileData = await getUserProfile(username);
    const friendsJson = await getFriendsList(username);
    
    return { profileData, friendsData: friendsJson };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const saveSnapshot = async (profileData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/leetcode/snapshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        problemsSolved: profileData.problemsSolved,
        contestRating: profileData.contestRating,
        globalRanking: profileData.globalRanking,
        reputation: profileData.reputation
      })
    });
  } catch (err) {
    console.error('Failed to save snapshot:', err);
  }
};

export const getHistory = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return [];
    
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/leetcode/history`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Failed to get history:', err);
    return [];
  }
};
