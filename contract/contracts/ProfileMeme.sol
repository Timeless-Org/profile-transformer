// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ProfileMeme is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    string private _baseUri;

    constructor(string memory baseUri)
        ERC721("Profile Meme", "PMM")
        Ownable(msg.sender)
    {
        _baseUri = baseUri;
    }

    function safeMint(string memory uri) public {
        uint256 tokenId = _nextTokenId++;

        string memory metaData = string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name": "Profile Meme NFT #',
                            Strings.toString(tokenId),
                            '", "description": "Profile Meme NFT", "image": "',
                            _baseUri,
                            uri,
                            '.png"}'
                        )
                    )
                )
            )
        );

        _setTokenURI(tokenId, metaData);
        _safeMint(msg.sender, tokenId);
    }

    function setBaseUri(string memory baseUri) public onlyOwner {
        _baseUri = baseUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
