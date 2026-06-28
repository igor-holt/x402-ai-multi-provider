import { modelID, myProvider } from "@/lib/models";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  UIMessage,
} from "ai";
import { NextRequest } from "next/server";
import {
  settlePayment,
  facilitator,
  verifyPayment,
  PaymentArgs,
} from "thirdweb/x402";
import { arbitrum } from "thirdweb/chains";
import {
  serverClient,
  serverWalletAddress,
} from "../../../lib/thirdweb.server";
import {
  paymentToken,
  MAX_INFERENCE_TOKENS_PER_CALL,
  getPricePerTokenWei,
} from "../../../lib/pricing";

const twFacilitator = facilitator({
  client: serverClient,
  serverWalletAddress,
});

const asset = {
  address: paymentToken.address as `0x${string}`,
};

export async function POST(request: NextRequest) {
  const paymentData = request.headers.get("x-payment");

  const { selectedModelId } = (await request.json()) as {
    selectedModelId: modelID;
  };

  // Get price per token for the selected model
  const pricePerTokenWei = getPricePerTokenWei(selectedModelId);
  
  const maxAmount = pricePerTokenWei * MAX_INFERENCE_TOKENS_PER_CALL;
  const minAmount = pricePerTokenWei * BigInt(MAX_INFERENCE_TOKENS_PER_CALL / 10);

  const paymentArgs: PaymentArgs = {
    facilitator: twFacilitator,
    method: "POST",
    network: arbitrum,
    scheme: "upto",
    // max amount to be approved by the user
    price: {
      amount: maxAmount.toString(),
      asset,
    },
    resourceUrl: request.url,
    paymentData,
  };

  // verify the signed payment data with maximum payment amount before doing any work
  const result = await verifyPayment({
    ...paymentArgs,
    // minimum required, if approval goes below this, a new signature will be requested
    minPrice: {
      amount: minAmount.toString(),
      asset,
    },
  });

  if (result.status !== 200) {
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  }

  const allowanceLeft = BigInt(result.allowance || maxAmount);

  // then, process the chat request and do the inference
  const { messages }: { messages: Array<UIMessage> } = await request.json();

  const stream = streamText({
    system: "You are a helpful assistant.",
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      },
      openai: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      },
    },
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages: convertToModelMessages(messages),
    onFinish: async (event) => {
      const totalTokens = event.totalUsage.totalTokens;

      if (!totalTokens) {
        console.error("Token usage data not available");
        return;
      }

      // Calculate price based on the selected model
      const finalPrice = getPricePerTokenWei(selectedModelId) * BigInt(totalTokens);

      // finally, settle the payment asynchronously after the stream is completed
      try {
        const result = await settlePayment({
          ...paymentArgs,
          // final price to be settled
          price: {
            amount: finalPrice.toString(),
            asset,
          },
        });
        console.log(`Payment result: ${JSON.stringify(result)}`);
      } catch (error) {
        console.error("Payment settlement failed:", error);
      }
    },
  });

  return stream.toUIMessageStreamResponse({
    sendReasoning: true,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        const totalTokens = part.totalUsage.totalTokens;
        return {
          totalTokens: part.totalUsage.totalTokens,
          allowanceLeft: part.totalUsage.totalTokens
            ? (() => {
                const remaining =
                  allowanceLeft -
                  BigInt(part.totalUsage.totalTokens) *
                    getPricePerTokenWei(selectedModelId);
                return (remaining < BigInt(0) ? BigInt(0) : remaining).toString();
              })()
            : allowanceLeft.toString(),
          modelId: selectedModelId,
          pricePerTokenWei: getPricePerTokenWei(selectedModelId).toString(),
        };
      }
      return undefined;
    },
    onError: () => {
      return `An error occurred, please try again!`;
    },
  });
}
