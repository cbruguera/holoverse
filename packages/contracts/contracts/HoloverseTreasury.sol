// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title HoloverseTreasury
/// @notice A vault for fees (USDC and $NRG).
/// @dev In Phase I, this is managed by the initial owner. In later phases,
///      this will transition to the "Council of Architects" DAO.
contract HoloverseTreasury is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Withdraws tokens from the treasury.
    /// @param token The address of the token to withdraw.
    /// @param to The recipient of the tokens.
    /// @param amount The amount of tokens to withdraw.
    function withdraw(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "HoloverseTreasury: zero address");
        require(
            IERC20(token).transfer(to, amount),
            "HoloverseTreasury: transfer failed"
        );
    }

    /// @notice Recipient for native ETH if needed (e.g. for secondary market royalties).
    receive() external payable {}
}
