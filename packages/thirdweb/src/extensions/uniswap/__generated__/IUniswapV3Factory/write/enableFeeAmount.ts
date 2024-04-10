import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "enableFeeAmount" function.
 */
export type EnableFeeAmountParams = WithOverrides<{
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  tickSpacing: AbiParameterToPrimitiveType<{
    type: "int24";
    name: "tickSpacing";
  }>;
}>;

export const FN_SELECTOR = "0x8a7c195f" as const;
const FN_INPUTS = [
  {
    type: "uint24",
    name: "fee",
  },
  {
    type: "int24",
    name: "tickSpacing",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "enableFeeAmount" function.
 * @param options - The options for the enableFeeAmount function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeEnableFeeAmountParams } "thirdweb/extensions/uniswap";
 * const result = encodeEnableFeeAmountParams({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 * ```
 */
export function encodeEnableFeeAmountParams(options: EnableFeeAmountParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fee, options.tickSpacing]);
}

/**
 * Calls the "enableFeeAmount" function on the contract.
 * @param options - The options for the "enableFeeAmount" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { enableFeeAmount } from "thirdweb/extensions/uniswap";
 *
 * const transaction = enableFeeAmount({
 *  contract,
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function enableFeeAmount(
  options: BaseTransactionOptions<
    | EnableFeeAmountParams
    | {
        asyncParams: () => Promise<EnableFeeAmountParams>;
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
      return [resolvedOptions.fee, resolvedOptions.tickSpacing] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
