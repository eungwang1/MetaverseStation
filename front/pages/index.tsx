import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import AppLayout from '@components/AppLayout';
import Postzone from '@components/main/Postzone';
import Category from '@components/main/Category';
import BannerItem from '@components/main/BannerItem';
import Pagination from '@components/main/Pagination';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout>
        <>
          <BannerItem />
          <Category />
          <Postzone />
          <Pagination />
        </>
      </AppLayout>
    </div>
  );
};

export default Home;
