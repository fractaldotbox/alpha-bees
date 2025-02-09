import { useSupplyEvents } from "@/hooks/useSupplyEvents";

const PositionsWidget = ({ walletAddress }: { walletAddress: string }) => {
  const { events, isLoading, error } = useSupplyEvents(walletAddress);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading positions</div>;
  if (!events || events.length === 0) return <div>No positions found</div>;

  return (
    <div className="w-full min-h-[200px] !bg-white rounded-lg shadow p-4">
      <table className="w-full bg-white">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Event Type</th>
            <th className="text-left p-2">Amount</th>
            {/* <th className="text-left p-2">Timestamp</th>
            <th className="text-left p-2">Transaction</th> */}
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{event.reserve}</td>
              <td className="p-2">{event.amount}</td>
              {/* <td className="p-2">
                {new Date(event.timestamp).toLocaleString()}
              </td> */}
              {/* <td className="p-2">
                <a
                  href={`https://sepolia.basescan.org/tx/${event.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </a>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsWidget;
