import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import { Redirect } from '@docusaurus/router';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return <Redirect to="/docs/REE/first-exchange" />;
}
