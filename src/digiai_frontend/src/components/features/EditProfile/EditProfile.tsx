import { useState } from 'react';

import { ChevronDown, SaveIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import CustomDropdown from '@/components/ui/Dropdown/CustomDropdown';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import { CATEGORIES } from '@/constant/common';
import useUser from '@/hooks/useUser';
import { useAuthManager } from '@/store/AuthProvider';

import { Socials } from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

import ChangeBannerProfile from './ChangeBannerProfile';
import ChangeProfilePic from './ChangeProfilePic';

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
  const { actor } = useAuthManager();

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

  return (
    <div className="mt-6 flex flex-col gap-8 xl:flex-row">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md xl:w-2/5">
        {/* Profile Pictures */}
        <ChangeProfilePic />
        <ChangeBannerProfile />

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
            onChange={(e) => setBio(e.target.value)}
            maxLength={100}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:w-3/5">
        {/* Category */}
        {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-lg font-semibold text-gray-700">Category</p>
          <CustomDropdown
            triggerContent={
              <div className="mt-2 flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 shadow-sm">
                {category.length > 0 ? (
                  category
                ) : (
                  <span className="text-gray-400">Select a category</span>
                )}
                <ChevronDown />
              </div>
            }
            options={categoriesOptions}
            onItemClick={(item) => setCategory([item.label])}
            className="w-full"
          />
        </div> */}

        {/* Socials */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <p className="text-lg font-semibold text-gray-700">Social Platforms</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <CustomInput
                key={platform}
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                value={socials[platform] ?? ''}
                placeholder={`Enter your ${platform} link`}
                onChange={(e) => handleSocialChange(platform, [e.target.value])}
                inputClassName="rounded-md border-gray-300 text-sm shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Save Changes */}
        <Button
          disabled={loading}
          icon={<SaveIcon />}
          variant="main"
          className="w-full rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700"
          onClick={handleUpdateProfile}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
