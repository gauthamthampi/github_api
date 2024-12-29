import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchUserDataFromBackend, saveUserDataToBackend, fetchFollowersFromBackend } from '../utils/api.ts';

const Home = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [selectedFollower, setSelectedFollower] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [cachedData, setCachedData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError('');
    
            // Fetch user data from GitHub API
            const userRes = await axios.get(`https://api.github.com/users/${username}`);
            const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);
            
            const user = userRes.data;
            const repos = repoRes.data;
    
            // Update state with fetched data
            setUserData(user);
            setRepositories(repos);
        } catch (error) {
            setError('Error fetching user data. Please check the username and try again.');
            console.error('Error fetching user data:', error.response || error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    const fetchFollowers = async () => {
        if (!userData || !userData.followers_url) return;
    
        try {
            setLoading(true);
            setError('');
    
            // Fetch followers directly from the GitHub API
            const response = await axios.get(userData.followers_url);
    
            // Update state with the fetched data
            setFollowers(response.data);
            setShowFollowers(true);
        } catch (error) {
            setError('Error fetching followers.');
            console.error('Error fetching followers:', error.response || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            {!selectedRepo && !selectedFollower && !showFollowers && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter GitHub username (e.g., jaymzcd)"
                        style={{ padding: '10px', width: '300px' }}
                    />
                    <button onClick={fetchUserData} style={{ padding: '10px', marginLeft: '10px', cursor: 'pointer' }}>
                        Search
                    </button>
                </div>
            )}

            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {userData && !selectedRepo && !selectedFollower && !showFollowers && !loading && (
                <div>
                    <h2 style={{ textAlign: 'center' }}>{userData.name || username}</h2>
                    <div style={{ textAlign: 'center' }}>
                        <img src={userData.avatar_url} alt="avatar" width="150" style={{ borderRadius: '50%' }} />
                    </div>
                    <p style={{ textAlign: 'center' }}><strong>Bio:</strong> {userData.bio || 'N/A'}</p>
                    <p style={{ textAlign: 'center' }}><strong>Location:</strong> {userData.location || 'N/A'}</p>
                    <p style={{ textAlign: 'center' }}><strong>Public Repos:</strong> {userData.public_repos}</p>
                    <p style={{ textAlign: 'center' }}><strong>Followers:</strong> {userData.followers}</p>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button onClick={fetchFollowers} style={{ padding: '10px', margin: '10px', cursor: 'pointer' }}>
                            View Followers
                        </button>
                        <button
                            onClick={() => {
                                setUserData(null);
                                setRepositories([]);
                                setFollowers([]);
                                setUsername('');
                                setError('');
                            }}
                            style={{ padding: '10px', marginLeft: '10px', cursor: 'pointer' }}
                        >
                            Back to Home
                        </button>
                    </div>

                    <h3 style={{ textAlign: 'center' }}>Repositories</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        {repositories.map((repo) => (
                            <div
                                key={repo.id}
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    width: 'calc(50% - 20px)',
                                    boxSizing: 'border-box',
                                    textAlign: 'center',
                                    borderRadius: '5px',
                                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <h4>{repo.name}</h4>
                                <p>{repo.description || 'No description available'}</p>
                                <p><strong>Forks:</strong> {repo.forks_count}</p>
                                <p><strong>Stars:</strong> {repo.stargazers_count}</p>
                                <button onClick={() => setSelectedRepo(repo)} style={{ padding: '5px', cursor: 'pointer' }}>
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedRepo && (
                <div>
                    <button onClick={() => setSelectedRepo(null)} style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}>
                        Back to Repositories
                    </button>
                    <h2>{selectedRepo.name}</h2>
                    <p>{selectedRepo.description}</p>
                    <p><strong>Forks:</strong> {selectedRepo.forks_count}</p>
                    <p><strong>Stars:</strong> {selectedRepo.stargazers_count}</p>
                    <p><strong>Language:</strong> {selectedRepo.language || 'N/A'}</p>
                    <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                </div>
            )}

            {selectedFollower && (
                <div>
                    <button
                        onClick={() => {
                            setSelectedFollower(null);
                            fetchUserData();
                        }}
                        style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}
                    >
                        Back to Followers
                    </button>
                    <p>Loading follower data...</p>
                </div>
            )}

            {showFollowers && !selectedRepo && !loading && (
                <div>
                    <button
                        onClick={() => {
                            setShowFollowers(false);
                            setFollowers([]);
                        }}
                        style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}
                    >
                        Back to User Info
                    </button>
                    <h3 style={{ textAlign: 'center' }}>Followers</h3>
                    <ul style={{ padding: '0', textAlign: 'center' }}>
                        {followers.map((follower) => (
                            <li key={follower.id} style={{ listStyleType: 'none', marginBottom: '10px' }}>
                                <button
                                    onClick={() => {
                                        setUsername(follower.login);
                                        setSelectedFollower(follower);
                                    }}
                                    style={{ padding: '5px', cursor: 'pointer' }}
                                >
                                    {follower.login}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
