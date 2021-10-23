import React from 'react';
import Link from 'next/link';
import { BsFillPlayCircleFill, BsSpotify } from 'react-icons/bs';
import styles from './styles.module.scss';
import AudioPlayer from '../../AudioPlayer';
import { useAppStateValue } from '../../../context/AppProvider';
import { types } from '../../../reducers/appReducer';
import { MsToMinsAndSeconds } from '../../../utils/MsToMins';
import { Howler } from 'howler';

const AlbumTracklist = ({ album, copyright }) => {
  const [{ itemPlaying }, dispatch] = useAppStateValue();

  const renderTracks = () => {
    return album?.tracks.items.map((song, idx) => {
      // Play button dispatch function
      const handlePlay = () => {
        console.log(itemPlaying);
        if (itemPlaying) {
          Howler.stop();
          dispatch({
            type: types.SET_ITEM_PLAYING,
            itemPlaying: null,
          });
          dispatch({
            type: types.SET_PLAYING,
            playing: false,
          });
        } else if (!itemPlaying) {
          dispatch({
            type: types.SET_ITEM_PLAYING,
            itemPlaying: song,
          });
          // dispatch({
          //   type: types.SET_PLAYING,
          //   playing: true,
          // });
        } else {
          return;
        }
      };

      return (
        <section key={song?.id} className={styles.trackContainer}>
          <div className={styles.track}>
            {/* spotify / play button*/}
            {itemPlaying?.id === song.id ? (
              <span
                className={styles.play}
                style={{ color: '#1ed760' }}
                onClick={handlePlay}
              >
                <BsSpotify />
              </span>
            ) : (
              <span className={styles.play} onClick={handlePlay}>
                <BsFillPlayCircleFill />
              </span>
            )}
            {/* song details */}
            <div>
              <span>{song?.name}</span>
              <span className={styles.ms}>
                {MsToMinsAndSeconds(song?.duration_ms)}
              </span>
              <div className={styles.meta}>
                {song?.artists.map((artist) => {
                  return (
                    <Link
                      key={artist?.id}
                      href={artist?.external_urls.spotify}
                      passHref
                    >
                      <a target="_blank">
                        <p key={artist?.id}>{`${artist?.name}${
                          song?.artists.length > 1 ? ',' : ''
                        }`}</p>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {/* audio player */}
          {song?.id === itemPlaying?.id ? (
            <div className={styles.trackPlayer}>
              {song?.preview_url ? (
                <div className={styles.player}>
                  <AudioPlayer src={song.preview_url} />
                </div>
              ) : (
                <div className={styles.player}>
                  <p>No Preview Track Available</p>
                </div>
              )}
              <span className={styles.playerLink}>
                {`Play Full Song On `}
                <Link href={song.external_urls.spotify} passHref>
                  <span>Spotify</span>
                </Link>
              </span>
            </div>
          ) : (
            ''
          )}
        </section>
      );
    });
  };

  return (
    <>
      <h4 className={styles.trackList}>Track List:</h4>
      <>{renderTracks()}</>
      <span className={styles.copyright}>{copyright}</span>
    </>
  );
};

export default AlbumTracklist;
