import classNames from 'classnames';
import React from 'react';

import { useFetch } from '../../../hooks/use_fetch';
import { fetchBinary } from '../../../utils/fetchers';
import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  const { data, isLoading } = useFetch(src, fetchBinary);

  /** @type {React.RefObject<import('gifler').Animator>} */
  const movieRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = React.useState(true);
  const handleClick = React.useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        movieRef.current?.pause();
      } else {
        movieRef.current?.play();
      }
      return !isPlaying;
    });
  }, []);

  const handleLoad = React.useCallback(() => {
    if (isPlaying && movieRef.current?.paused) {
      movieRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [src]);

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" type="button" onClick={handleClick}>
        <video src={src} className="w-full" autoPlay loop ref={movieRef} onLoadedData={handleLoad} />
        <div
          className={classNames(
            'left-1/2 top-1/2 absolute flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? 'pause' : 'play'} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
