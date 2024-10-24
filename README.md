# Cinema Ticket Service

A ticket booking service implementation that handles the purchase of cinema tickets, following specific business rules and validations.

## Overview

This service processes ticket purchases for a cinema, handling different ticket types (Adult, Child, Infant) with specific pricing and seating rules. It integrates with payment processing and seat reservation services.

## Business Rules

- Ticket Types and Pricing:

  - Adult: £25
  - Child: £15
  - Infant: £0 (no seat allocation)

- Purchase Constraints:
  - Maximum of 25 tickets per purchase
  - Child and Infant tickets require accompanying Adult tickets
  - Infants must be seated on an Adult's lap
  - Number of Infant tickets cannot exceed Adult tickets

## Technical Implementation

The service is implemented in JavaScript (ES Modules) and includes:

- Input validation
- Payment processing
- Seat reservation
- Business rule enforcement

## Testing

Tests are implemented using Jest. To run the test suite:

```bash
npm install
npm test
```

## Dependencies

- Node.js >=20.9.0
- Jest (for testing)

## Project Structure

```
src/
├── pairtest/
│   ├── lib/
│   │   ├── InvalidPurchaseException.js
│   │   └── TicketTypeRequest.js
│   └── TicketService.js
└── thirdparty/
    ├── paymentgateway/
    │   └── TicketPaymentService.js
    └── seatbooking/
        └── SeatReservationService.js
```
