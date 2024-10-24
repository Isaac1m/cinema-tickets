import { jest } from "@jest/globals";
import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";

describe("TicketService", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Spy on the actual service methods
    jest.spyOn(TicketPaymentService.prototype, "makePayment");
    jest.spyOn(SeatReservationService.prototype, "reserveSeat");
  });

  test("should successfully purchase tickets for valid requests", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const adultRequest = new TicketTypeRequest("ADULT", 2);
    const childRequest = new TicketTypeRequest("CHILD", 1);
    const infantRequest = new TicketTypeRequest("INFANT", 1);

    ticketService.purchaseTickets(
      accountId,
      adultRequest,
      childRequest,
      infantRequest
    );

    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
      accountId,
      65
    );
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
      accountId,
      3
    );
  });

  test("should throw error for invalid account ID", () => {
    const ticketService = new TicketService();
    const invalidAccountId = 0;
    const adultRequest = new TicketTypeRequest("ADULT", 1);

    expect(() => {
      ticketService.purchaseTickets(invalidAccountId, adultRequest);
    }).toThrow(InvalidPurchaseException);
  });

  test("should throw error when purchasing more than 25 tickets", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const adultRequest = new TicketTypeRequest("ADULT", 26);

    expect(() => {
      ticketService.purchaseTickets(accountId, adultRequest);
    }).toThrow(InvalidPurchaseException);
  });

  test("should throw error when purchasing child tickets without adult tickets", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const childRequest = new TicketTypeRequest("CHILD", 1);

    expect(() => {
      ticketService.purchaseTickets(accountId, childRequest);
    }).toThrow(InvalidPurchaseException);
  });

  test("should throw error when purchasing infant tickets without adult tickets", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const infantRequest = new TicketTypeRequest("INFANT", 1);

    expect(() => {
      ticketService.purchaseTickets(accountId, infantRequest);
    }).toThrow(InvalidPurchaseException);
  });

  test("should throw error when purchasing more infant tickets than adult tickets", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const adultRequest = new TicketTypeRequest("ADULT", 1);
    const infantRequest = new TicketTypeRequest("INFANT", 2);

    expect(() => {
      ticketService.purchaseTickets(accountId, adultRequest, infantRequest);
    }).toThrow(InvalidPurchaseException);
  });

  test("should not reserve seats for infant tickets", () => {
    const ticketService = new TicketService();
    const accountId = 1;
    const adultRequest = new TicketTypeRequest("ADULT", 2);
    const infantRequest = new TicketTypeRequest("INFANT", 2);

    ticketService.purchaseTickets(accountId, adultRequest, infantRequest);

    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(
      accountId,
      50
    );
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(
      accountId,
      2
    );
  });

  test("should throw error when no tickets are requested", () => {
    const ticketService = new TicketService();
    const accountId = 1;

    expect(() => {
      ticketService.purchaseTickets(accountId);
    }).toThrow(InvalidPurchaseException);
  });
});
