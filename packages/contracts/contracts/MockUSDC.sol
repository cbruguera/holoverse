// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Mintable USDC stand-in for localhost and Arbitrum Sepolia.
///      On Arbitrum One, use native USDC: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
contract MockUSDC is ERC20, Ownable {
    constructor(address initialOwner) ERC20("USD Coin", "USDC") Ownable(initialOwner) {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
