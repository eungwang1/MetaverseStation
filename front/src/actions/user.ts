import { IupdateProfile, IUserState } from '@customTypes/user';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getlikedPostTotalPages, getmyPostTotalPages } from '@slices/userSlice';
import axios from 'axios';

interface ILoadUserPosts {
  keyword: string;
  category: string;
  pageNum: string;
  userId: number;
  filter?: string;
}

export const loadMyInfo = createAsyncThunk('user/loadMyInfo', async (data, thunkAPI) => {
  const {
    userSlice: { AccessToken },
  } = thunkAPI.getState() as { userSlice: IUserState };
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${AccessToken}}`,
    },
  });
  return res.data;
});

export const changeNickName = createAsyncThunk(
  'user/changeNickName',
  async (data: string, thunkAPI) => {
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/username`, data, {
      params: {
        userName: data,
      },
      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: IupdateProfile, thunkAPI) => {
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });
    return res.data;
  },
);

export const loadAuthorLikedPosts = createAsyncThunk(
  'authorLikedPosts/load',
  async (userId: number, thunkAPI) => {
    const {
      userSlice: { likedPostPageNum },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/likepost/${userId}`, {
      headers: {
        Authorization: `Bearer ${AccessToken}}`,
      },
      params: {
        size: 8,
        page: likedPostPageNum - 1,
      },
    });
    thunkAPI.dispatch(getlikedPostTotalPages(res.data.totalPages));
    return res.data.content;
  },
);

export const loadAuthorPosts = createAsyncThunk(
  'authorPosts/load',
  async (userId: number, thunkAPI) => {
    const {
      userSlice: { myPostPageNum },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/userid/${userId}`, {
      headers: {
        Authorization: `Bearer ${AccessToken}}`,
      },
      params: {
        size: 8,
        page: myPostPageNum - 1,
      },
    });
    thunkAPI.dispatch(getmyPostTotalPages(res.data.totalPages));
    return res.data.content;
  },
);

export const loadLikedPosts = createAsyncThunk(
  'likedPosts/load',
  async (data: ILoadUserPosts, thunkAPI) => {
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/likepost/${data.userId}`,
      {
        headers: {
          Authorization: `Bearer ${AccessToken}}`,
        },
        params: {
          keyword: data.keyword ? data.keyword : '',
          size: 6,
          page: data.pageNum ? Number(data.pageNum) - 1 : 0,
          category: data.category,
        },
      },
    );
    thunkAPI.dispatch(getlikedPostTotalPages(res.data.totalPages));
    return res.data.content;
  },
);

export const loadMyPosts = createAsyncThunk(
  'myPosts/load',
  async (data: ILoadUserPosts, thunkAPI) => {
    const {
      userSlice: { AccessToken },
    } = thunkAPI.getState() as { userSlice: IUserState };
    const Url =
      data.filter === 'liked'
        ? `${process.env.NEXT_PUBLIC_API_URL}/posts/likepost/${data.userId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/posts/userid/${data.userId}`;
    const res = await axios.get(Url, {
      headers: {
        Authorization: `Bearer ${AccessToken}}`,
      },
      params: {
        keyword: data.keyword ? data.keyword : '',
        size: 6,
        page: data.pageNum ? Number(data.pageNum) - 1 : 0,
        category: data.category,
      },
    });
    thunkAPI.dispatch(getmyPostTotalPages(res.data.totalPages));
    return res.data;
  },
);
