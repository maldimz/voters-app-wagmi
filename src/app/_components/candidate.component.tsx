import { ABI, ADDRESS } from "@/constant";
import React from "react";
import { BaseError } from "viem";
import { useReadContract } from "wagmi";

type Candidate = {
    name: string;
    voteCount: number;
  };
  
const CandidateComponent = () => {
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

  console.log(candidates);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>Error: {(error as BaseError).shortMessage || error.message}</div>
    );
  }

  return (
    <div>
      <h2>Canidates</h2>
      {(candidates as Candidate[]).map((candidate) => (
        <div key={candidate.name}>
          {candidate.name}: {Number(candidate.voteCount)}
        </div>
      ))}
    </div>
  );
};

export default CandidateComponent;
