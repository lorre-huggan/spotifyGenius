import React from 'react';
import axios from 'axios';
import {
  GET_ACCESS_TOKEN,
  FEATURED_PLAYLIST_ENDPOINT,
  PLAYLIST_ENDPOINT,
  GENRE_PLAYLIST_ENDPOINT,
} from '../../../lib/spotify';
import HeadTag from '../../../components/Head';
import styles from '../styles.module.scss';
import AlbumHeading from '../../../components/Album/AlbumHeading';
import AlbumArt from '../../../components/Album/AlbumArt';
import PlaylistTracklist from '../../../components/Album/PlaylistTracklist';

const Playlist = ({ soul }) => {
  let tags = [];
  soul.tracks.items.map((track) => {
    return tags.push(track.track.name);
  });
  const head = {
    title: soul.name,
    description: soul.description,
    tags: tags,
  };
  return (
    <>
      <HeadTag
        title={head.title}
        description={head.description}
        tags={head.tags}
      />
      <section className={styles.container}>
        <section className={styles.innerContainer}>
          <AlbumHeading
            artist={soul}
            album={soul}
            name={soul.description}
            title={soul.name}
            href={soul.external_urls.spotify}
            src={soul.images[0].url}
            alt={soul.name}
          />
          <AlbumArt
            href={soul.external_urls.spotify}
            src={soul.images[0].url}
            alt={soul.name}
          />
          <section className={styles.innerContainer}>
            <PlaylistTracklist
              album={playlist}
              copyright={playlist.description}
              type="Playlist"
            />
          </section>
        </section>
      </section>
    </>
  );
};

export default Playlist;

export async function getStaticPaths() {
  let token = await GET_ACCESS_TOKEN();
  let playlists = await axios(GENRE_PLAYLIST_ENDPOINT('soul', 20), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data.playlists.items);

  const paths = playlists.map((playlist) => {
    return { params: { soul: playlist.id } };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let token = await GET_ACCESS_TOKEN();
  let data = await axios(`${PLAYLIST_ENDPOINT}${params.soul}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));

  return {
    props: { soul: data },
  };
}