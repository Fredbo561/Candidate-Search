import React, { useEffect, useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import '../card.css';

interface ProfileProps {
  id: number;
  avatarUrl: string;
  name: string;
  username: string;
  location: string;
  email: string;
  company: string;
  bio: string;
}

const CandidateCard: React.FC = () => {
  const [candidates, setCandidates] = useState<ProfileProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchCandidates = async () => {
    searchGithub().then(async (data) => {
      if (!data || data.length === 0) return;
      const fullData = await Promise.all(
        data.map(async (user: any) => {
          const newUserData = await searchGithubUser(user.login);
          console.log('New User Data:', newUserData);
          return newUserData;
        })
      );

      console.log('Full Data:', fullData);

      // Convert each user object into the shape we need for our profile
      const mappedCandidates: ProfileProps[] = fullData.map((user: any) => ({
        id: user.id,
        avatarUrl: user.avatar_url,
        name: user.name || 'No Name Provided',
        username: user.login,
        location: user.location || 'No Location Provided',
        email: user.email || 'No Email Provided',
        company: user.organizations || 'No Company Provided',
        bio: user.bio || 'No Bio Provided',
      }));

      setCandidates(mappedCandidates);
    });
  }

  /**
   * Fetch candidates from GitHub upon component mount.
   * Convert them into the ProfileProps shape and store in `candidates`.
   */
  useEffect(() => {
    fetchCandidates();
  }, []);

  /**
   * Helper to get the "current" user's data from the `candidates` array.
   */
  const currentProfile = candidates[currentIndex] || null;

  /**
   * Saves the current user’s ID to localStorage and then goes to the next card.
   */
  const handleAddCandidate = () => {
    if (!currentProfile) return;

    const userIdAsString = String(currentProfile.username);
    // 1. Get existing array from localStorage
    const existingCandidates: string[] = JSON.parse(
      localStorage.getItem('potential_candidates') || '[]'
    );
    // 2. Push new ID into array
    existingCandidates.push(userIdAsString);
    // 3. Save updated array back to local storage
    localStorage.setItem(
      'potential_candidates',
      JSON.stringify(existingCandidates)
    );

    goToNextCandidate();
  };

  /**
   * Skip saving to localStorage, just go to the next card.
   */
  const handleSkipCandidate = () => {
    goToNextCandidate();
  };

  /**
   * Increments the current index to load the next candidate.
   */
  const goToNextCandidate = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= candidates.length) {
        fetchCandidates();
        return 0; // or reset to 0 if you want to wrap around
      }
      return newIndex;
    });
  };

  // If there's no current profile (e.g., data not loaded or end of array):
  if (!currentProfile) {
    fetchCandidates();
    return;
  }

  // Render the current candidate’s card
  return (
    <div>
      <div className='profile-card'>
        <div>
          <img src={currentProfile.avatarUrl} alt="avatar" />
        </div>
        <div>
          <h2>{currentProfile.name}</h2>
          <p>({currentProfile.username})</p>
        </div>
        <div>
          <p>Location: {currentProfile.location}</p>
        </div>
        <div>
          <p>Email: {currentProfile.email}</p>
        </div>
        <div>
          <p>Company: {currentProfile.company}</p>
        </div>
        <div>
          <p>Bio: {currentProfile.bio}</p>
        </div>
      </div>

      <div className='button-container'>
        <button className='button-neg' onClick={handleSkipCandidate}>
          -
        </button>
        <button className='button-pos' onClick={handleAddCandidate}>
          +
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;