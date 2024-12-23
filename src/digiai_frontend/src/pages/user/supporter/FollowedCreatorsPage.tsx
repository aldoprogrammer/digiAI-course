import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import { cn } from '@/lib/utils/cn';
import { useAuthManager } from '@/store/AuthProvider';

import { User } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const FollowedCreatorsPage = () => {
  const { actor, principal } = useAuthManager();

  const [creators, setCreatos] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFollowedCreators = async () => {
      try {
        setIsLoading(true);
        if (!actor || !principal) return;

        const result = await actor.getFollowing();

        if (result && creators.length === 0) {
          setCreatos(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedCreators();
  }, [actor, creators.length, principal]);

  return (
    <LayoutDashboard title="Following" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Following Instructor
      </h1>
      <div
        className={cn(
          'mt-3 min-h-28 w-full rounded-lg border p-5 font-medium text-subtext shadow-custom',
          creators.length === 0 &&
            'flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]',
        )}
      >
        {isLoading ? (
          <span className="text-lg">Loading...</span>
        ) : creators.length === 0 ? (
          <span className="text-lg">You don't have any following yet</span>
        ) : (
          <div className="flex flex-wrap gap-5">
            {creators.map((creator) => (
              <Link key={creator.username} to={`/courses/${creator.username}`}>
                <div
                  key={creator.username}
                  className="flex w-full cursor-pointer gap-2 rounded-md border p-3 px-4 font-medium text-subtext hover:bg-mainAccent/30 md:w-fit"
                >
                  <img
                    src={creator.profilePic[0] ?? 'https://cdn.discordapp.com/attachments/1314806383195197475/1319310119862931586/1.png?ex=6766278c&is=6764d60c&hm=860bb12a6262cd6f76f7b2e9d358a0f309e8eece8d5468bd40a5a03d18570087&'}
                    alt="profilepicture"
                    className="size-12 rounded-full border"
                  />
                  <div className="w-full min-w-[200px]">
                    <p className="text-lg">{creator.name}</p>
                    <p className="text-sm text-caption md:text-base">
                      @{creator.username}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default FollowedCreatorsPage;
