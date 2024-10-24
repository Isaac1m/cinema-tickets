import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

/**
 * Service responsible for handling cinema ticket purchases.
 * Manages ticket validation, payment processing, and seat reservation
 * according to business rules.
 *
 * @class TicketService
 */

export default class TicketService {
  /** @type {TicketPaymentService} Payment processing service instance */
  #paymentService;

  /** @type {SeatReservationService} Seat reservation service instance */
  #reservationService;

  /** Ticket price constants
   * Ticket prices in GBP for each ticket type
   * @private
   * @static
   * @readonly
   * */
  static #TICKET_PRICES = {
    INFANT: 0, // Infants don't require a seat
    CHILD: 15,
    ADULT: 25,
  };

  /** Inject dependencies when this service class is instantiated.
   * @constructor
   */
  constructor() {
    this.#paymentService = new TicketPaymentService();
    this.#reservationService = new SeatReservationService();
  }

  /**
   * Processes the purchase of tickets, including payment and seat reservation.
   *
   * @param {number} accountId - The account identifier for the purchaser
   * @param {...TicketTypeRequest} ticketTypeRequests - One or more ticket requests
   * @throws {InvalidPurchaseException} When purchase violates business rules
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!ticketTypeRequests?.length) {
      throw new InvalidPurchaseException("No tickets requested.");
    }
  }

  /**
   * Validates the account ID meets required criteria.
   *
   * @private
   * @param {number} accountId - The account ID to validate
   * @throws {InvalidPurchaseException} When account ID is invalid
   */
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID.");
    }
  }

  /**
   * Validates the total number of tickets requested meets business rules.
   *
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @throws {InvalidPurchaseException} When total tickets exceeds maximum allowed
   */
  #validateTicketCount(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce(
      (sum, request) => sum + request.getNoOfTickets(),
      0
    );
    if (totalTickets === 0) {
      throw new InvalidPurchaseException("No tickets requested.");
    }

    if (totalTickets > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets."
      );
    }
  }

  /**
   * Counts the number of tickets requested for each ticket type.
   *
   * @private
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket requests
   * @returns {Object} Object containing counts for each ticket type
   * @throws {InvalidPurchaseException} When ticket count is negative
   */
  #countTicketsByType(ticketTypeRequests) {
    return ticketTypeRequests.reduce(
      (counts, request) => {
        const ticketType = request.getTicketType();
        const numberOfTickets = request.getNoOfTickets();

        if (numberOfTickets < 0) {
          throw new InvalidPurchaseException(
            "Number of tickets cannot be negative."
          );
        }
        /** Increment the count for the given ticketType. Initialize the count to 0 if it doesn't exist,
         * then increment it by the number of tickets
         * */
        counts[ticketType] = (counts[ticketType] || 0) + numberOfTickets;
        return counts;
      },
      {
        // defaults
        ADULT: 0,
        CHILD: 0,
        INFANT: 0,
      }
    );
  }
  /**
   * Validates ticket combinations.
   * - At least one adult ticket is required
   * - Number of infant tickets cannot exceed adult tickets
   *
   * @private
   * @param {Object} ticketCounts - Object containing counts for each ticket type
   * @throws {InvalidPurchaseException} When ticket combination violates rules
   */

  #validateTicketRules(ticketCounts) {
    if (ticketCounts.ADULT === 0) {
      throw new InvalidPurchaseException(
        "At least one adult ticket is required."
      );
    }
    if (ticketCounts.INFANT > ticketCounts.ADULT) {
      throw new InvalidPurchaseException(
        "Number of infant tickets cannot exceed number of adult tickets."
      );
    }
  }
}
