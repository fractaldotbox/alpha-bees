import React from "react";

const Navbar = () => {
	return (
		<nav className="bg-gray-800 border-b border-yellow-500 px-4 py-3 flex items-center justify-between">
			<div className="text-yellow-300 text-2xl font-bold">
				AlphaBees Trading
			</div>
			<div className="space-x-4">
				<a href="/" className="text-yellow-300 hover:text-yellow-400">
					Dashboard
				</a>
				<a href="/my-bees" className="text-yellow-300 hover:text-yellow-400">
					My Bees
				</a>
			</div>
		</nav>
	);
};

export default Navbar;
