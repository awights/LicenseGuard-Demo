# ✅ LicenseGuard Testing Checklist

Use this checklist when demonstrating LicenseGuard to ensure all features are working.

## 🚀 Pre-Demo Setup

- [ ] Run `npm install` if first time
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] Open browser console (F12) for notification testing
- [ ] Clear localStorage if you want fresh demo data

---

## 1️⃣ Login & Authentication

### Test Admin Login
- [ ] Click "Agency Admin" quick login button
- [ ] Verify redirect to dashboard
- [ ] Confirm user name shows in header ("Alex Thompson")
- [ ] Confirm role shows as "admin"

### Test Member Login
- [ ] Logout
- [ ] Click "Team Member" quick login button
- [ ] Verify redirect to dashboard
- [ ] Confirm user name shows ("Sarah Johnson")
- [ ] Confirm role shows as "member"

### Test Manual Login
- [ ] Logout
- [ ] Enter email: `admin@acmeinsurance.com`
- [ ] Enter any password
- [ ] Click "Sign In"
- [ ] Verify successful login

---

## 2️⃣ Dashboard

### View Statistics (Admin)
- [ ] See 4 stat cards (Total, Active, Expiring Soon, Expired)
- [ ] Verify numbers are accurate (should have demo data)
- [ ] Check color coding (blue, green, yellow, red)

### Recent Licenses
- [ ] View recent licenses list
- [ ] Check status badges show correct colors
- [ ] Verify expiry dates display properly
- [ ] Click "View All →" to go to licenses page

### Upcoming Renewals
- [ ] See upcoming renewals widget
- [ ] Verify sorted by expiry date (soonest first)
- [ ] Check renewal links work (if present)
- [ ] Click "View Calendar →" to see calendar

### Quick Actions
- [ ] Click "Add License" - opens licenses page
- [ ] Click "View Calendar" - opens calendar page
- [ ] Click "Manage Team" - opens team page (admin only)

---

## 3️⃣ License Management

### View Licenses
- [ ] See table with all licenses
- [ ] Check columns: Type, Number, State, Expiry, Status, Actions
- [ ] Verify status badges colored correctly
- [ ] Verify admin sees all licenses (5+ licenses)
- [ ] Logout, login as member, verify sees only their licenses

### Add New License
- [ ] Click "Add License" button
- [ ] Modal opens
- [ ] Fill in all fields:
  - [ ] Select license type (State Producer)
  - [ ] Enter license number (TEST-12345)
  - [ ] Select state (CA)
  - [ ] Enter issue date (today)
  - [ ] Enter expiry date (1 year from today)
  - [ ] Optional: Enter renewal link
  - [ ] Optional: Enter notes
- [ ] Click "Add License"
- [ ] Verify modal closes
- [ ] Verify new license appears in table
- [ ] Verify status is "Active" (green)

### Edit License
- [ ] Click "Edit" on any license
- [ ] Modal opens with pre-filled data
- [ ] Change a field (e.g., notes)
- [ ] Click "Update License"
- [ ] Verify changes saved
- [ ] Verify table updates

### Upload Document
- [ ] Click "Edit" on a license
- [ ] Click in the document upload area
- [ ] Select a file (PDF, JPG, or PNG)
- [ ] Click "Upload" button
- [ ] Verify document appears in list
- [ ] Click "Update License"
- [ ] Edit again to verify document persisted

### Delete Document
- [ ] Edit a license with documents
- [ ] Click "Remove" on a document
- [ ] Verify document removed from list
- [ ] Click "Update License"

### Delete License
- [ ] Click "Delete" on any license
- [ ] Confirm deletion in dialog
- [ ] Verify license removed from table
- [ ] Verify count updates on dashboard

### Search Licenses
- [ ] Enter search term in search box
- [ ] Verify filtered results show matching licenses
- [ ] Test partial matches
- [ ] Clear search to see all again

### Filter by Status
- [ ] Select "Active" from status filter
- [ ] Verify only active licenses show
- [ ] Select "Expiring Soon"
- [ ] Verify only yellow status licenses show
- [ ] Select "Expired"
- [ ] Verify only red status licenses show
- [ ] Select "All Licenses" to reset

### Admin Features
- [ ] Login as admin
- [ ] Add license
- [ ] Verify "Assign To" dropdown shows all team members
- [ ] Select different user
- [ ] Save license
- [ ] Verify license assigned to that user

---

## 4️⃣ Calendar View

### Calendar Display
- [ ] See current month and year
- [ ] See days of week labels
- [ ] See today highlighted (blue background)
- [ ] See dates with renewals (yellow badges)
- [ ] Verify max 2 badges per date ("+X more" if needed)

### Navigation
- [ ] Click "Previous" to go to last month
- [ ] Verify calendar updates
- [ ] Click "Next" to return to current month
- [ ] Navigate forward to future months
- [ ] Verify license events show on correct dates

### Click Date
- [ ] Click a date with renewals (yellow badge)
- [ ] See "Selected Date Details" section appear below
- [ ] Verify correct licenses show for that date
- [ ] Check status badges
- [ ] Click renewal link (if present)

### Upcoming Renewals Sidebar
- [ ] See "Upcoming Renewals" section on right
- [ ] Verify shows licenses expiring in next 6 months
- [ ] Check sorted by expiry date (soonest first)
- [ ] Verify urgent renewals (< 30 days) are red
- [ ] Verify normal renewals (30-90 days) are yellow
- [ ] Click renewal links work

### Test Notifications
- [ ] Click "Test Notifications" button
- [ ] Open browser console (F12)
- [ ] Verify see mock email outputs with:
  - [ ] Recipient email
  - [ ] Subject line
  - [ ] Message body
  - [ ] Expiry date
  - [ ] Renewal link (if present)
- [ ] Verify alert confirms notifications sent

---

## 5️⃣ Team Management (Admin Only)

### Access Control
- [ ] Login as member
- [ ] Try to access /team
- [ ] Verify "Admin Access Required" message shows
- [ ] Logout, login as admin
- [ ] Verify team page loads

### View Team
- [ ] See agency information card:
  - [ ] Agency name (Acme Insurance Agency)
  - [ ] Plan type (Team)
  - [ ] Seats used (3/5)
  - [ ] Progress bar
- [ ] See team members table
- [ ] Check columns: Member, Email, Role, Licenses, Actions
- [ ] Verify 3 users show (Alex, Sarah, Mike)
- [ ] Check role badges (Admin = purple, Member = gray)
- [ ] Verify license counts show

### Add Team Member
- [ ] Click "Add Team Member"
- [ ] Modal opens
- [ ] Fill in details:
  - [ ] Name: "Test User"
  - [ ] Email: "test@acmeinsurance.com"
  - [ ] Role: Member
- [ ] Click "Add Member"
- [ ] Verify modal closes
- [ ] Verify new member in table
- [ ] Verify seat count increased (4/5)

### Edit Team Member
- [ ] Click "Edit" on any member
- [ ] Modal opens with pre-filled data
- [ ] Change role from Member to Admin
- [ ] Click "Update Member"
- [ ] Verify role badge changes to purple

### Delete Team Member
- [ ] Click "Remove" on a member (not yourself)
- [ ] Confirm deletion
- [ ] Verify member removed
- [ ] Verify seat count decreased
- [ ] Try to delete yourself (admin)
- [ ] Verify blocked with error message

### Seat Limit
- [ ] Add members until reaching seat limit (5/5)
- [ ] Verify "Add Team Member" button disabled
- [ ] Verify warning message shows
- [ ] Delete a member to free up space
- [ ] Verify button enabled again

### Team Statistics
- [ ] Check "Total Team Members" card
- [ ] Check "Total Licenses" card
- [ ] Check "Avg Licenses per Member" card
- [ ] Verify numbers are accurate

---

## 6️⃣ Pricing Page

### Page Display
- [ ] Navigate to /pricing
- [ ] See three pricing cards:
  - [ ] Individual ($19/month)
  - [ ] Team ($99/month) - marked "Most Popular"
  - [ ] Enterprise (Custom)
- [ ] Verify Team card is highlighted (blue ring)
- [ ] Check all features listed for each plan

### Feature Comparison Table
- [ ] Scroll to feature comparison
- [ ] See all features listed
- [ ] Verify checkmarks show correctly
- [ ] Check numerical values (seats, storage)
- [ ] Verify color coding (green checkmarks, gray dashes)

### FAQ Section
- [ ] See 6 FAQ items
- [ ] Read through questions and answers
- [ ] Verify content makes sense

### Call-to-Action
- [ ] Click "Start Free Trial" buttons
- [ ] Verify redirect to login page
- [ ] Click "Contact Sales" for Enterprise
- [ ] Verify redirect to login page

### Navigation
- [ ] Click logo to return to dashboard
- [ ] Click "Sign In" in header
- [ ] Verify can return to pricing page

---

## 7️⃣ Navigation & Layout

### Header Navigation
- [ ] See LicenseGuard logo (🛡️)
- [ ] Click logo - verify goes to dashboard
- [ ] See nav items: Dashboard, Licenses, Calendar, Team, Pricing
- [ ] Click each nav item
- [ ] Verify active page highlighted (blue background)
- [ ] Verify correct page loads

### User Info
- [ ] See user name in header
- [ ] See user role below name
- [ ] Verify matches logged-in user

### Logout
- [ ] Click "Logout" button
- [ ] Verify redirect to login page
- [ ] Verify session cleared
- [ ] Try to access /dashboard
- [ ] Verify redirect back to login

### Mobile Navigation (Optional)
- [ ] Resize browser to mobile width (< 640px)
- [ ] Verify hamburger menu appears
- [ ] Click to expand mobile nav
- [ ] Verify all nav items show
- [ ] Click nav item works

---

## 8️⃣ Responsive Design

### Desktop (> 1024px)
- [ ] Dashboard shows 2-column layout
- [ ] Calendar sidebar shows on right
- [ ] Team table shows all columns
- [ ] Forms display side-by-side fields

### Tablet (768px - 1024px)
- [ ] Dashboard stacks vertically
- [ ] Calendar sidebar stays on right
- [ ] Tables remain horizontal
- [ ] Forms adjust spacing

### Mobile (< 768px)
- [ ] Stats cards stack vertically
- [ ] Calendar switches to mobile view
- [ ] Tables scroll horizontally
- [ ] Forms stack vertically
- [ ] Buttons full width

---

## 9️⃣ Data Persistence

### LocalStorage Test
- [ ] Add a new license
- [ ] Refresh the page (F5)
- [ ] Verify license still exists
- [ ] Edit the license
- [ ] Refresh again
- [ ] Verify changes persisted

### Session Persistence
- [ ] Login
- [ ] Close browser tab
- [ ] Reopen application
- [ ] Verify still logged in
- [ ] Verify data intact

### Clear Data
- [ ] Open browser DevTools (F12)
- [ ] Go to Application > Local Storage
- [ ] Find localStorage entries
- [ ] Delete all
- [ ] Refresh page
- [ ] Verify redirected to login
- [ ] Login again
- [ ] Verify demo data reinitialized

---

## 🔟 Edge Cases & Error Handling

### Form Validation
- [ ] Try to add license with empty required fields
- [ ] Verify browser validation stops submission
- [ ] Try to add license with invalid date (expiry before issue)
- [ ] Fill all required fields
- [ ] Verify successful submission

### Large Numbers
- [ ] Add 20+ licenses
- [ ] Verify dashboard stats update
- [ ] Verify calendar still renders
- [ ] Verify search still fast

### Special Characters
- [ ] Add license with special chars in notes (quotes, ampersands)
- [ ] Save and reload
- [ ] Verify characters preserved correctly

### Delete Protection
- [ ] Try to delete admin user (yourself)
- [ ] Verify blocked
- [ ] Try to delete user with licenses
- [ ] Verify confirmation asks about licenses

---

## 🎯 Demo Script (5 Minutes)

**Perfect for showing to customers:**

1. **Login (30 sec)**
   - Use admin quick login
   - "Here's the login page. We have role-based access."

2. **Dashboard (1 min)**
   - "This is your command center. See all licenses at a glance."
   - Point out status indicators
   - Show upcoming renewals

3. **Add License (1.5 min)**
   - Click "Add License"
   - Fill in form quickly
   - Upload a document
   - "This is where agents track all their licenses and certifications."

4. **Calendar (1 min)**
   - Show visual calendar
   - Click a date with renewals
   - "Never miss a renewal deadline. Visual calendar shows everything."

5. **Team Management (1 min)**
   - Show team table
   - Add a member quickly
   - "Admins can manage the entire team, see compliance status."

6. **Pricing (30 sec)**
   - Quick scroll through plans
   - "Simple, affordable pricing. Individual agents or full agencies."

7. **Questions (time permitting)**

---

## ✅ Sign-Off Checklist

Before considering the prototype complete, verify:

- [ ] All 7 major features working
- [ ] No console errors
- [ ] No broken links
- [ ] All forms submit correctly
- [ ] All buttons clickable
- [ ] Status colors accurate
- [ ] Search works
- [ ] Filters work
- [ ] Add/edit/delete works
- [ ] Role-based access works
- [ ] Mobile responsive
- [ ] Documentation complete
- [ ] README clear
- [ ] DEVELOPMENT.md detailed
- [ ] No placeholder text
- [ ] Professional appearance
- [ ] Ready to demo

---

## 🐛 Known Issues (None!)

✅ No known bugs or issues at this time. All features tested and working.

---

**Happy Testing! 🛡️**

If you find any issues, document them and they can be addressed before customer demos.
