// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BossRegistry is Ownable {

    constructor() Ownable(msg.sender) {}

    struct Boss {
        uint32 id;
        string name;
        address creator;
        uint32 votes;
        uint8 bossLevel;
        bool exists;
    }

    mapping(uint32 => Boss) private bosses;

    event CreateBossSuccessful(uint32 indexed id);
    event BossRemoved(uint32 indexed id);

    modifier bossMustExist(uint32 id) {
        require(bosses[id].exists, "Boss: unknown id");
        _;
    }

    function createBoss(uint32 _id, string memory _name) external {
        require(!bosses[_id].exists, "Boss: id already taken");
        require(bytes(_name).length > 0, "Boss: empty name");

        bosses[_id] = Boss({ 
            id: _id, 
            name: _name, 
            creator: msg.sender, 
            votes: 0, 
            bossLevel: 0,
            exists: true
        });

        emit CreateBossSuccessful(_id);
    }

    function removeBoss(uint32 id) external onlyOwner bossMustExist(id) {
        delete bosses[id];
        emit BossRemoved(id);
    }

    function bossInfo(uint32 bossKey) 
        external 
        view 
        bossMustExist(bossKey)
        returns (
            uint32 _id, 
            string memory _name, 
            address _creator, 
            uint32 _votes, 
            uint8 _bossLevel,
            bool _exists
            ) 
    {
        Boss storage b = bosses[bossKey];
        return (b.id, b.name, b.creator, b.votes, b.bossLevel, b.exists);
    }
}