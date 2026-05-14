# Holoverse (web3 game)

## Features

* New "Universes" are minted as NFTs
* Generative art algorithm translates each universe state into a unique beautiful art representation
* Creating / minting a universe requires ENERGY tokens that are burned in the process
	* [question] should there be other costs to minting a universe? How does the game DAO earn revenue?
* Owning a universe grants you access to a unique game experience within that particular universe
* Each universe evolves naturally through different stages:
	1. Cosmic
	2. Biological
	3. Social / Technological
	4. Transcendent [requires definition]

[idea] Certain acctions in the game also require and burn ENERGY, especially to accelerate its evolution or in order to create new things (form new planets, drive the evolution in certain direction, bring things from other universes)

* Playing the game generates ENERGY to a rate that dynamically adapts to the overall burn rate (i.e. how much ENERGY is being spent). The adaptation function tries to approximate the difference to zero. ENERGY is an ERC-20 token available in the open market. 
* The owner of a universe can arbitrarily invite players to their game for a multi-player experience. They can also make their universe public for anyone to join. In the web app each owner has a dedicated space for social activity about their game (can be public or private)
	* The owner can decide to charge a fee for participating in their game if a universe becomes too popular or profitable.
	* The owner is able to "incarnate" into any NPC in the game. Regular (invited) players select an NPC among all the available species and can only incarnate the one selected until they either die or are banned from the game.

[idea] The platform allows you to choose between sequential simulations of conway-based initial conditions until finding a stable configuration. Users can decide to keep looking for better generations for an additional ENERGY cost.

* Elements from a universe (e.g. a certain species or items can be "tokenized" (i.e. exported as an NFT) that other players can buy and import into their universe.
* During social / technological stage, free commerce and fighting dynamics arise. In this stage, the game works as a "metaverse".

[idea] so far the features of the transcendent stage are not well defined, but one thing is certain: users that achieve transcendent level are able to enter other universes at will and play as "NPCs", with different possibilities both cooperative and competitive.

[idea] architecture should provide enough separation between logic and visual rendering, such that graphics and UI can improve over time, and even 3D or VR views can be developed at some point.

* Each universe should have the possibility of becoming rich enough as a game that it generates revenue to the owner (through in-game economic activity). The entire universe-game can be sold as an NFT at any point
* The space of evolutionary possibilities since the cosmic stage should be big enough that different universes look and can develop differently with time. That makes each universe valuable as a unique gaming experience and as an ownable/sellable asset.
