import React, { useEffect, useState } from 'react';
import { ChevronDown, PlusIcon, SaveIcon } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import CustomDropdown from '@/components/ui/Dropdown/CustomDropdown';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import { CATEGORIES } from '@/constant/common';
import useUser from '@/hooks/useUser';
import { useAuthManager } from '@/store/AuthProvider';
import { ContentPreview as ContentPreviewType, Socials } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';
import ChangeBannerProfile from './ChangeBannerProfile';
import ChangeProfilePic from './ChangeProfilePic';
import ExclusiveContentPreview from '../ViewedProfile/ExclusiveContentPreview';
import { fetchAllContentPreview, fetchCreatorContentPreview } from '@/lib/services/contentService';
import { formatNSToDate, getContentTierLabel, getContentTierName } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import ContentPreview from '../ContentManagement/ContentPreview';
import MyReferrals from '@/pages/user/courses/MyReferralsPage'; // Import MyReferrals

const SOCIAL_PLATFORMS: Array<keyof Socials> = [
  'twitter',
  'instagram',
  'tiktok',
  'youtube',
  'twitch',
  'facebook',
  'discord',
  'website',
];

const EditProfile = () => {
  const { user, updateUser } = useUser();
  const { actor, principal } = useAuthManager();

  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [category, setCategory] = useState<string[]>(user?.categories ?? []);
  const [socials, setSocials] = useState<Socials>({
    twitter: user?.socials?.twitter ?? [],
    instagram: user?.socials?.instagram ?? [],
    tiktok: user?.socials?.tiktok ?? [],
    youtube: user?.socials?.youtube ?? [],
    twitch: user?.socials?.twitch ?? [],
    facebook: user?.socials?.facebook ?? [],
    discord: user?.socials?.discord ?? [],
    website: user?.socials?.website ?? [],
  });
  const [loading, setLoading] = useState(false);

  const categoriesOptions = CATEGORIES.map((category) => ({
    label: category,
  }));

  const handleSocialChange = (platform: keyof Socials, value: string[]) => {
    setSocials((prev) => ({
      ...prev,
      [platform]: value || null,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const categories: [] | [string[]] = category.length > 0 ? [category] : [];

      if (actor) {
        const result = await actor.updateUserProfile({
          bio: bio ? [bio] : [],
          categories: categories,
          username: username ? [username] : [],
          name: name ? [name] : [],
          socials: [socials],
          bannerPic: [],
          profilePic: [],
        });

        if ('ok' in result) {
          updateUser(result.ok);
        } else {
          console.error('Error updating profile', result.err);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const [contents, setContents] = useState([] as ContentPreviewType[]);

  useEffect(() => {
    if (actor && principal)
      fetchCreatorContentPreview(actor, principal, setContents);
  }, [actor, principal]);

  const navigate = useNavigate();

  // State for showing the referral section
  const [showReferrals, setShowReferrals] = useState(false);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-8 xl:flex-row">
      {/* Left side: Content Preview and Create New Course */}
      <div className="flex flex-col gap-6 xl:w-3/5">
        <div
          className={cn(
            'mt-4 w-full rounded-xl border border-gray-200 p-4 shadow-lg md:px-6 md:py-6',
            contents.length === 0 &&
            'flex min-h-[250px] max-w-[700px] items-center justify-center md:min-h-[350px]',
          )}
        >
          {contents.length === 0 ? (
            <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
              <p className="text-center font-semibold md:text-lg">
                You have not created any course yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {contents.map((content) => (
                <Link key={content.id} to={`/courses/content/${content.id}`}>
                  <ContentPreview
                    title={content.title}
                    description={content.description}
                    tier={getContentTierLabel(content.tier)}
                    thumbnail={content.thumbnail}
                    likesCount={content.likesCount.toString()}
                    commentsCount={content.commentsCount.toString()}
                    createdAt={formatNSToDate(content.createdAt)}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
        <Button
          className="w-fit"
          shadow={false}
          variant="secondary"
          icon={<PlusIcon className="mr-1 size-5" />}
          onClick={() => navigate('/dashboard/courses-studio/post')}
        >
          Create New Course
        </Button>
      </div>

      {/* Right side: Profile Pictures, Bio, and Referrals */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md xl:w-2/5">
        {/* Profile Pictures */}
        <ChangeProfilePic />

        {/* Name and Username */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <CustomInput
            containerClassName="w-full"
            label="Name"
            value={name ?? ''}
            placeholder="Enter your full name"
            onChange={(e) => setName(e.target.value)}
            inputClassName="rounded-md border-gray-300 text-sm shadow-sm"
          />
          <CustomInput
            containerClassName="w-full"
            label="Username"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            prefix="@"
            inputClassName="rounded-md border-gray-300 text-sm shadow-sm"
          />
        </div>

        {/* Bio */}
        <div className="mt-4">
          <CustomTextarea
            textareaClassName="rounded-md border-gray-300 text-sm shadow-sm"
            label="Bio"
            value={bio ?? ''}
            placeholder="Tell us something about yourself"
            onChange={handleBioChange}
            maxLength={100}
          />
        </div>

        {/* Toggle Referrals Section */}
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setShowReferrals((prev) => !prev)}
          >
            {showReferrals ? 'Hide Referrals' : 'Show My Referrals'}
          </Button>
        </div>

        {/* Conditionally render MyReferrals */}
        {showReferrals && <MyReferrals />}
      </div>
    </div>
  );
};

export default EditProfile;
