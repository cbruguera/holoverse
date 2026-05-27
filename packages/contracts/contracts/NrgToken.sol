// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title NrgToken ($NRG)
/// @notice The utility token for the Holoverse ecosystem.
/// @dev Implements ERC20 with Burnable and AccessControl for Holoverse-authorized minting.
contract NrgToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address initialMinter) ERC20("NRG", "NRG") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, initialMinter);
    }

    /// @notice Mints new NRG tokens.
    /// @dev Only accounts with MINTER_ROLE (e.g., the Game Engine or Universe) can call this.
    /// @param to The address receiving the tokens.
    /// @param amount The amount of NRG to mint.
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
