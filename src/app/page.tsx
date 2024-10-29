"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import CandidateAndVoteComponents from "./_components/candidate.component";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="w-full h-screen flex flex-col gap-12 justify-start items-center bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
      <div className="navbar text-base-100 bg-blue-600">
      <div className="flex-1">
        <a className="btn btn-ghost text-white text-xl">VoteAves!</a>
      </div>
      <div className="flex-none text-white">
        <ul className="menu menu-horizontal px-1">
        <li>
          <details className="pr-11">
          <summary>Connect</summary>
          <ul className="bg-blue-600 rounded-t-none p-2">
            {connectors.map((connector) => (
            <li key={connector.uid}>
              <button
              className="btn btn-ghost flex !justify-start w-full"
              onClick={() => connect({ connector })}
              type="button"
              >
              {connector.name}
              </button>
            </li>
            ))}
          </ul>
          </details>
        </li>
        {account.status === "connected" && (
          <li>
          <button onClick={() => disconnect()} type="button">
            Disconnect
          </button>
          </li>
        )}
        </ul>
      </div>
      </div>

      {account.status === "connected" && (
      <CandidateAndVoteComponents address={account.address} />
      )}
      {account.status === "disconnected" && (
      <div className="text-base-300 bg-blue-600 p-2 font-bold text-2xl rounded-lg">
        <p>Connect to vote for your favorite candidate!</p>
      </div>
      )}
    </div>
  );

  // return (
  //   <div className="bg-blue-500">
  //     <div>
  //       <h2>Account</h2>

  //       <div>
  //         status: {account.status}
  //         <br />
  //         addresses: {JSON.stringify(account.addresses)}
  //         <br />
  //         chainId: {account.chainId}
  //       </div>

  //       {account.status === "connected" && (
  //         <button type="button" onClick={() => disconnect()}>
  //           Disconnect
  //         </button>
  //       )}
  //     </div>

  //     <div>
  //       <h2>Connect</h2>
  //       {connectors.map((connector) => (
  //         <button
  //           key={connector.uid}
  //           onClick={() => connect({ connector })}
  //           type="button"
  //         >
  //           {connector.name}
  //         </button>
  //       ))}
  //       <div>{status}</div>
  //       <div>{error?.message}</div>
  //     </div>

  //     <CandidateAndVoteComponents />

  //     {account.status === "connected" && (
  //       <VoteComponent address={account.address} />
  //     )}
  //   </div>
  // );
}

export default App;
