import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "exactInput" function.
 */
export type ExactInputParams = WithOverrides<{
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "bytes"; name: "path" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountIn" },
      { type: "uint256"; name: "amountOutMinimum" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xc04b8d59" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "bytes",
        name: "path",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "uint256",
        name: "deadline",
      },
      {
        type: "uint256",
        name: "amountIn",
      },
      {
        type: "uint256",
        name: "amountOutMinimum",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;

/**
 * Encodes the parameters for the "exactInput" function.
 * @param options - The options for the exactInput function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeExactInputParams } "thirdweb/extensions/uniswap";
 * const result = encodeExactInputParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactInputParams(options: ExactInputParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "exactInput" function on the contract.
 * @param options - The options for the "exactInput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { exactInput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactInput({
 *  contract,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactInput(
  options: BaseTransactionOptions<
    | ExactInputParams
    | {
        asyncParams: () => Promise<ExactInputParams>;
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
      return [resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
