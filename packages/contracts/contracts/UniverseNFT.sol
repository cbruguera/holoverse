// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Phase I stub: USDC fee path and treasury split are fully implemented.
///      ENERGY burn path (90/10 split via EnergyToken.burn()) is intentionally
///      omitted — pending ENERGY token model decision (see docs/OPEN-DECISIONS.md).
///      mintUniverse() accepts energyCost parameter in its signature so the ABI
///      is stable; the actual ENERGY transfer is left as a TODO.
contract UniverseNFT is ERC721, Ownable {
    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event UniverseMinted(uint256 indexed tokenId, address indexed owner, uint256 energyBurned);

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    IERC20 public immutable usdc;
    address public treasury;

    uint256 public energyCost;  // TODO: wire to EnergyToken once model is decided
    uint256 public usdcFee;

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        address usdcAddress,
        address treasuryAddress,
        uint256 initialEnergyCost,
        uint256 initialUsdcFee,
        string memory baseURI,
        address initialOwner
    ) ERC721("Holoverse Universe", "HVUNI") Ownable(initialOwner) {
        require(usdcAddress != address(0), "UniverseNFT: zero usdc");
        require(treasuryAddress != address(0), "UniverseNFT: zero treasury");

        usdc = IERC20(usdcAddress);
        treasury = treasuryAddress;
        energyCost = initialEnergyCost;
        usdcFee = initialUsdcFee;
        _baseTokenURI = baseURI;
    }

    // -------------------------------------------------------------------------
    // Mint
    // -------------------------------------------------------------------------

    /// @notice Mint a universe NFT.
    ///         Caller must have pre-approved this contract to spend `usdcFee` USDC.
    ///         ENERGY burn path is stubbed — will be wired in a follow-up once
    ///         the ENERGY token model is finalised.
    function mintUniverse() external {
        // USDC: full fee to treasury
        require(
            usdc.transferFrom(msg.sender, treasury, usdcFee),
            "UniverseNFT: USDC transfer failed"
        );

        // TODO (ENERGY): require caller approval for energyCost ENERGY tokens
        //   uint256 burnAmount  = (energyCost * 90) / 100;
        //   uint256 treasuryAmt = energyCost - burnAmount;
        //   IEnergyToken(energyToken).burnFrom(msg.sender, burnAmount);
        //   IERC20(energyToken).transferFrom(msg.sender, treasury, treasuryAmt);

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        emit UniverseMinted(tokenId, msg.sender, 0 /* energyBurned — stub */);
    }

    // -------------------------------------------------------------------------
    // Config (owner only)
    // -------------------------------------------------------------------------

    function setEnergyCost(uint256 newCost) external onlyOwner {
        energyCost = newCost;
    }

    function setUsdcFee(uint256 newFee) external onlyOwner {
        usdcFee = newFee;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "UniverseNFT: zero treasury");
        treasury = newTreasury;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
