# Firestore Security Rules Specification

## 1. Data Invariants
* Only authenticated users with verified email (`request.auth.token.email_verified == true`) can read or write their own user profile document.
* Users can only read and write to `/users/{userId}/` if `request.auth.uid == userId`.
* No user can modify another user's profile or subcollections.
* String lengths and list sizes must be limited to prevent Denial of Wallet.
* Profile attributes like `email` are immutable once created.

## 2. The "Dirty Dozen" Payloads (Denial Proofing)
1. **Unauthenticated Read Campaign**: Read `/users/someone-else-id` as guest -> `PERMISSION_DENIED`
2. **Identity Spoof Profile**: Write `{ name: "Malicious", email: "victim@domain.com" }` to `/users/anyuser` as guest -> `PERMISSION_DENIED`
3. **Cross-User Hijack**: Authenticated user `A` trying to rewrite `/users/B` -> `PERMISSION_DENIED`
4. **Huge Payload Spam**: Profile update with a 2MB `name` string -> `PERMISSION_DENIED`
5. **Array Poisoning Attack**: Injecting a 500-item array of malicious tags into `savedNotes` -> `PERMISSION_DENIED`
6. **Immutable Field Mutator**: Changing `email` from `vikasbbsr@gmail.com` to `hacker@hacker.com` on update -> `PERMISSION_DENIED`
7. **Negative Stats Attempt**: Decrementing `studyMinutes` or `solvedCount` below bounds -> `PERMISSION_DENIED`
8. **Malicious ID Injection**: Creating a document with ID containing `../badpath` inside subcollections -> `PERMISSION_DENIED`
9. **Unverified Email Access**: Logged in with fake unverified email (`email_verified` is false) trying to read profile -> `PERMISSION_DENIED`
10. **Shadow Key Insertion**: Injecting a ghost field `isAdmin: true` during update -> `PERMISSION_DENIED`
11. **Future Timestamps Trick**: Forcing future updates beyond `request.time` -> `PERMISSION_DENIED`
12. **Subcollection Orphan Creation**: Appending daily planner elements to someone else's list -> `PERMISSION_DENIED`

## 3. The Rules Layout Draft
`firestore.rules` will enforce these assertions exactly. Let's draft it.
