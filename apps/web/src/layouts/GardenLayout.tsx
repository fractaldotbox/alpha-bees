import LogsWidget from "@/components/LogsWidget";
import PositionsWidget from "@/components/Positions";
import Sidebar from "@/components/Sidebar";
import TransactionsWidget from "@/components/Transactions";
import WorkerBeeAvatarWidget from "@/components/WorkerBeeAvatarWidget";
import { Responsive, WidthProvider } from "react-grid-layout";
import ChatAvatarWidget from "../components/ChatAvatarWidget";
import ChatWidget from "../components/ChatWidget";
import Navbar from "../components/Navbar.js";
import Portfolio from "../components/Portfolio";
import { Fund } from "@/components/Fund";
import { useEffect, useState } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

const addresses = [
  // sepolia ETH agent
  "0x4A9b1ECD1297493B4EfF34652710BD1cE52c6526",

  // base-sepolia Aave USDC agent
  "0x94D8C42AFE90C15b7Dd55902f25ed6253fD47F8c",

  // base-sepolia Morpho USDC agent
  "0x6B608C852850234d42e0C87db86C491A972E3E01",
] as `0x${string}`[];

// Add props interface
interface GardenLayoutProps {
  address?: string;
}

// SVG icons for expand and collapse actions.
const ExpandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12H4"
    />
  </svg>
);

const GardenLayout = ({ address }: GardenLayoutProps) => {
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);

  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  // Default layout for grid items when not expanded.
  const defaultLayout = [
    { i: "chatAvatar", x: 0, y: 0, w: 3, h: 8, minW: 3, minH: 6 },
    // { i: "logs", x: 7, y: 0, w: 6, h: 18, minW: 6, minH: 8 },
    { i: "positions", x: 5, y: 0, w: 6, h: 10, minW: 6, minH: 3 },
    { i: "transactions", x: 0, y: 0, w: 5, h: 10, minW: 3, minH: 6 },
    { i: "fund", x: 10, y: 2, w: 5, h: 10, minW: 3, minH: 6 },
    // {i: "portfolio", x: 10, y: 0, w: 2, h: 8, minW: 4, minH: 6 },
  ];

  // hack on flash of unstyled content
  useEffect(() => {
    setIsDataReady(true);
  }, []);

  // Widget container with header (includes draggable handle with an expand/collapse button)
  const renderWidget = (
    id: string,
    title: string,
    children: React.ReactNode,
  ) => {
    return (
      <div className="bg-gray-900 border border-yellow-500 rounded-md shadow-md p-4 flex flex-col h-full">
        <div className="widget-header cursor-move flex justify-between items-center mb-2 border-b border-yellow-500 pb-1 px-2">
          <h2 className="text-xl font-bold text-yellow-300">{title}</h2>
          <button
            onClick={() =>
              setExpandedWidget((prev) => (prev === id ? null : id))
            }
            // Exclude this button from drag events via the no-drag class.
            className="no-drag text-yellow-300 hover:text-yellow-400 focus:outline-none bg-gray-800 px-2 py-1 rounded"
          >
            {expandedWidget === id ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-white">{children}</div>
      </div>
    );
  };

  // If a widget is expanded, show only that widget filling the screen.
  if (expandedWidget) {
    let widgetContent;
    let widgetTitle;
    if (expandedWidget === "chat") {
      widgetContent = <ChatWidget />;
      widgetTitle = "Chat";
    } else if (expandedWidget === "chatAvatar") {
      widgetContent = <ChatAvatarWidget />;
      widgetTitle = "Worker";
    } else if (expandedWidget === "transactions") {
      widgetContent = <TransactionsWidget address={address as `0x${string}`} />;
      widgetTitle = "Transactions";
    } else if (expandedWidget === "positions") {
      widgetTitle = "Positions";
      widgetContent = (
        <PositionsWidget walletAddress={address as `0x${string}`} />
      );
      widgetTitle = "Positions";
    } else if (expandedWidget === "logs") {
      widgetContent = <LogsWidget />;
      widgetTitle = " Logs";
    } else if (expandedWidget === "portfolio") {
      widgetContent = <Portfolio />;
      widgetTitle = "Portfolio";
    }

    // else if (expandedWidget === "fund") {
    //   widgetContent = <Fund recipientAddress={address as `0x${string}`} />;
    //   widgetTitle = "Fund";
    // }
    return (
      <div className="h-screen bg-gray-900">
        <Navbar />
        <div className="p-4">
          {renderWidget(expandedWidget, widgetTitle as string, widgetContent)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-row h-full">
          <div className="w-1/4">
            <Sidebar addresses={addresses} />
          </div>
          <div className="p-4 w-full">
            {isDataReady && (
              <ResponsiveGridLayout
                className="layout "
                layouts={{ lg: defaultLayout }}
                breakpoints={{ lg: 0 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                draggableHandle=".widget-header"
                draggableCancel=".no-drag"
              >
                {/* <div key="marketChart" className="p-2">
								{renderWidget("marketChart", "Market Chart", <MarketChart />)}
							</div> */}
                <div key="chatAvatar" className="p-2">
                  {renderWidget(
                    "chatAvatar",
                    "Worker",
                    <WorkerBeeAvatarWidget />,
                  )}
                </div>
                <div key="positions" className="p-2">
                  {renderWidget(
                    "positions",
                    "Positions",
                    <PositionsWidget
                      walletAddress={address as `0x${string}`}
                    />,
                  )}
                </div>
                <div key="transactions" className="p-2">
                  {renderWidget(
                    "transactions",
                    "Transactions",
                    <TransactionsWidget address={address as `0x${string}`} />,
                  )}
                </div>
                {/* <div key="logs" className="p-2">
                  {renderWidget("logs", "Logs", <LogsWidget />)}
                </div> */}
                {/* <div key="fund" className="p-2">
                  {renderWidget(
                    "fund",
                    "Fund",
                    <Fund recipientAddress={address as `0x${string}`} />,
                  )}
                </div> */}
                {/* Uncomment if needed.
                        <div key="chat" className="p-2">
                            {renderWidget("chat", "Chat", <ChatWidget />)}
                        </div>
                        */}
              </ResponsiveGridLayout>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenLayout;
