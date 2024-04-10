import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "mintTo" function.
 */
export type MintToParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "uri" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
}>;

export const FN_SELECTOR = "0xb03f4528" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "string",
    name: "uri",
  },
  {
    type: "uint256",
    name: "amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "mintTo" function.
 * @param options - The options for the mintTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeMintToParams } "thirdweb/extensions/erc1155";
 * const result = encodeMintToParams({
 *  to: ...,
 *  tokenId: ...,
 *  uri: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeMintToParams(options: MintToParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.tokenId,
    options.uri,
    options.amount,
  ]);
}

/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintTo } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintTo({
 *  contract,
 *  to: ...,
 *  tokenId: ...,
 *  uri: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(
  options: BaseTransactionOptions<
    | MintToParams
    | {
        asyncParams: () => Promise<MintToParams>;
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
      return [
        resolvedOptions.to,
        resolvedOptions.tokenId,
        resolvedOptions.uri,
        resolvedOptions.amount,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
