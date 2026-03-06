// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Auction {
    // Événement émis lors de la création d'une nouvelle enchère
    event ListedAuction(uint indexed auction_id);

    // Compteur d'enchères - rendu public pour accès direct depuis le frontend
    uint public id_counter = 0;

    struct AuctionStruct {
        string prod_title;
        bool is_active;
        bool amount_status;
        uint unique_id;           // = id_counter au moment de la création
        uint time_of_creation;
        uint time_of_deadline;
        uint starting_bid_rate;
        uint winning_bid_amt;
        address auction_owner;
        address current_winner;
    }

    struct Bidder {
        address bid_placer;
        uint bidded_value;
        uint order;
        uint timestamp;
        bool winner;
    }

    // Mapping des enchères → liste des enchérisseurs
    mapping(uint => Bidder[]) public bidders;

    // Tableau de toutes les enchères
    AuctionStruct[] public auctions;

    /**
     * @dev Crée une nouvelle enchère
     * @param title Titre de l'enchère
     * @param days_to_deadline Durée en jours
     * @param starting_bid Montant de départ en wei
     * @return L'identifiant de l'enchère créée (id_counter - 1)
     */
    function list_new_auction(
        string memory title,
        uint days_to_deadline,
        uint starting_bid
    ) public returns (uint256) {
        require(days_to_deadline > 0, "Duration must be > 0 days");
        require(starting_bid > 0, "Starting bid must be > 0");

        uint deadline = block.timestamp + (days_to_deadline * 1 days);

        uint currentId = id_counter;

        auctions.push(
            AuctionStruct(
                title,
                true,                   // is_active
                false,                  // amount_status
                currentId,              // unique_id = id_counter
                block.timestamp,
                deadline,
                starting_bid,
                0,                      // winning_bid_amt initial
                msg.sender,
                address(0)              // current_winner initial
            )
        );

        emit ListedAuction(currentId);

        id_counter++;  // Incrémentation après l'émission et le push

        return currentId;
    }

    /**
     * @dev Permet de récupérer la valeur actuelle de id_counter
     * Utile quand l'événement n'est pas capturé correctement
     */
    function getCurrentIdCounter() public view returns (uint) {
        return id_counter;
    }

    /**
     * @dev Place une enchère sur une vente existante
     */
    function make_bid(
        uint auction_id,
        uint order,
        uint bidded_value
    ) public returns (Bidder[] memory) {
        require(auction_id < auctions.length, "Invalid auction ID");

        AuctionStruct storage auc = auctions[auction_id];

        require(block.timestamp < auc.time_of_deadline, "Auction has ended");
        require(auc.is_active, "Auction is not active");
        require(bidded_value > auc.winning_bid_amt, "Bid must be higher than current winning bid");

        bidders[auction_id].push(
            Bidder(msg.sender, bidded_value, order, block.timestamp, false)
        );

        // Mise à jour du gagnant actuel
        auc.winning_bid_amt = bidded_value;
        auc.current_winner = msg.sender;

        return bidders[auction_id];
    }

    /**
     * @dev Paiement final par le gagnant après la fin de l'enchère
     */
    function make_payment(uint auction_id) public payable returns (bool) {
        AuctionStruct storage auc = auctions[auction_id];
        Bidder[] storage all_bidders = bidders[auction_id];

        require(block.timestamp >= auc.time_of_deadline, "Auction is still active");
        require(all_bidders.length > 0, "No bids placed");
        require(msg.sender == auc.current_winner, "You are not the winner");
        require(msg.value >= auc.winning_bid_amt, "Insufficient payment");
        require(!auc.amount_status, "Payment already done");

        auc.amount_status = true;

        // Marquer le gagnant dans la liste des bidders
        for (uint i = 0; i < all_bidders.length; i++) {
            if (all_bidders[i].bid_placer == msg.sender) {
                all_bidders[i].winner = true;
                break;
            }
        }

        // Remboursement de l'excédent
        if (msg.value > auc.winning_bid_amt) {
            payable(msg.sender).transfer(msg.value - auc.winning_bid_amt);
        }

        return true;
    }

    /**
     * @dev Permet au propriétaire de retirer les fonds après paiement
     */
    function withdraw_from_auction(uint auction_id) public {
        AuctionStruct storage auc = auctions[auction_id];
        require(auc.is_active, "Auction already withdrawn");
        require(auc.auction_owner == msg.sender, "Not the owner");
        require(block.timestamp >= auc.time_of_deadline, "Auction not ended");
        require(auc.amount_status, "Payment not received yet");

        uint amount = auc.winning_bid_amt;
        auc.is_active = false;
        payable(msg.sender).transfer(amount);
    }

    // ────────────────────────────────────────────────
    //                  GETTERS
    // ────────────────────────────────────────────────

    function view_all_auctions() public view returns (AuctionStruct[] memory) {
        return auctions;
    }

    function view_all_transactions(uint auction_id) public view returns (Bidder[] memory) {
        require(auction_id < auctions.length, "Invalid auction ID");
        return bidders[auction_id];
    }

    function view_contract_balance() public view returns (uint256) {
        return address(this).balance;
    }

    // Optionnel : récupérer une enchère spécifique
    function getAuction(uint auction_id) public view returns (AuctionStruct memory) {
        require(auction_id < auctions.length, "Invalid auction ID");
        return auctions[auction_id];
    }
}