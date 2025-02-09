import { useSupplyEvents } from "@/hooks/useSupplyEvents";
import { useWithdrawEvents } from "@/hooks/useWithdrawEvents";
import { useMemo } from "react";

const PositionsWidget = ({ walletAddress }: { walletAddress: string }) => {
  const { events, isLoading, error } = useSupplyEvents(walletAddress);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading positions</div>;
  if (!events || events.length === 0) return <div>No positions found</div>;

  const {
    events: withdrawEvents,
    isLoading: withdrawEventsLoading,
    error: withdrawEventsError,
  } = useWithdrawEvents(walletAddress);

  if (withdrawEventsLoading) return <div>Loading...</div>;
  if (withdrawEventsError) return <div>Error loading positions</div>;

  // Calculate total supply and withdrawals using useMemo
  const totalSupply = useMemo(() => {
    return events.reduce((acc, event) => {
      return acc + (event.amount || 0n);
    }, 0n);
  }, [events]);

  // Calculate total withdrawals
  const totalWithdraw = useMemo(() => {
    return (
      withdrawEvents?.reduce((acc, event) => {
        return acc + (event.amount || 0n);
      }, 0n) || 0n
    );
  }, [withdrawEvents]);

  // Calculate net position
  const netPosition = totalSupply - totalWithdraw;

  return (
    <div className="w-full min-h-[200px] !bg-white rounded-lg shadow p-4">
      <table className="w-full bg-white">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Pool</th>
            <th className="text-left p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 ">
              <td className="p-2">
                0x07eA79F68B2B3df564D0A34F8e19D9B1e339814b
              </td>
              <td className="p-2">{netPosition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsWidget;
