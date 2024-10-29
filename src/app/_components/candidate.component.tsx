import { ABI, ADDRESS } from "@/constant";
import React, { useState, useEffect } from "react";
import { BaseError, Account } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

type Candidate = {
  name: string;
  voteCount: number;
};

const CandidateAndVoteComponents = ({
  address,
}: {
  address: Account["address"];
}) => {
  const [hasVoted, setHasVoted] = useState(false);

  const {
    data: voters,
  } = useReadContract({
    address: ADDRESS,
    abi: ABI,
    functionName: "voters",
    args: [address],
  });

  const {
    data: candidates,
    error,
    isPending,
  } = useReadContract({
    address: ADDRESS,
    abi: ABI,
    functionName: "getAllCandidates",
    args: [],
  });

  const {
    data: hash,
    isPending: isVotePending,
    error: voteError,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed || voters) {
      setHasVoted(true);
    }
  }, [isConfirmed, voters]);

  const handleVote = (candidateId: string) => {
    writeContract({
      address: ADDRESS,
      abi: ABI,
      functionName: "vote",
      args: [BigInt(candidateId)],
    });
  };

  if (isPending) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-red-500">
        Error: {(error as BaseError).shortMessage || error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4 flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 gap-4 w-full p-8">
          {(candidates as Candidate[]).map((candidate, index) => (
            <div
              key={candidate.name}
              className="card bg-base-100 shadow-xl w-full max-w-[500px] rounded-lg mx-auto"
            >
              <figure className="w-full">
                <img
                  src={`https://via.placeholder.com/150?text=${candidate.name}`}
                  alt={candidate.name}
                  className="w-full"
                />
              </figure>
              <div className="card-body flex flex-col justify-center items-center">
                <h2 className="card-title">{candidate.name}</h2>
                <p>Votes: {Number(candidate.voteCount)}</p>
                <div className="card-actions justify-end">
                  {!hasVoted && (
                    <button
                      onClick={() => handleVote(index.toString())}
                      className="btn btn-primary"
                      disabled={isVotePending}
                    >
                      {isVotePending ? "Voting..." : "Vote"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasVoted && (
        <div className="text-center text-2xl font-bold text-white">
          You have already voted. Thank you!
        </div>
      )}

      {hash && <div className="text-center mt-4">Transaction Hash: {hash}</div>}

      {isConfirming && (
        <div className="text-center mt-4">Waiting for confirmation...</div>
      )}

      {isConfirmed && (
        <div className="text-center mt-4 text-2xl font-bold text-white">
          Transaction confirmed.
        </div>
      )}

      {voteError && (
        <div className="text-center mt-4 text-red-500">
          Error: {(voteError as BaseError).shortMessage || voteError.message}
        </div>
      )}
    </div>
  );
};

export default CandidateAndVoteComponents;
