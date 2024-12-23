import React, { useEffect, useState } from 'react';

import { convertToICP, formatNSToDate } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

import {
  Transaction,
  User,
} from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

const SupportMessage = ({ support }: { support: Transaction }) => {
  const { actor } = useAuthManager();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      if (!actor) return;
      try {
        const user = await actor.getUserById(support.from);
        if (user.length > 0) {
          setUser(user[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [actor, support.from]);

  return (
    <div className="flex gap-3">
      <img
        src="https://cdn.discordapp.com/attachments/1314806383195197475/1319310119862931586/1.png?ex=6766278c&is=6764d60c&hm=860bb12a6262cd6f76f7b2e9d358a0f309e8eece8d5468bd40a5a03d18570087&"
        alt="profilepicture"
        className="size-12 rounded-full border"
      />
      <div>
        <div className="flex items-center gap-1">
          <p className="font-semibold">{user?.name}</p>
          <span>has sent</span>
          <span>{convertToICP(parseInt(support.amount.toString()))} ICP</span>
        </div>
        <p>{formatNSToDate(support.timestamp)}</p>
        <p className="mt-2 text-wrap break-all border px-3 py-2 text-sm font-medium shadow-hover md:text-base">
          {support.supportComment}
        </p>
      </div>
    </div>
  );
};

export default SupportMessage;
