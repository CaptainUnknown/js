import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = WithOverrides<{
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
}>;

export const FN_SELECTOR = "0xa22cb465" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "operator",
  },
  {
    type: "bool",
    name: "_approved",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setApprovalForAll" function.
 * @param options - The options for the setApprovalForAll function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetApprovalForAllParams } "thirdweb/extensions/erc721";
 * const result = encodeSetApprovalForAllParams({
 *  operator: ...,
 *  approved: ...,
 * });
 * ```
 */
export function encodeSetApprovalForAllParams(
  options: SetApprovalForAllParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.operator, options.approved]);
}

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { setApprovalForAll } from "thirdweb/extensions/erc721";
 *
 * const transaction = setApprovalForAll({
 *  contract,
 *  operator: ...,
 *  approved: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<
    | SetApprovalForAllParams
    | {
        asyncParams: () => Promise<SetApprovalForAllParams>;
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
      return [resolvedOptions.operator, resolvedOptions.approved] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
