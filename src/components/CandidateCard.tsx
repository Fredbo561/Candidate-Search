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

  
  useEffect(() => {
    fetchCandidates();
  }, []);

  
  const currentProfile = candidates[currentIndex] || null;

 
  const handleAddCandidate = () => {
    if (!currentProfile) return;

    const userIdAsString = String(currentProfile.username);
   
    const existingCandidates: string[] = JSON.parse(
      localStorage.getItem('potential_candidates') || '[]'
    );
    
    existingCandidates.push(userIdAsString);

    localStorage.setItem(
      'potential_candidates',
      JSON.stringify(existingCandidates)
    );

    goToNextCandidate();
  };

  
  const handleSkipCandidate = () => {
    goToNextCandidate();
  };

  
  const goToNextCandidate = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= candidates.length) {
        fetchCandidates();
        return 0; 
      return newIndex;
    });
  };


  if (!currentProfile) {
    fetchCandidates();
    return;
  }

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