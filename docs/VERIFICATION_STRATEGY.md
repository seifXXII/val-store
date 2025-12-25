# Verification Strategy

## Current Behavior

- Users can sign up and login without email verification
- Email verification is optional (sent but not enforced)

## Required Verification Points

### Email Verification

- **When:** Optional, nice-to-have for marketing
- **Not blocking:** Login, browsing, adding to cart

### Phone Verification (Priority)

- **When:** Cash on Delivery checkout
- **Required for:** COD orders
- **Method:** SMS OTP verification

## Implementation Tasks

### Phase 1: Phone Verification for COD

- [ ] Add phone verification service (Twilio/similar)
- [ ] Create OTP generation and validation
- [ ] Add phone verification UI in checkout
- [ ] Block COD orders for unverified phone numbers

### Phase 2: Soft Email Verification

- [ ] Send welcome/verification email on signup
- [ ] Add "Verify Email" banner in account page
- [ ] Don't block any actions

## Notes

- Email verification should never block user actions
- Phone verification only for COD payment method
- Card payments don't require phone verification
