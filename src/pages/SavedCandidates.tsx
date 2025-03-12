import React, { useEffect, useState } from 'react';
import { searchGithubUser } from '../api/API'; 
import '../table.css';

interface GitHubUser {
  login: string;        // GitHub username
  name: string | null;
  avatar_url: string;
  location: string | null;
  email: string | null;
  company: string | null;
  bio: string | null;
}

const SavedCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<GitHubUser[]>([]);

  useEffect(() => {

    const storedUsernames = JSON.parse(
      localStorage.getItem('potential_candidates') || '[]'
    ) as string[];

    if (storedUsernames.length === 0) return;

  
    Promise.all(storedUsernames.map((username) => searchGithubUser(username)))
      .then((fetchedUsers: GitHubUser[]) => {
        setCandidates(fetchedUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  /**
   * Removes a candidate from local state and local storage.
   */
  const handleReject = (username: string) => {
    // 1. Remove from localStorage
    const storedUsernames = JSON.parse(
      localStorage.getItem('potential_candidates') || '[]'
    ) as string[];
    // Filter out the rejected user
    const updatedUsernames = storedUsernames.filter((u) => u !== username);
    // Save new array back to localStorage
    localStorage.setItem(
      'potential_candidates',
      JSON.stringify(updatedUsernames)
    );

    // 2. Update local state
    setCandidates((prev) => prev.filter((user) => user.login !== username));
  };

  return (
    <>
      <h1>Potential Candidates</h1>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name (Username)</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Bio</th>
            <th>Reject</th>
          </tr>
        </thead>

        {/* Render an empty <tbody> if there are no candidates */}
        <tbody>
          {candidates.map((user) => (
            <tr key={user.login}>
              <td>
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  width="50"
                  height="50"
                  style={{ borderRadius: '50%' }}
                />
              </td>
              <td>
                {user.name
                  ? `${user.name} (${user.login})`
                  : user.login}
              </td>
              <td>{user.location}</td>
              <td>{user.email}</td>
              <td>{user.company}</td>
              <td>{user.bio}</td>
              <td>
                <button
                  className="button-neg-saved"
                  onClick={() => handleReject(user.login)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SavedCandidates;