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
      throw new InvalidPurchaseException("No tickets requested");
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
      throw new InvalidPurchaseException("Invalid account ID");
    }
  }
}
