import React, { useEffect, useState } from 'react';

import useUser from '@/hooks/useUser';
import { convertToICP } from '@/lib/utils';

import {
  Transaction,
  User,
} from '../../../../../declarations/nekotip_backend/nekotip_backend.did';

interface SupportGivenCardProps {
  supportGiven: Transaction;
}

const SupportGivenCard = ({ supportGiven }: SupportGivenCardProps) => {
  const { getUserById } = useUser();
  const [receiverProfile, setReceiverProfile] = useState<User>();

  useEffect(() => {
    if (!receiverProfile) {
      getUserById(supportGiven.to.toText()).then((result) => {
        if (result) setReceiverProfile(result);
      });
    }
  }, [getUserById, receiverProfile, supportGiven.to]);

  if (!receiverProfile) return null;

  return (
    <div className="break-all rounded-md border p-3 font-medium text-subtext">
      <div className="flex gap-3">
        <img
          src={receiverProfile.profilePic[0] ?? 'https://cdn.discordapp.com/attachments/1314806383195197475/1319310119862931586/1.png?ex=6766278c&is=6764d60c&hm=860bb12a6262cd6f76f7b2e9d358a0f309e8eece8d5468bd40a5a03d18570087&'}
          alt="receiver profile picture"
          className="size-12 rounded-full border"
        />
        <div className="w-full text-nowrap">
          <p className="text-lg">{receiverProfile.name}</p>
          <p className="text-sm text-caption">@{receiverProfile.username}</p>
        </div>
        <div className="flex w-full flex-col items-start text-nowrap">
          <p>you sent</p>
          <div className="flex items-center gap-1">
            <p>{convertToICP(parseInt(supportGiven.amount.toString()))} ICP</p>
            <img src="/images/icp.svg" alt="ICP Logo" className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="mt-2 w-full">{supportGiven.supportComment}</div>
    </div>
  );
};

export default SupportGivenCard;
