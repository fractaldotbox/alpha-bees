import React from "react";
import { getShortHex } from "../lib/hex";

const Sidebar = ({ addresses }: { addresses: `0x${string}`[] }) => {
	return (
		<div className="w-64 h-full bg-gray-800 text-white p-4">
			<h2 className="text-2xl font-bold mb-4">Worker 🐝Bees</h2>
			<nav>
				<ul>
					{addresses.map((address) => {
						return (
							<li key={address} className="mb-2">
								<a href={`/garden/${address}`}> {getShortHex(address)}</a>
							</li>
						);
					})}
					{/* Add other navigation links as needed */}
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
