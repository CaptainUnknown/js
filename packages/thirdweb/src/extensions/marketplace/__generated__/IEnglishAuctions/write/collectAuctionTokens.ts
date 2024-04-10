import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "collectAuctionTokens" function.
 */
export type CollectAuctionTokensParams = WithOverrides<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
}>;

export const FN_SELECTOR = "0x03a54fe0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "collectAuctionTokens" function.
 * @param options - The options for the collectAuctionTokens function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCollectAuctionTokensParams } "thirdweb/extensions/marketplace";
 * const result = encodeCollectAuctionTokensParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCollectAuctionTokensParams(
  options: CollectAuctionTokensParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Calls the "collectAuctionTokens" function on the contract.
 * @param options - The options for the "collectAuctionTokens" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { collectAuctionTokens } from "thirdweb/extensions/marketplace";
 *
 * const transaction = collectAuctionTokens({
 *  contract,
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function collectAuctionTokens(
  options: BaseTransactionOptions<
    | CollectAuctionTokensParams
    | {
        asyncParams: () => Promise<CollectAuctionTokensParams>;
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
