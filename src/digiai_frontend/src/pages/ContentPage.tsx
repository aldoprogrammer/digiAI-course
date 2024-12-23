import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Layout from '@/components/ui/Layout/Layout';
import { useAuthManager } from '@/store/AuthProvider';
import { getContentTierName } from '@/lib/utils';
import { ThumbsUpIcon } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';

import { Content, User } from '../../../declarations/nekotip_backend/nekotip_backend.did';
import YouTube from 'react-youtube';

const ContentPage = () => {
  const { contentId } = useParams();
  const { actor } = useAuthManager();
  const { getUserById } = useUser();

  const [content, setContent] = useState<Content>();
  const [creator, setCreator] = useState<User | undefined>(undefined);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [errorFetching, setErrorFetching] = useState(false);

  const toggleLike = async (contentId: string) => {
    try {
      setLoadingLike(true);
      if (actor) {
        const result = await actor.toggleLike(contentId);
        if ('ok' in result) {
          setLikesCount(result.ok.likes.length);
        }
      }
    } catch (error) {
      console.error('Error liking content:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!contentId) {
        console.error('Content ID is missing');
        return;
      }

      try {
        const result = await actor?.getContentDetails(contentId);
        if (result && !content) {
          if ('ok' in result) {
            setContent(result.ok);
            setLikesCount(result.ok.likes.length);
          } else if ('err' in result) {
            setErrorFetching(true);
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContentDetails();

    if (content && !creator) {
      getUserById(content.creatorId.toText()).then((result) => {
        if (result) setCreator(result);
      });
    }
  }, [actor, content, contentId, creator, getUserById]);

  // Extract the video ID from youtubeLink
  const getYouTubeVideoId = (url: string | undefined) => {
    if (!url) return null;

    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+[\?&]v=|\S+\/v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(content?.thumbnail);


  if (content && creator) {
    return (
      <Layout title={content.title}>
        <div className="space-y-5">
          <div className="flex w-full flex-col items-center space-y-3">
            <h1 className="text-center text-xl font-semibold capitalize text-title md:text-3xl">
              {content.title}
            </h1>
            <div className="rounded-lg border px-5 py-2 text-sm font-medium text-subtext shadow-hover md:text-base md:font-semibold">
              {getContentTierName(content.tier)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link
              to={`/courses/${creator.username}`}
              className="flex items-center gap-x-3"
            >
              <img
                src={creator.profilePic[0] || 'https://cdn.discordapp.com/attachments/1314806383195197475/1319310119862931586/1.png?ex=6766278c&is=6764d60c&hm=860bb12a6262cd6f76f7b2e9d358a0f309e8eece8d5468bd40a5a03d18570087&'}
                alt={creator.username}
                className="size-14 rounded-full md:size-20"
              />
              <div className="font-medium text-subtext">
                <p className="text-xl">{creator.name}</p>
                <p className="text-caption">@{creator.username}</p>
              </div>
            </Link>
            <Button
              shadow={false}
              icon={<ThumbsUpIcon className="mr-2 size-4 md:size-5" />}
              onClick={() => toggleLike(content.id)}
              disabled={loadingLike}
            >
              {likesCount} Like
            </Button>
          </div>
          {/* Display YouTube Link with iframe */}
          {/* {content.thumbnail && (
            <div className="mt-6">
              <div className="mt-3">
                <iframe
                  width="100%"
                  height="400"
                  src={`${content.thumbnail}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )} */}

          {/* If youtubeLink exists, render the YouTube component */}
          {videoId && (
            <div className="mt-4">
              <YouTube videoId={videoId} opts={{ width: '100%', height: '400px' }} />
            </div>
          )}

          <p className="font-montserrat text-sm font-medium text-subtext md:text-lg">
            {content.description}
          </p>

          {/* <div className="flex flex-wrap gap-4">
            {content.contentImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={content.title}
                className="h-fit w-full max-w-xl"
              />
            ))}
          </div> */}
        </div>
      </Layout>
    );
  }

  if (errorFetching) {
    return (
      <Layout>
        <p className="text-2xl font-semibold text-title">Content not found!</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <p className="text-2xl font-semibold text-title">Loading content...</p>
    </Layout>
  );
};

export default ContentPage;
