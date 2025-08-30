// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TouristIDRegistry {

    struct Tourist {
        string name;
        string homeCountry;
        string emergencyContact;
        uint256 entryTimestamp;
        uint256 exitTimestamp;
        bool isActive;
    }

    mapping(bytes32 => Tourist) public tourists;
    address public owner;

    event TouristRegistered(bytes32 indexed touristId, string name);

    constructor() {
        owner = msg.sender;
    }

    function registerTourist(
        bytes32 touristId,
        string memory _name,
        string memory _homeCountry,
        string memory _emergencyContact,
        uint256 _durationInDays
    ) public {
        require(!tourists[touristId].isActive, "Tourist already registered and active.");
        
        tourists[touristId] = Tourist({
            name: _name,
            homeCountry: _homeCountry,
            emergencyContact: _emergencyContact,
            entryTimestamp: block.timestamp,
            exitTimestamp: block.timestamp + (_durationInDays * 1 days),
            isActive: true
        });

        emit TouristRegistered(touristId, _name);
    }
}