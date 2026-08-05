# DEVELOPMENT TODO LIST - SOBAT CERIA PLATFORM

## Phase 1: Project Setup & Architecture
- [ ] Initialize Expo project with React Native Web support (`npx create-expo-app sobat-ceria -t expo-template-blank-typescript`).
- [ ] Configure Tailwind CSS / NativeWind for cross-platform styling.
- [ ] Setup React Navigation (Native Stack + Bottom Tabs).
- [ ] Configure Supabase / Firebase Auth & Database schema.

## Phase 2: Auth & Landing Page Integration
- [ ] Build Landing Page Component (using modified KINDERING HTML/Tailwind layout).
- [ ] Implement Smart Platform Detection (Redirect to Expo Web or Store Download Links).
- [ ] Implement Auth Screen (Nama Ortu, Email, Phone Number, Child Info).

## Phase 3: Catalog & E-Commerce Core (Shopee-like)
- [ ] Build Catalog Grid Screen with Age Filter (2-3th, 4-5th, 6-7th).
- [ ] Build Class Detail Screen (Description, Seats left, Price, Instructor info).
- [ ] Build Checkout & Cart Screen.
- [ ] Implement Coupon & Voucher Claim Engine (Repeat Order Discount Code).
- [ ] Integrate Payment Gateway API (Midtrans/Xendit Sandbox).

## Phase 4: Screening, Documentation & Worksheets
- [ ] Build Child Screening Progress UI (STPPA Indicator Graphs & Reports).
- [ ] Build Event Media Vault Screen (External Drive Link Viewer / Photo Grid).
- [ ] Build Worksheet Center (PDF Viewer & Direct Download Trigger).

## Phase 5: Mini Games & Polish (Optional)
- [ ] Implement Mini Educational Game Screen (Memory Card Game / Color Match).
- [ ] Add App Animations (Reanimated / Lottie for Kids Cuteness).
- [ ] Cross-browser testing & Android/iOS Build via Expo EAS (`eas build`).