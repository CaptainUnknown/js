import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setTokenURI" function.
 */
export type SetTokenURIParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
}>;

export const FN_SELECTOR = "0x162094c4" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_tokenId",
  },
  {
    type: "string",
    name: "_uri",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setTokenURI" function.
 * @param options - The options for the setTokenURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetTokenURIParams } "thirdweb/extensions/erc1155";
 * const result = encodeSetTokenURIParams({
 *  tokenId: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetTokenURIParams(options: SetTokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.uri]);
}

/**
 * Calls the "setTokenURI" function on the contract.
 * @param options - The options for the "setTokenURI" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { setTokenURI } from "thirdweb/extensions/erc1155";
 *
 * const transaction = setTokenURI({
 *  contract,
 *  tokenId: ...,
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setTokenURI(
  options: BaseTransactionOptions<
    | SetTokenURIParams
    | {
        asyncParams: () => Promise<SetTokenURIParams>;
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
      return [resolvedOptions.tokenId, resolvedOptions.uri] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
