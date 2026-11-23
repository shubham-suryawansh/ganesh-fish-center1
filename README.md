# Ganesh Fish Center – Billing System (Version 2.0)

A simple, responsive fish-shop billing web app. It runs locally in a modern browser and does not require installation or an internet connection (Google Fonts are optional; the system uses local fallback fonts).

## Shop configuration
- Shop: Ganesh Fish Center
- Owner: Ganesh gajare
- Mobile: 7840945168
- Address: Nashik, Maharashtra
- Logo: Fish
- Payment method: Cash

## Features
- Dashboard with today's sales, bill count, kilograms sold, and fish catalog count
- New bill with optional customer name/mobile, multiple fish items, weight in KG, per-KG pricing, discount, and automatic totals
- 80mm thermal receipt printing with shop details, customer details, bill number, itemized totals, and Cash payment method
- Sequential bill numbers using the `GFC-00001` format
- Fish catalog: add, edit, and delete fish with selling rates
- Bill history with reprint support and search by bill number/customer name
- Date-based daily sales report
- Export daily sales line items to CSV
- Download a JSON backup and restore a previously downloaded backup
- English and Marathi interface
- Data saved in the browser's LocalStorage

## Run the app
1. Extract `Ganesh_Fish_Center_Billing_System_v2.zip`.
2. Open the `fish_shop_billing` folder.
3. Double-click `index.html` or open it in Chrome, Edge, or Firefox.
4. Go to **Fish Management** to update fish names and current rates before billing.
5. Go to **New Bill**, add fish and weights, then choose **Generate & Print Bill**.

## Thermal printer setup
- Use an 80mm thermal receipt printer.
- In the browser print dialog, select the thermal printer and set paper width to 80mm (or the closest supported receipt size).
- Disable browser headers and footers if they appear.
- Allow pop-ups for the app so the receipt print window can open.

## Backup and data safety
- Bills and fish data are stored only in the current browser profile on this device.
- Use **Sales Report → Backup Data** regularly to download a JSON backup.
- Use **Restore Backup** to restore a previously downloaded JSON backup. Restoring replaces the current fish and bill data.
- Clearing browser site data or changing devices/browser profiles can remove access to locally stored records. This version does not include cloud sync, user accounts, or automatic online backup.

## Files
- `index.html` – app layout
- `style.css` – responsive styling
- `app.js` – billing logic, receipts, reports, and LocalStorage
