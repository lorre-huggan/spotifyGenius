import styles from '../styles/styles.module.scss';
import HeadTag from '../components/Head';
import React, { useEffect } from 'react';
import {
  NEW_RELEASES_ENDPOINT,
  GET_ACCESS_TOKEN,
  ARTIST_ENDPOINT,
  FEATURED_PLAYLIST_ENDPOINT,
  RECOMMENDATIONS_ENDPOINT,
  GET_URL_RESPONSE_TOKEN,
  GET_USER_ENDPOINT,
  GET_USER_PLAYLISTS_ENDPOINT,
  GET_USER_TOP_TRACKS,
} from '../lib/spotify';
import axios from 'axios';
import SmallAlbumCard from '../components/Album/SmallAlbumCard';
import FeaturedAlbum from '../components/Album/FeaturedAlbum';
import { useAppStateValue } from '../context/AppProvider';
import { types } from '../reducers/appReducer';
import { motion } from 'framer-motion';

export default function Home({
  newReleases,
  featured,
  playlists,
  featuredArtist1,
  popGenre,
  hipHopGenre,
  featuredArtist2,
  rnbGenre,
}) {
  // Get users data
  const [{ userToken, user, userPlaylists, userTopTracks }, dispatch] =
    useAppStateValue();

  //Get url response token from url

  useEffect(() => {
    const hash = GET_URL_RESPONSE_TOKEN();
    const _token = hash.access_token;
    window.location.hash = '';
    if (_token) {
      dispatch({
        type: types.SET_USER_TOKEN,
        userToken: _token,
      });
      console.log('toke>>>>');
    } else {
      return;
    }
  }, [dispatch]);

  useEffect(() => {
    if (userToken) {
      axios
        .get(GET_USER_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          dispatch({
            type: types.SET_USER,
            user: res.data,
          })
        )

        .catch((err) => console.log(err));
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(GET_USER_PLAYLISTS_ENDPOINT(user.id), {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(
          (res) =>
            dispatch({
              type: types.SET_USER_PLAYLISTS,
              userPlaylists: res.data.items,
            })
          // console.log(res.data.items)
        )
        .catch((err) => console.log(err));
    }
  }, [userToken, user, dispatch]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${GET_USER_TOP_TRACKS}?limit=20&time_range=short_term`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          dispatch({
            type: types.SET_USER_TOP_TRACKS,
            userTopTracks: res.data.items,
          })
        )
        .catch((err) => console.log(err));
    }
  }, [user, userToken, dispatch]);

  //------>
  //set meta tags
  let tags = [];
  newReleases.map((release) => {
    return tags.push(release.name);
  });
  newReleases.map((release) => {
    return tags.push(release.artists[0].name);
  });
  const head = {
    title: 'Chune',
    description: 'The Music Discovery App To Find The Best CHUNES!',
    tags: tags,
  };

  const featuredItem = 0;
  const featuredItem2 = 2;
  const featuredItem3 = 0;
  const featuredItem4 = 1;

  const renderUserTopTracks = () => {
    return userTopTracks.slice(0, 4)?.map((track, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={track?.album.images[1]?.url}
          alt={track?.name}
          key={track?.id}
          title={track?.album.name}
          name={track?.album.artists[0].name}
          href={`/album/${track?.album.id}`}
        />
      );
    });
  };
  const renderUserPlaylists = () => {
    return userPlaylists.slice(0, 4)?.map((playlist, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={playlist?.images[1]?.url}
          alt={playlist?.name}
          key={playlist?.id}
          title={playlist?.name}
          name={playlist?.description ? playlist?.description : playlist?.name}
          href={`/playlist/${playlist?.id}`}
        />
      );
    });
  };
  const renderNewReleases = () => {
    return newReleases?.map((release, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={release?.images[1]?.url}
          alt={release?.name}
          key={release?.id}
          title={release?.name}
          name={release?.artists[0].name}
          href={`/album/${release?.id}`}
        />
      );
    });
  };
  const renderPlaylists = () => {
    return playlists?.map((playlist, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={playlist?.images[0]?.url}
          alt={playlist?.name}
          key={playlist?.id}
          title={playlist?.name}
          name={playlist?.description}
          href={`/playlist/${playlist?.id}`}
        />
      );
    });
  };
  const renderPopGenre = () => {
    return popGenre?.map((pop, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={pop?.album.images[1]?.url}
          alt={pop?.name}
          key={pop?.id}
          title={pop?.album.name}
          name={pop?.album.artists[0].name}
          href={`/album/${pop?.album.id}`}
        />
      );
    });
  };
  const renderHipHopGenre = () => {
    return hipHopGenre?.map((hipHop, idx) => {
      return (
        <SmallAlbumCard
          idx={idx}
          src={hipHop?.album.images[1]?.url}
          alt={hipHop?.name}
          key={hipHop?.id}
          title={hipHop?.album.name}
          name={hipHop?.album.artists[0].name}
          href={`/album/${hipHop?.album.id}`}
        />
      );
    });
  };
  //------->
  //Animation

  const animations = {
    headers: {
      hidden: { opacity: 0, y: 35 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      },
    },
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
          {/* Featured Album */}
          <FeaturedAlbum
            layout
            link={newReleases[featuredItem]?.id}
            image={newReleases[featuredItem].images[0]?.url}
            artist={newReleases[featuredItem]?.artists[0]?.name}
            followers={featured?.followers.total}
            albumType={newReleases[featuredItem]?.album_type}
            title={newReleases[featuredItem]?.name}
            href={newReleases[featuredItem]?.external_urls.spotify}
            newAlbum
          />

          {/* User Top Tracks */}
          {userPlaylists ? (
            <motion.section className={styles.newReleases}>
              <motion.h2
                variants={animations.headers}
                initial="hidden"
                animate="visible"
              >
                Your Recent Top Songs
              </motion.h2>
              <div className={styles.grid}>{renderUserTopTracks()}</div>
            </motion.section>
          ) : (
            ''
          )}
          {/* New Releases */}
          <motion.section className={styles.newReleases}>
            <motion.h2
              variants={animations.headers}
              initial="hidden"
              animate="visible"
            >
              New Releases
            </motion.h2>
            <div className={styles.grid}>{renderNewReleases()}</div>
          </motion.section>
          {/* Featured Album */}

          <FeaturedAlbum
            link={newReleases[featuredItem4]?.id}
            image={newReleases[featuredItem4]?.images[0]?.url}
            artist={newReleases[featuredItem4]?.artists[0].name}
            followers={featuredArtist1?.followers.total}
            albumType={newReleases[featuredItem4]?.album_type}
            title={newReleases[featuredItem4]?.name}
            href={newReleases[featuredItem4]?.external_urls.spotify}
            newAlbum
          />
          {/* User Playlists */}
          {userPlaylists ? (
            <section className={styles.newReleases}>
              <motion.h2
                variants={animations.headers}
                initial="hidden"
                animate="visible"
              >
                Your Top Playlists
              </motion.h2>
              <div className={styles.grid}>{renderUserPlaylists()}</div>
            </section>
          ) : (
            ''
          )}

          {/* Featured Playlist */}
          <section className={styles.newReleases}>
            <motion.h2
              variants={animations.headers}
              initial="hidden"
              animate="visible"
            >
              Featured Playlist
            </motion.h2>
            <div className={styles.grid}>{renderPlaylists()}</div>
          </section>
          {/* Featured Album */}
          <FeaturedAlbum
            layout
            link={newReleases[featuredItem2]?.id}
            image={newReleases[featuredItem2].images[0]?.url}
            artist={newReleases[featuredItem2]?.artists[0].name}
            followers={featuredArtist1?.followers.total}
            albumType={newReleases[featuredItem2]?.album_type}
            title={newReleases[featuredItem2]?.name}
            href={newReleases[featuredItem2]?.external_urls.spotify}
            newAlbum
          />
          <section className={styles.newReleases}>
            <h2>Editors Pop Album Picks</h2>
            <div className={styles.grid}>{renderPopGenre()}</div>
          </section>
          <section className={styles.newReleases}>
            <h2>Editors Hip Hop Album Picks</h2>
            <div className={styles.grid}>{renderHipHopGenre()}</div>
          </section>
          {/* Featured Album */}
          <FeaturedAlbum
            link={rnbGenre[featuredItem3]?.album.id}
            image={rnbGenre[featuredItem3]?.album.images[0]?.url}
            artist={rnbGenre[featuredItem3]?.artists[0].name}
            followers={featuredArtist2?.followers.total}
            albumType={rnbGenre[featuredItem3]?.album_type}
            title={rnbGenre[featuredItem3]?.name}
            href={rnbGenre[featuredItem3]?.external_urls.spotify}
          />
        </section>
      </section>
    </>
  );
}
export async function getStaticProps() {
  let token = await GET_ACCESS_TOKEN();
  //------>
  // get top 4 new releases
  let newReleases = await axios(`${NEW_RELEASES_ENDPOINT}?limit=4`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data.albums.items)
    .catch((error) => console.log(error));
  //------>
  //get featured 1 artist
  let featured = await axios(
    `${ARTIST_ENDPOINT}${newReleases[0].artists[0].id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data)
    .catch((error) => console.log(error));
  //------>
  //get featured 2 artist
  let featuredArtist1 = await axios(
    `${ARTIST_ENDPOINT}${newReleases[2].artists[0].id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data)
    .catch((error) => console.log(error));
  //------>
  //get featured playlist
  let playlists = await axios(`${FEATURED_PLAYLIST_ENDPOINT}&limit=4`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data.playlists.items)
    .catch((error) => console.log(error));
  //------->
  //get pop category picks
  let popGenre = await axios(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=pop&limit=4`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data.tracks)
    .catch((error) => console.log(error));
  //------->
  //get hip-hop category picks
  let hipHopGenre = await axios(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=hip-hop&limit=4`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data.tracks)
    .catch((error) => console.log(error));
  //------->
  //get r-n-b category picks
  let rnbGenre = await axios(
    `${RECOMMENDATIONS_ENDPOINT}?seed_genres=r-n-b&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data.tracks)
    .catch((error) => console.log(error));
  //------>
  //get featured 3 artist
  let featuredArtist2 = await axios(
    `${ARTIST_ENDPOINT}${rnbGenre[0].artists[0].id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.data)
    .catch((error) => console.log(error));

  return {
    props: {
      newReleases,
      featured,
      playlists,
      featuredArtist1,
      featuredArtist2,
      popGenre,
      hipHopGenre,
      rnbGenre,
    },
    revalidate: 900,
  };
}
