import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "cancelAuction" function.
 */
export type CancelAuctionParams = WithOverrides<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
}>;

export const FN_SELECTOR = "0x96b5a755" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "cancelAuction" function.
 * @param options - The options for the cancelAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCancelAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelAuctionParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeCancelAuctionParams(options: CancelAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Calls the "cancelAuction" function on the contract.
 * @param options - The options for the "cancelAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { cancelAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelAuction({
 *  contract,
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelAuction(
  options: BaseTransactionOptions<
    | CancelAuctionParams
    | {
        asyncParams: () => Promise<CancelAuctionParams>;
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
