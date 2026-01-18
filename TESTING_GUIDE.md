# Quick Testing Guide - Advanced Features

## 🎯 Feature Testing Checklist

### 1. Payment Methods Testing

**Test M-Pesa Payment:**

1. Add items to cart
2. Go to checkout
3. Select "M-Pesa" payment method
4. Complete order
5. ✅ Verify: Payment status should be "completed"

**Test Card Payment:**

1. Add items to cart
2. Go to checkout
3. Select "Card" payment method
4. Complete order
5. ✅ Verify: Payment status should be "completed"

**Test Cash on Delivery:**

1. Add items to cart
2. Go to checkout
3. Select "Cash" payment method
4. Complete order
5. ✅ Verify: Payment status should be "pending"

---

### 2. Email Automation Testing

**Test Reservation Confirmation:**

1. Make a reservation at `/reservations`
2. ✅ Check email inbox for confirmation
3. ✅ Verify: Email contains date, time, guests, special requests

**Test Enquiry Auto-Reply:**

1. Submit enquiry at `/contact`
2. ✅ Check email inbox for auto-reply
3. ✅ Verify: Email contains your message preview

**Test Newsletter Welcome:**

1. Subscribe to newsletter (footer)
2. ✅ Check email inbox for welcome message
3. ✅ Verify: Email lists subscriber benefits

**Test Order Status Update:**

1. Admin: Change order status in dashboard
2. ✅ Customer receives email notification
3. ✅ Verify: Email shows new status with color coding

**Test Custom Order Message:**

1. Admin: Click "Send Message" on an order
2. Type custom message
3. Send
4. ✅ Customer receives personalized email

---

### 3. Order Tracking Testing

**Test Order Tracking Flow:**

1. Place an order
2. Note the Order ID from success screen
3. Click "Track Your Order" button
4. ✅ Verify: Redirected to `/track-order`
5. Enter Order ID
6. ✅ Verify: See order details and progress tracker

**Test Direct Tracking:**

1. Navigate to `/track-order` from navbar
2. Enter any valid Order ID
3. ✅ Verify: Order details display correctly
4. ✅ Verify: Progress bar shows current status

**Test Invalid Order ID:**

1. Go to `/track-order`
2. Enter fake/invalid Order ID
3. ✅ Verify: Shows "Order not found" error

---

### 4. Admin Analytics Testing

**Test Analytics Dashboard:**

1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Analytics" tab
4. ✅ Verify: See total revenue card
5. ✅ Verify: See total orders count
6. ✅ Verify: See reservations count
7. ✅ Verify: See newsletter subscribers
8. ✅ Verify: See orders by status breakdown
9. ✅ Verify: See top 5 selling items

**Test Real-Time Updates:**

1. Place a new order
2. Refresh analytics tab
3. ✅ Verify: Order count increases
4. ✅ Verify: Revenue updates
5. ✅ Verify: Top items reflect new purchase

---

### 5. Restaurant Settings Testing

**Test Settings Access:**

1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Settings" tab
4. ✅ Verify: See opening hours field
5. ✅ Verify: See ordering toggle
6. ✅ Verify: See minimum order amount

**Test Settings Update:**

1. Change opening hours to "09:00-23:00"
2. Click "Save Settings"
3. ✅ Verify: Success message appears
4. Refresh page
5. ✅ Verify: Settings persist

---

### 6. Menu Management Testing

**Test Availability Toggle:**

1. Admin: Go to Menu Management tab
2. Edit a menu item
3. Toggle "Available" status
4. ✅ Verify: Item appears/disappears from public menu

**Test Featured Items:**

1. Admin: Mark item as "Featured"
2. ✅ Verify: Item highlighted on menu page
3. ✅ Verify: Could be shown on homepage

---

### 7. User Experience Testing

**Test Order Success Flow:**

1. Complete an order
2. ✅ Verify: See success screen with green checkmark
3. ✅ Verify: Order ID displayed prominently
4. ✅ Verify: "Track Your Order" button present
5. ✅ Verify: "Continue Shopping" button works

**Test Mobile Responsiveness:**

1. Open on mobile device
2. ✅ Verify: Payment method cards stack vertically
3. ✅ Verify: Order tracking progress is readable
4. ✅ Verify: Analytics cards are responsive
5. ✅ Verify: All buttons are tap-friendly

---

## 🔐 Admin Access Testing

**Login as Admin:**

```
Username: admin
Password: [your-admin-password]
```

**Verify Admin Routes:**

- ✅ `/admin` - Dashboard accessible
- ✅ `/api/admin/analytics` - Returns data
- ✅ `/api/admin/settings` - Returns settings
- ✅ `/api/admin/orders` - Lists all orders

**Verify Non-Admin Blocked:**

1. Logout
2. Login as regular user
3. Try accessing `/admin`
4. ✅ Verify: Redirected or shows 403 error

---

## 📊 Database Verification

**Check Payment Fields:**

```sql
SELECT id, payment_method, payment_status FROM orders LIMIT 5;
```

✅ Verify: Columns exist and contain data

**Check Loyalty Points:**

```sql
SELECT username, loyalty_points FROM users LIMIT 5;
```

✅ Verify: Column exists with default value 0

**Check Menu Enhancements:**

```sql
SELECT name, is_available, is_featured, rating FROM menu_items LIMIT 5;
```

✅ Verify: New columns exist

**Check Site Settings:**

```sql
SELECT * FROM site_settings;
```

✅ Verify: Default row exists

---

## 🚀 Performance Testing

**Test Page Load Times:**

- ✅ Homepage: < 2 seconds
- ✅ Menu page: < 2 seconds
- ✅ Track order: < 1 second
- ✅ Admin analytics: < 3 seconds

**Test Email Delivery:**

- ✅ Reservation confirmation: < 5 seconds
- ✅ Enquiry auto-reply: < 5 seconds
- ✅ Order status update: < 5 seconds

---

## 🐛 Common Issues & Solutions

### Issue: Emails not sending

**Solution:** Check `.env` file has correct SMTP credentials:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@savannahrestaurant.com
```

### Issue: Analytics showing 0

**Solution:** Ensure you have:

1. At least one completed order
2. Database migrations run successfully
3. Admin logged in correctly

### Issue: Order tracking not found

**Solution:**

1. Verify order ID is correct (case-sensitive)
2. Check order exists in database
3. Ensure `/api/orders/:id/tracking` endpoint works

### Issue: Payment status not updating

**Solution:**

1. Check migration `0005_order_payment.sql` ran
2. Verify `paymentMethod` field in checkout form
3. Check server logs for errors

---

## ✅ Success Criteria

All features are working correctly if:

- [ ] All 3 payment methods process successfully
- [ ] All 5 email types send and arrive
- [ ] Order tracking displays for valid IDs
- [ ] Analytics show accurate real-time data
- [ ] Settings persist after save
- [ ] Menu availability toggles work
- [ ] Mobile UI is fully responsive
- [ ] Admin routes are protected
- [ ] Database has all new columns
- [ ] No console errors in browser

---

## 📝 Notes

- Test with real email addresses to verify delivery
- Use different browsers to test compatibility
- Clear cache if seeing stale data
- Check server logs for any errors
- Monitor database for data integrity

**Happy Testing! 🎉**
