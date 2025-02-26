// index.tsx (widget root component)
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import UnblockApi from '@/src/utils/UnblockApi';
import CircleLoader from '@/components/common/CircleLoader';
import { checkUserNextStep } from '@/src/utils/index';

export default function Home() {
  const [cookies, setCookie] = useCookies(['unblockSessionId', 'userId', 'walletAddress', 'parentDomain', 'chain', 'token']);
  const router = useRouter();
  

  const getUserStatus = async () => {
    const api = new UnblockApi(cookies?.parentDomain, cookies?.unblockSessionId, cookies?.userId);

    const [status, banks, transactions] = await Promise.all([
      api.getStatus(),
      api.getRemoteBankAccounts(),
      api.getTransactions(),
    ]);

    checkUserNextStep(router, status, banks, transactions);
  };

  useEffect(() => {
    if (!cookies?.unblockSessionId || !cookies.userId) {
      router.replace('/intro');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const theme = router.query.theme || 'default';
    const referralCode = router.query.referralCode;
    const walletAddress = router.query.walletAddress;
    const token = router.query.token;
    const chain = router.query.chain;

    if (referralCode) {
      sessionStorage.setItem('referral_code', String(referralCode));
    }
    const date = new Date(new Date().valueOf() + 4 * 60 * 60 * 1000);

    if (walletAddress) {
      setCookie('walletAddress', walletAddress, {
        path: '/',
        expires: date,
        sameSite: 'none',
        secure: true,
      });
    }

    if (chain) {
      setCookie('chain', chain, {
        path: '/',
        expires: date,
        sameSite: 'none',
        secure: true,
      });
    }

    if (chain && token) {
      setCookie('token', token, {
        path: '/',
        expires: date,
        sameSite: 'none',
        secure: true,
      });
    }

  }, [router.query]);

  useEffect(()=> {
    if (
      cookies?.unblockSessionId &&
      cookies?.userId
    ) {
      getUserStatus();
    }
  })

       
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        height: '100%'
      }}
    >
      <CircleLoader size={260} />
    </div>
  );
}
