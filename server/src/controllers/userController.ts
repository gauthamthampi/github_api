import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com/users';

const fetchGitHubUser = async (username: string): Promise<any> => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/${username}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching data from GitHub API');
  }
};

// 1. Save GitHub User Data
export const saveUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  try {
    // Check if user exists in the database
    const existingUser = await User.findOne({ login: username });
    if (existingUser) {
      res.status(200).json({ message: 'User already exists in the database.', user: existingUser });
      return;
    }

    // Fetch user from GitHub API
    const userData = await fetchGitHubUser(username);

    // Save to database
    const newUser: IUser = new User({
      login: userData.login,
      id: userData.id,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      name: userData.name,
      company: userData.company,
      blog: userData.blog,
      location: userData.location,
      email: userData.email,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    });
    await newUser.save();
    res.status(201).json({ message: 'User saved successfully.', user: newUser });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// 2. Find Mutual Followers (Friends)
export const findFriends = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ login: username });
    if (!user) throw new Error('User not found in the database.');

    const followers = await User.find({ login: { $in: user.followers } });
    const following = await User.find({ login: { $in: user.following } });

    const mutualFollowers = followers
      .map((follower) => follower.login)
      .filter((login) => following.some((followee) => followee.login === login));

    user.friends = mutualFollowers;
    await user.save();

    res.status(200).json({ message: 'Mutual followers updated as friends.', friends: mutualFollowers });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Search Users
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { login: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 4. Soft Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await User.findOneAndUpdate({ login: username }, { isDeleted: true }, { new: true });
    if (!user) throw new Error('User not found.');

    res.status(200).json({ message: 'User soft deleted successfully.', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Update User Fields
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate({ login: username }, updates, { new: true });
    if (!user) throw new Error('User not found.');

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Get All Users Sorted
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const { sortBy } = req.query;

  try {
    const users = await User.find().sort({ [sortBy as string]: 1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//7. Fetch user data
export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params; // Extract username from request params

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ login: username, isDeleted: false });

    if (!user) {
      res.status(404).json({ message: 'User not found in the database.' });
    }

    // Respond with user data
    res.status(200).json({ message: 'User found', userData:user });
  } catch (error: any) {
    // res.status(500).json({ error: error.message });
  }
};
//8. Save user repo
export const saveUserWithRepos = async (req: Request, res: Response): Promise<void> => {
  const { username, userData, repos } = req.body; // Destructure data from the request body
  console.log(repos,"repso");
  
  try {
    // Check if the user already exists by email (assuming email is the unique identifier)
    let user = await User.findOne({ email: userData.email });

    if (user) {
      // Update the existing user
     
      user.repos = repos || repos; // Update repos field
      await user.save();
       res.status(200).json({ message: 'User updated successfully', user });
       return
    }
  } catch (error: any) {
    console.error(error);
     res.status(500).json({ message: 'An error occurred', error: error.message });
     return
  }
};
