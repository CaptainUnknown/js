"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useStore } from "@/lib/reactive";
import { getSDKTheme } from "app/components/sdk-component-theme";
import { CustomChainRenderer } from "components/selects/CustomChainRenderer";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { useTrack } from "hooks/analytics/useTrack";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Chain } from "thirdweb";
import {
  AutoConnect,
  ConnectButton,
  type NetworkSelectorProps,
  useConnectModal,
} from "thirdweb/react";
import { useFavoriteChainIds } from "../../../../app/(dashboard)/(chain)/components/client/star-button";
import { LazyConfigureNetworkModal } from "../../../../components/configure-networks/LazyConfigureNetworkModal";
import { useAllChainsData } from "../../../../hooks/chains/allChains";
import {
  type StoredChain,
  addRecentlyUsedChainId,
  recentlyUsedChainIdsStore,
} from "../../../../stores/chainStores";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { popularChains } from "../popularChains";

export const CustomConnectWallet = (props: {
  loginRequired?: boolean;
  connectButtonClassName?: string;
  detailsButtonClassName?: string;
}) => {
  const thirdwebClient = useThirdwebClient();
  const loginRequired =
    props.loginRequired === undefined ? true : props.loginRequired;

  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";

  // chains
  const favChainIdsQuery = useFavoriteChainIds();
  const recentChainIds = useStore(recentlyUsedChainIdsStore);
  const { idToChain, allChains } = useAllChainsData();

  const allChainsWithMetadata = useMemo(
    () => allChains.map(mapV4ChainToV5Chain),
    [allChains],
  );

  const recentlyUsedChainsWithMetadata = useMemo(
    () =>
      recentChainIds
        .map((id) => {
          const c = idToChain.get(id);
          // eslint-disable-next-line no-restricted-syntax
          return c ? mapV4ChainToV5Chain(c) : undefined;
        })
        .filter((x) => !!x),
    [recentChainIds, idToChain],
  );

  const favoriteChainsWithMetadata = useMemo(() => {
    return (favChainIdsQuery.data || [])
      .map((id) => {
        const c = idToChain.get(Number(id));
        // eslint-disable-next-line no-restricted-syntax
        return c ? mapV4ChainToV5Chain(c) : undefined;
      })
      .filter((x) => !!x);
  }, [idToChain, favChainIdsQuery.data]);

  const popularChainsWithMetadata = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    return popularChains.map((x) =>
      // eslint-disable-next-line no-restricted-syntax
      {
        const v4Chain = idToChain.get(x.id);
        // eslint-disable-next-line no-restricted-syntax
        return v4Chain ? mapV4ChainToV5Chain(v4Chain) : x;
      },
    );
  }, [idToChain]);

  // Network Config Modal
  const [isNetworkConfigModalOpen, setIsNetworkConfigModalOpen] =
    useState(false);
  const [editChain, setEditChain] = useState<StoredChain | undefined>(
    undefined,
  );

  const chainSections: NetworkSelectorProps["sections"] = useMemo(() => {
    return [
      {
        label: "Favorites",
        chains: favoriteChainsWithMetadata,
      },
      {
        label: "Recent",
        chains: recentlyUsedChainsWithMetadata,
      },
      {
        label: "Popular",
        chains: popularChainsWithMetadata,
      },
    ];
  }, [
    recentlyUsedChainsWithMetadata,
    favoriteChainsWithMetadata,
    popularChainsWithMetadata,
  ]);

  // ensures login status on pages that need it
  const { isPending, isLoggedIn } = useLoggedInUser();
  const pathname = usePathname();

  if (isPending) {
    return (
      <>
        <div className="w-[144px] h-[48px] bg-muted border border-border rounded-lg flex items-center justify-center">
          <Spinner className="size-4" />
        </div>
        {/* need auto connect here so that we actually connect */}
        <AutoConnect client={thirdwebClient} />
      </>
    );
  }

  if (!isLoggedIn && loginRequired) {
    return (
      <>
        <Button asChild variant="default" className="gap-2" size="lg">
          <Link
            href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          >
            Sign In
          </Link>
        </Button>
        {/* need auto connect here so that we actually connect */}
        <AutoConnect client={thirdwebClient} />
      </>
    );
  }

  return (
    <>
      <ConnectButton
        theme={getSDKTheme(t)}
        client={thirdwebClient}
        connectModal={{
          privacyPolicyUrl: "/privacy",
          termsOfServiceUrl: "/tos",
          showThirdwebBranding: false,
          welcomeScreen: () => <ConnectWalletWelcomeScreen theme={t} />,
        }}
        appMetadata={{
          name: "thirdweb",
          logoUrl: "https://thirdweb.com/favicon.ico",
          url: "https://thirdweb.com",
        }}
        onDisconnect={async () => {
          try {
            // log out the user
            await fetch("/api/auth/logout", {
              method: "POST",
            });
          } catch (err) {
            console.error("Failed to log out", err);
          }
        }}
        connectButton={{
          className: props.connectButtonClassName,
        }}
        detailsButton={{
          className: props.detailsButtonClassName,
        }}
        chains={allChainsWithMetadata}
        detailsModal={{
          networkSelector: {
            sections: chainSections,
            onSwitch(chain) {
              addRecentlyUsedChainId(chain.id);
            },
            renderChain(props) {
              return (
                <CustomChainRenderer
                  {...props}
                  openEditChainModal={(c) => {
                    setIsNetworkConfigModalOpen(true);
                    setEditChain(c);
                  }}
                />
              );
            },
            onCustomClick: () => {
              setEditChain(undefined);
              setIsNetworkConfigModalOpen(true);
            },
          },
        }}
      />

      <LazyConfigureNetworkModal
        open={isNetworkConfigModalOpen}
        onOpenChange={setIsNetworkConfigModalOpen}
        editChain={editChain}
      />
    </>
  );
};

function ConnectWalletWelcomeScreen(props: {
  theme: "light" | "dark";
  subtitle?: string;
}) {
  const fontColor = props.theme === "light" ? "black" : "white";
  const subtitle = props.subtitle ?? "Connect your wallet to get started";

  return (
    <div
      style={{
        backgroundColor: props.theme === "dark" ? "#18132f" : "#c7b5f1",
        backgroundImage: `url("/assets/connect-wallet/welcome-gradient-${props.theme}.png")`,
      }}
      className="flex flex-col p-6 h-full bg-cover bg-center bg-no-repeat"
    >
      <div className="flex flex-grow flex-col justify-center">
        <div>
          <div className="flex justify-center">
            <Image
              className="select-none"
              style={{
                mixBlendMode: props.theme === "dark" ? "soft-light" : "initial",
              }}
              draggable={false}
              width={200}
              height={150}
              alt=""
              src="/assets/connect-wallet/tw-welcome-icon.svg"
              loading="eager"
            />
          </div>

          <div className="h-10" />
          <h2
            className="text-xl text-center font-semibold"
            style={{
              color: fontColor,
            }}
          >
            Welcome to thirdweb
          </h2>

          <div className="h-4" />

          <p
            className="text-center opacity-80 font-semibold"
            style={{
              color: fontColor,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <TrackedAnchorLink
        className="text-center font-semibold opacity-70 hover:opacity-100 hover:no-underline"
        target="_blank"
        category="custom-connect-wallet"
        label="new-to-wallets"
        href="https://blog.thirdweb.com/web3-wallet/"
        style={{
          color: fontColor,
        }}
      >
        New to Wallets?
      </TrackedAnchorLink>
    </div>
  );
}

export function useCustomConnectModal() {
  const { connect } = useConnectModal();
  const { theme } = useTheme();
  const thirdwebClient = useThirdwebClient();

  return useCallback(
    (options?: { chain?: Chain }) => {
      return connect({
        client: thirdwebClient,
        appMetadata: {
          name: "thirdweb",
          logoUrl: "https://thirdweb.com/favicon.ico",
          url: "https://thirdweb.com",
        },
        chain: options?.chain,
        privacyPolicyUrl: "/privacy",
        termsOfServiceUrl: "/tos",
        showThirdwebBranding: false,
        welcomeScreen: () => (
          <ConnectWalletWelcomeScreen
            theme={theme === "light" ? "light" : "dark"}
          />
        ),
        theme: getSDKTheme(theme === "light" ? "light" : "dark"),
      });
    },
    [connect, theme, thirdwebClient],
  );
}

/**
 * A link component extends the `Link` component and adds tracking.
 */
function TrackedAnchorLink(props: {
  category: string;
  label?: string;
  trackingProps?: Record<string, string>;
  href: string;
  target?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const trackEvent = useTrack();
  const { category, label, trackingProps } = props;

  const onClick = useCallback(() => {
    trackEvent({ category, action: "click", label, ...trackingProps });
  }, [trackEvent, category, label, trackingProps]);

  return (
    <Link
      onClick={onClick}
      target={props.target}
      href={props.href}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </Link>
  );
}
