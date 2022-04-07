import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import AppLayout from '@components/AppLayout/AppLayout';
import Postzone from '@components/main/Postzone';
import Category from '@components/main/Category';
import BannerItem from '@components/main/BannerItem';
import Pagination from '@components/main/Pagination';
import WriteModal from '@components/writeModal/WriteModal';
import DetailModal from '@components/detailModal/DetailModal';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@store/hook';
import Router from 'next/router';
import { loadPosts, searchPosts } from '@actions/post';
import wrapper from '@store/configureStore';
import axios from 'axios';
import { loadMyInfo } from '@actions/user';
import cookies from 'next-cookies';
import { saveAccessToken } from '@slices/userSlice';
import { getSearchKeyword, ToggleWriteModalState } from '@slices/postSlice';
const Home: NextPage = () => {
  const [detailModalState, setDetailModalState] = useState(false);
  const me = useAppSelector((state) => state.userSlice.me);
  const dispatch = useAppDispatch();
  const updateModalState = useAppSelector((state) => state.postSlice.updateModalState);
  const mainPosts = useAppSelector((state) => state.postSlice.mainPosts);
  const openModal = () => {
    me ? dispatch(ToggleWriteModalState(true)) : Router.push('/login');
  };

  return (
    <>
      <Head>
        <title>MetaverseStation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {updateModalState && <WriteModal />}
      {detailModalState && <DetailModal setDetailModalState={setDetailModalState} />}

      <AppLayout>
        <>
          <BannerItem />
          <Category />
          <Postzone setDetailModalState={setDetailModalState} mainPosts={mainPosts} />
          <BottomWrapper>
            <Pagination />
            <StyledButton onClick={openModal}>글쓰기</StyledButton>
          </BottomWrapper>
        </>
      </AppLayout>
    </>
  );
};

export default Home;

const BottomWrapper = styled.div`
  position: relative;
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 10px;
  top: 45px;
`;

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  const token = cookies(ctx).Token;
  token
    ? (axios.defaults.headers.common['Authorization'] = `Bearer ${token}`)
    : (axios.defaults.headers.common['Authorization'] = '');
  if (token) {
    store.dispatch(saveAccessToken(token));
  }
  await store.dispatch(loadMyInfo());

  await store.dispatch(getSearchKeyword(ctx.params?.id as string));
  await store.dispatch(searchPosts());

  return { props: {} };
});
