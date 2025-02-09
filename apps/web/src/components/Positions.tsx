import { useSupplyEvents } from "@/hooks/useSupplyEvents";
import { useWithdrawEvents } from "@/hooks/useWithdrawEvents";
import { useMemo } from "react";

const PositionsWidget = ({ walletAddress }: { walletAddress: string }) => {
  const { events, isLoading, error } = useSupplyEvents(walletAddress);

  const {
    events: withdrawEvents,
    isLoading: withdrawEventsLoading,
    error: withdrawEventsError,
  } = useWithdrawEvents(walletAddress);

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

  if (withdrawEventsLoading || isLoading) return <div>Loading...</div>;
  // if (withdrawEventsError) return <div>Error loading positions</div>;
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading positions</div>;
  // if (!events || events.length === 0) return <div>No positions found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="w-full min-h-[20px] rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Pool</th>
              <th className="text-left p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50 ">
              <td className="p-2">
                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </td>
              <td className="p-2">{400} USDC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsWidget;
