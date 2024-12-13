import React, { useEffect, useState } from 'react';

import { CopyIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import LayoutDashboard from '@/components/ui/Layout/LayoutDashboard';
import ModalCustom from '@/components/ui/Modal/ModalCustom';
import useUser from '@/hooks/useUser';
import { convertToE8s, convertToICP } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

const WalletPage = () => {
  const { actor } = useAuthManager();
  const { getICPBalance, getCreditBalance, user } = useUser();

  const [icpBalance, setIcpBalance] = useState('0');
  const [creditBalance, setCreditBalance] = useState('0');
  const [amount, setAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getICPBalance().then((result) => {
      setIcpBalance(convertToICP(parseInt(result.toString())).toString());
    });
  }, [getICPBalance]);

  useEffect(() => {
    getCreditBalance().then((result) => {
      setCreditBalance(convertToICP(parseInt(result.toString())).toString());
    });
  }, [getCreditBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleWithdrawal = async () => {
    if (!actor) return;
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    try {
      setIsLoading(true);
      const amountInE8s = BigInt(convertToE8s(amount));

      const result = await actor.withdraw(amountInE8s);

      if ('ok' in result) {
        getICPBalance().then((result) => {
          setIcpBalance(convertToICP(parseInt(result.toString())).toString());
        });
        getCreditBalance().then((result) => {
          setCreditBalance(
            convertToICP(parseInt(result.toString())).toString(),
          );
        });
        alert('Withdrawal successful');
        setOpenModal(false);
      } else if ('err' in result) {
        alert(`Withdrawal failed: ${result.err}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (user?.depositAddress) {
      navigator.clipboard.writeText(user.depositAddress).then(() => {
        console.log('Copied to clipboard');
      });
    }
  };

  const selectPercentage = (percentage: number) => {
    switch (percentage) {
      case 25:
        setAmount((25 / 100) * parseFloat(creditBalance));
        break;
      case 50:
        setAmount((50 / 100) * parseFloat(creditBalance));
        break;
      case 100:
        setAmount(parseFloat(creditBalance));
    }
  };

  return (
    <LayoutDashboard title="My Wallet" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Wallet Management
      </h1>
      <div className="mt-5 space-y-6 text-subtext">
        <div className="rounded-lg border p-6 shadow-lg bg-white">
          <h2 className="text-xl font-semibold text-title">ICP Wallet</h2>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-8">
            <div>
              <p className="font-medium">Balance</p>
              <p className="text-lg font-medium md:text-xl">
                {icpBalance} ICP
              </p>
            </div>

            <div>
              <p className="font-medium">Deposit Address</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="w-full truncate rounded-sm bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 md:w-[500px] md:text-base">
                  {user?.depositAddress}
                </p>
                <CopyIcon
                  onClick={copyToClipboard}
                  className="cursor-pointer text-gray-600 hover:text-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[345px] rounded-lg border p-6 shadow-lg bg-white">
          <h2 className="text-xl font-semibold text-title">Credit Balance</h2>
          <p className="my-3 text-lg font-medium md:text-xl">
            {creditBalance} ICP
          </p>
          <Button
            variant="secondary"
            shadow={false}
            disabled={creditBalance <= '0'}
            onClick={() => setOpenModal(true)}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <ModalCustom
        title="Withdraw Funds"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-[700px]"
        disableClose={isLoading}
      >
        <div className="px-6 py-4 text-subtext">
          <h2 className="text-xl font-semibold text-title">
            Available Balance
          </h2>
          <p className="text-lg font-medium md:text-xl">{creditBalance} ICP</p>
          <div className="mt-4 flex items-center gap-4">
            <CustomInput
              value={amount}
              onChange={handleAmountChange}
              type="number"
              min="0.01"
              step="0.01"
              label="Amount"
              labelClassName="text-start"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <Button
              className="w-full bg-gray-200"
              size="small"
              shadow={false}
              onClick={() => selectPercentage(25)}
            >
              25%
            </Button>
            <Button
              className="w-full bg-gray-200"
              size="small"
              shadow={false}
              onClick={() => selectPercentage(50)}
            >
              50%
            </Button>
            <Button
              className="w-full bg-gray-200"
              size="small"
              shadow={false}
              onClick={() => selectPercentage(100)}
            >
              100%
            </Button>
          </div>
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              className="mb-3 mt-5"
              disabled={isLoading}
              onClick={handleWithdrawal}
            >
              {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
            </Button>
          </div>
        </div>
      </ModalCustom>
    </LayoutDashboard>
  );
};

export default WalletPage;
