import { ABI, ADDRESS } from "@/constant";
import { Account, BaseError } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteContract } from "wagmi";
import { useReadContract } from "wagmi";

const VoteComponent = ({ address }: { address: Account["address"] }) => {
  const {
    data: voters,
    error: votersError,
    isPending: votersIsPending,
  } = useReadContract({
    address: ADDRESS,
    abi: ABI,
    functionName: "voters",
    args: [address],
  });

  const {
    data: candidates,
    error: errorCandidates,
    isPending: isPendingCandidates,
  } = useReadContract({
    address: ADDRESS,
    abi: ABI,
    functionName: "getAllCandidates",
    args: [],
  });

  console.log("candidates", candidates);

  if (votersIsPending || isPendingCandidates) {
    return <div>Loading...</div>;
  }

  if (errorCandidates || votersError) {
    return (
      <>
        {errorCandidates && (
          <div>
            Error:{" "}
            {(errorCandidates as BaseError).shortMessage ||
              errorCandidates.message}
          </div>
        )}
        {votersError && (
          <div>
            Error:{" "}
            {(votersError as BaseError).shortMessage || votersError.message}
          </div>
        )}
      </>
    );
  }

  console.log(voters);
  console.log("votersError", votersError);
  console.log("votersIsPending", votersIsPending);

  const { data: hash, isPending, error, writeContract } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const candidateId = formData.get("candidateId") as string;
    writeContract({
      address: ADDRESS,
      abi: ABI,
      functionName: "vote",
      args: [BigInt(candidateId)],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  if (voters)
    return (
      <div>
        <h2>Vote</h2>
        {voters && voters === true && <div>You have already voted.</div>}
      </div>
    );

  return (
    <form onSubmit={submit}>
      <input name="candidateId" placeholder="0" required />
      <button disabled={isPending} type="submit">
        Vote {isPending ? "Confirming..." : "Mint"}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default VoteComponent;
