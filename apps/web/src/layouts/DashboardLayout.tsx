import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import ChatAvatarWidget from "../components/ChatAvatarWidget";
import ChatWidget from "../components/ChatWidget";
import MarketChart from "../components/MarketChart";
import Navbar from "../components/Navbar.js";
import Portfolio from "../components/Portfolio.js";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardLayout = () => {
	const [expandedWidget, setExpandedWidget] = useState(null);

	// Default layout for grid items when not expanded.
	const defaultLayout = [
		{ i: "chatAvatar", x: 0, y: 0, w: 3, h: 12, minW: 3, minH: 6 },
		{ i: "marketChart", x: 3, y: 0, w: 4, h: 10, minW: 3, minH: 6 },
		{ i: "chat", x: 7, y: 0, w: 4.5, h: 18, minW: 6, minH: 8 },
		// { i: "portfolio", x: 10, y: 0, w: 2, h: 8, minW: 4, minH: 6 },
	];

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

	// Widget container with header (includes draggable handle with an expand/collapse button)
	const renderWidget = (id, title, children) => {
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
				<div className="flex-1 overflow-auto">{children}</div>
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
			widgetTitle = "Queen";
		} else if (expandedWidget === "marketChart") {
			widgetContent = <MarketChart />;
			widgetTitle = "Market Chart";
		} else if (expandedWidget === "portfolio") {
			widgetContent = <Portfolio />;
			widgetTitle = "Portfolio";
		}
		return (
			<div className="h-screen bg-gray-900">
				<Navbar />
				<div className="p-4">
					{renderWidget(expandedWidget, widgetTitle, widgetContent)}
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-gray-900">
			<Navbar />
			<div className="p-4">
				<ResponsiveGridLayout
					className="layout"
					layouts={{ lg: defaultLayout }}
					breakpoints={{ lg: 0 }}
					cols={{ lg: 12 }}
					rowHeight={30}
					draggableHandle=".widget-header"
					draggableCancel=".no-drag"
				>
					<div key="chatAvatar" className="p-2">
						{renderWidget("chatAvatar", "Queen", <ChatAvatarWidget />)}
					</div>
					<div key="chat" className="p-2">
						{renderWidget("chat", "Chat", <ChatWidget />)}
					</div>
					<div key="marketChart" className="p-2">
						{renderWidget("marketChart", "Market Chart", <MarketChart />)}
					</div>
					{/* <div key="portfolio" className="p-2">
						{renderWidget("portfolio", "Portfolio", <Portfolio />)}
					</div> */}
				</ResponsiveGridLayout>
			</div>
		</div>
	);
};

export default DashboardLayout;
