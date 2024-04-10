import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "collectAuctionPayout" function.
 */
export type CollectAuctionPayoutParams = WithOverrides<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
}>;

export const FN_SELECTOR = "0xebf05a62" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "collectAuctionPayout" function.
 * @param options - The options for the collectAuctionPayout function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCollectAuctionPayoutParams } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionPayoutParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionPayoutParams(
  options: CollectAuctionPayoutParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Calls the "collectAuctionPayout" function on the contract.
 * @param options - The options for the "collectAuctionPayout" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { collectAuctionPayout } from "thirdweb/extensions/marketplace";
 *
 * const transaction = collectAuctionPayout({
 *  contract,
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function collectAuctionPayout(
  options: BaseTransactionOptions<
    | CollectAuctionPayoutParams
    | {
        asyncParams: () => Promise<CollectAuctionPayoutParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.auctionId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
