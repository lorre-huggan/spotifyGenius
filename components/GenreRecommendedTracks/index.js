import React from 'react';
import styles from './styles.module.scss';
import SmallCard from '../SmallCard';

const GenreRecommendedTracks = ({ tracks }) => {
  return (
    <div className={styles.container}>
      <SmallCard tracks={tracks} />
    </div>
  );
};

export default GenreRecommendedTracks;