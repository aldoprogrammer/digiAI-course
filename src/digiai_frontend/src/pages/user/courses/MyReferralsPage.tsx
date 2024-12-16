import React, { useState } from 'react';
import { CopyIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import useUser from '@/hooks/useUser';

const MyReferrals = () => {
  const { user } = useUser();
  
  const handleCopy = () => {
    const referralLink = `${window.location.origin}/courses/${user?.username}?referral=${user?.referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Referral link copied to clipboard!');
    });
  };

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mt-3 flex flex-col gap-2 rounded-md bg-mainAccent p-4 md:mt-5 md:flex-row md:gap-4">
        <div className="space-y-2">
          <div className="w-full rounded-lg border p-3 pr-4 font-medium">
            {`${window.location.origin}/courses/${user?.username}?referral=${user?.referralCode}`}
          </div>
        </div>
      </div>
      <Button
            variant="third"
            shadow={false}
            icon={<CopyIcon className="mr-2 size-5" />}
            className="ml-auto mt-4"
            onClick={handleCopy}
          >
            Copy Link
          </Button>
    </div>
  );
};

export default MyReferrals;
