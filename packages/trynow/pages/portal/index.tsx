import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Link from 'next/link';

import { getChains, checkValidChain, formatSortCode, poppins, getChainById, getChainNameById, getChainLabelByName, getTokenNameById, getChainIdByName } from '@/src/utils/index';
import UnblockApi from '@/src/utils/UnblockApi';
import CircleLoader from '@/components/common/CircleLoader';

import styles from './portal.module.css';

export default function Portal({ setBottomElement }: { setBottomElement: Function }) {
  const [selectedTab, setSelectedTab] = useState('in');
  const [loading, setLoading] = useState(true);
  const [unblockBankAccount, setUnblockBankAccount] = useState<any>(null);
  const [remoteBankAccount, setRemoteBankAccount] = useState<any>(null);
  const [offRampAddress, setOffRampAddress] = useState<any>(null);
  const [exchangeRate, setExchangeRate] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userChain, setUserChain] = useState<any>(null)
  const [chainIn, setChainIn] = useState<any>(null)

  const [cookies] = useCookies(['unblockSessionId', 'userId', 'parentDomain', 'chain', 'currency']);
  const router = useRouter();
  

  const getBankAndLedgers = async () => {
    setLoading(true);
    const api = new UnblockApi(cookies?.parentDomain, cookies?.unblockSessionId, cookies?.userId);

    const [userStatus, banks, unblockBanks,  tokenPreferences] = await Promise.all([
      api.getStatus(),
      api.getRemoteBankAccounts(),
      api.getUnblockBankAccounts(),
      api.getTokenPreferences(),
    ]);

    const userCurrency = unblockBanks.data[0].currency;

    const chain = tokenPreferences?.data.find(
      ({ currency }: { currency: string }) =>
        currency.toLowerCase() === userCurrency.toLowerCase(),
    );

    setUserChain(chain)

    const chainId = getChainIdByName(chain?.chain);

    let selectedChain;
    if(chainId) {
      selectedChain = getChainById(chainId)
      setChainIn(selectedChain);
    } else {
      throw new Error("No chain id")
    }
    const offRampAddress = await api.getOffRampAddress(selectedChain?.name || '')

    if (userStatus.status === 401) {
      router.replace('/');
      return;

    }
    if (userStatus.status === 200) {
      setUser(userStatus.data);
    }
    if (offRampAddress.status == 200) {
      setOffRampAddress(offRampAddress.data[0].address);
    }
    if (banks.status === 200 && unblockBanks.status === 200) {
      const mainBank = banks.data.find(
        ({ main_beneficiary }: { main_beneficiary: boolean }) => main_beneficiary,
      );

      if (!mainBank) {
        router.replace('/bank/add');
        return;
      }

      const mainBankCurrency = mainBank?.iban?.length > 10 ? 'EUR' : 'GBP';
      setRemoteBankAccount(mainBank);
      
      const unblockBankUuid = unblockBanks.data[0].uuid

      if (unblockBankUuid) {
        const unblockBank = await api.getUnblockBankAccount(unblockBankUuid);
        setUnblockBankAccount(unblockBank.data);
      }

      const [exchangeRateResult, transactionFees] = await Promise.all([
        api.getExchangeRates('EUR', mainBank.currency || mainBankCurrency),
        api.getTransactionFees(mainBank.currency || mainBankCurrency, 'USDC'),
      ]);

      if (exchangeRateResult.status === 200) {
        setExchangeRate({
          from: 'agEUR',
          to: (mainBank.currency || mainBankCurrency).toUpperCase(),
          exchangeRate: exchangeRateResult.data.exchange_rate,
          fees: transactionFees.data?.total_fee_percentage || NaN,
        });
        
      }
    }

    setLoading(false);
  };

  useEffect(() => {  
      getBankAndLedgers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies?.chain]);

  useEffect(() => {
    // setBottomElement(
    //   <div>
    //     Need help with anything?{' '}
    //     <Link target="_blank" href={'https://www.getunblock.com/policies/policies'}>
    //       Get in touch
    //     </Link>
    //     <br />
    //     Our team is available Mon – Fri, 9h00 — 18h00 CET
    //   </div>,
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  return (
    <div className={styles.container}>
      {loading ? (
        <CircleLoader size={380} />
      ) : (
        <>
          <div className={styles.tabSelectorContainer}>
            <div className={styles.tabButtonsContainer}>
              <div
                onClick={() => setSelectedTab('in')}
                className={[styles.tabSelectorButton, selectedTab === 'in' && styles.selected].join(
                  ' ',
                )}>
                Portal in
              </div>
              <div
                onClick={() => setSelectedTab('out')}
                className={[
                  styles.tabSelectorButton,
                  selectedTab === 'out' && styles.selected,
                ].join(' ')}>
                Portal out
              </div>
            </div>
            <div className={styles.horizontalSeparator}></div>
          </div>
          <div className={styles.tabbedContent}>
            {selectedTab === 'in' ? (
              <div className={styles.tabContainer}>
                <div className={[styles.infoTextContainer, poppins.className].join(' ')}>
                  <div className={styles.boldText}>
                    Send {unblockBankAccount?.currency} from a bank account in your name to this account to get {chainIn?.token}
                  </div>
                  <div>
                    {
                      'Use these account details to transfer funds to your wallet directly from your bank account.'
                    }
                  </div>
                </div>
                <div>
                  {unblockBankAccount?.account_name && (
                    <Info
                      label="Beneficiary account name"
                      content={unblockBankAccount?.account_name}
                    />
                  )}
                  {unblockBankAccount?.currency === 'EUR' ? (
                    <>
                      <Info label="IBAN" content={unblockBankAccount?.iban} />
                      <Info label="SWIFT / BIC" content={unblockBankAccount?.bic} />
                    </>
                  ) : (
                    <>
                      <Info
                        label="Sort code"
                        content={formatSortCode(unblockBankAccount?.sort_code)}
                      />
                      <Info label="Account number" content={unblockBankAccount?.account_number} />
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.tabContainer}>
                <div className={styles.infoTextContainer}>
                  <div className={styles.boldText}>{`Send supported crypto to this 0x wallet to get ${
                    remoteBankAccount?.currency ?? ''
                  }.`}</div>
                  <div>{`Sending funds to the wallet address below sends ${
                    remoteBankAccount?.currency ?? ''
                  } directly to your bank account. Make sure you’re sending funds on the ${
                    chainIn?.label
                  } network.`}</div>
                </div>
                <div>
                  <Info label="Wallet address" content={offRampAddress} />
                  <Info action={null} label="Network" content={getChainLabelByName((userChain?.chain)) ?? ''} />
                  {remoteBankAccount?.currency === 'EUR' ? (
                    <Info
                      action={null}
                      label={`Bank account where  you’ll receive your ${
                        remoteBankAccount?.currency ?? ''
                      }`}
                      content={remoteBankAccount?.iban}
                    />
                  ) : (
                    <>
                      <Info
                        action={null}
                        label={`Bank account where  you’ll receive your ${
                          remoteBankAccount?.currency ?? ''
                        }`}
                        content={remoteBankAccount?.account_number}
                      />
                      <Info
                        action={null}
                        label={`Sort code`}
                        content={formatSortCode(remoteBankAccount?.sort_code)}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.feesContainer}>
              {exchangeRate && (
                <>
                  <div>Fees = {(exchangeRate.fees * 100).toFixed(2)}%</div>
                  <div>
                    {`Current rate ${exchangeRate.exchangeRate.toFixed(5)} ${exchangeRate.to} ≈ 1 ${
                      exchangeRate.from
                    }`}
                  </div>
                </>
              )}
            </div>
            {user?.status === 'KYC_PENDING' && (
              <div className={styles.kycStatusContainer}>
                <div className={styles.kycSymbol}></div>
                <div className={styles.kycStatusText}>
                  <span className={styles.bold}>Verification in progress. </span>
                  {
                    'You’ll be notified once we have reviewed your identity verification. This usually takes 5 minutes.'
                  }
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const Info = ({
  label,
  content,
  action,
}: {
  label: string;
  content: string;
  action?: { label: string; onClick: Function } | null;
}) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const copyToClipboard = () => {
    setOpen(true);
    navigator.clipboard.writeText(content);
    setTimeout(() => setOpen(false), 1000);
  };

  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.bottomInfo}>
        <div className={styles.infoContent}>
          {content?.length > 30 ? `${content.slice(0, 3)}...${content.slice(-20)}` : content}
        </div>
        {action !== null && (
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="copied">
            <div
              className={[styles.copyButton, poppins.className].join(' ')}
              onClick={() => action?.onClick() ?? copyToClipboard()}>
              {action?.label ?? 'copy'}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
