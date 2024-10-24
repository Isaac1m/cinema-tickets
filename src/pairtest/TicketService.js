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

  /** Inject dependencies when this service class is instatiated
   * @constructor
   */
  constructor() {
    this.#paymentService = new TicketPaymentService();
    this.#reservationService = new SeatReservationService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {}
}
