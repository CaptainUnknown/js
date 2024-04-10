import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createRuleThreshold" function.
 */
export type CreateRuleThresholdParams = WithOverrides<{
  rule: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "rule";
    components: [
      { type: "address"; name: "token" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "balance" },
      { type: "uint256"; name: "score" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1022a25e" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "rule",
    components: [
      {
        type: "address",
        name: "token",
      },
      {
        type: "uint8",
        name: "tokenType",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "balance",
      },
      {
        type: "uint256",
        name: "score",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
    name: "ruleId",
  },
] as const;

/**
 * Encodes the parameters for the "createRuleThreshold" function.
 * @param options - The options for the createRuleThreshold function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeCreateRuleThresholdParams } "thirdweb/extensions/thirdweb";
 * const result = encodeCreateRuleThresholdParams({
 *  rule: ...,
 * });
 * ```
 */
export function encodeCreateRuleThresholdParams(
  options: CreateRuleThresholdParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.rule]);
}

/**
 * Calls the "createRuleThreshold" function on the contract.
 * @param options - The options for the "createRuleThreshold" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { createRuleThreshold } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = createRuleThreshold({
 *  contract,
 *  rule: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createRuleThreshold(
  options: BaseTransactionOptions<
    | CreateRuleThresholdParams
    | {
        asyncParams: () => Promise<CreateRuleThresholdParams>;
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
      return [resolvedOptions.rule] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
