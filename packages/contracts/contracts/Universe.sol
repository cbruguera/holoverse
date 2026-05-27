// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NrgToken.sol";

/// @title Universe
/// @notice Manages the minting and evolution of Holoverse Universes.
contract Universe is ERC721, Ownable {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    enum Stage {
        Cosmic,
        Biological,
        Social,
        Transcendent
    }

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event UniverseMinted(uint256 indexed tokenId, address indexed owner, uint256 nrgBurned);
    event StageAdvanced(uint256 indexed tokenId, Stage newStage);

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    IERC20 public immutable usdc;
    NrgToken public immutable nrgToken;
    address public treasury;

    uint256 public nrgCost;
    uint256 public usdcFee;

    mapping(uint256 => Stage) public universeStage;

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        address usdcAddress,
        address nrgTokenAddress,
        address treasuryAddress,
        uint256 initialNrgCost,
        uint256 initialUsdcFee,
        string memory baseURI,
        address initialOwner
    ) ERC721("Holoverse Universe", "HVUNI") Ownable(initialOwner) {
        require(usdcAddress != address(0), "Universe: zero usdc");
        require(nrgTokenAddress != address(0), "Universe: zero nrgToken");
        require(treasuryAddress != address(0), "Universe: zero treasury");

        usdc = IERC20(usdcAddress);
        nrgToken = NrgToken(nrgTokenAddress);
        treasury = treasuryAddress;
        nrgCost = initialNrgCost;
        usdcFee = initialUsdcFee;
        _baseTokenURI = baseURI;
    }

    // -------------------------------------------------------------------------
    // Mint
    // -------------------------------------------------------------------------

    /// @notice Mint a universe NFT.
    ///         Caller must have pre-approved this contract to spend `usdcFee` USDC
    ///         and `nrgCost` NRG.
    function mintUniverse() external {
        // USDC: full fee to treasury
        require(
            usdc.transferFrom(msg.sender, treasury, usdcFee),
            "Universe: USDC transfer failed"
        );

        // NRG: 90% burned, 10% to treasury
        uint256 burnAmount = (nrgCost * 90) / 100;
        uint256 treasuryAmount = nrgCost - burnAmount;

        nrgToken.burnFrom(msg.sender, burnAmount);
        require(
            nrgToken.transferFrom(msg.sender, treasury, treasuryAmount),
            "Universe: NRG transfer failed"
        );

        uint256 tokenId = _nextTokenId++;
        universeStage[tokenId] = Stage.Cosmic;
        _safeMint(msg.sender, tokenId);

        emit UniverseMinted(tokenId, msg.sender, burnAmount);
    }

    // -------------------------------------------------------------------------
    // Evolution
    // -------------------------------------------------------------------------

    /// @notice Advance a universe to the next stage.
    /// @dev Logic for evolutionary costs and requirements will be added in v0.3.
    /// @param tokenId The ID of the universe to advance.
    function advanceStage(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Universe: not owner");
        Stage current = universeStage[tokenId];
        require(current != Stage.Transcendent, "Universe: already reached Transcendent stage");

        Stage next = Stage(uint256(current) + 1);
        universeStage[tokenId] = next;

        emit StageAdvanced(tokenId, next);
    }

    // -------------------------------------------------------------------------
    // Config (owner only)
    // -------------------------------------------------------------------------

    function setNrgCost(uint256 newCost) external onlyOwner {
        nrgCost = newCost;
    }

    function setUsdcFee(uint256 newFee) external onlyOwner {
        usdcFee = newFee;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Universe: zero treasury");
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
