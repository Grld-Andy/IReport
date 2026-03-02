# A Real-Time Incident Reporting & Coordination (Frontend)

Refer to ../README.md

---

# Frontend Overview

**Type:** SPA (React / Angular / Blazor WASM – framework agnostic structure)  
**Communication:** REST API + SignalR  
**Auth:** JWT (stored securely, refresh flow implemented)  
**State Management:** Context / Redux / NgRx (depending on framework)  
**Real-Time:** SignalR client  

The frontend is role-aware and dynamically adjusts UI based on:

- Witness
- Responder
- Supervisor
- Admin

---

# Application Structure

## Layouts

### 1. Public Layout
Used for:
- Landing page
- Sign In
- Sign Up
- Forgot Password

### 2. Authenticated App Layout
Includes:
- Sidebar navigation
- Topbar (notifications, profile dropdown)
- Real-time connection indicator
- Role-based menu visibility

---

# Pages (Organized Properly)

---

# 🌐 Public Pages

## 1. Landing Page (`/`)
- Overview of system
- Call-to-action buttons:
  - Sign In
  - Register
  - Report Incident (if public reporting enabled)

---

## 2. Sign In (`/auth/login`)
- Email
- Password
- Remember Me
- Link to reset password

---

## 3. Sign Up (`/auth/register`)
- Name
- Email
- Password
- Role selection (if allowed)
- Register button

---

## 4. Forgot Password (`/auth/forgot-password`)
- Email input
- Send reset link

---

## 5. Reset Password (`/auth/reset-password`)
- New password
- Confirm password

---

# 🔐 Authenticated Pages

---

# 🏠 1. Dashboard (`/dashboard`)

### Purpose
Main operational overview screen.

### Components
- Real-Time Incident Feed (auto-updates via SignalR)
- Summary Cards:
  - Open Incidents
  - In Progress
  - Critical Incidents
  - Resolved Today
- Quick Filters
- Activity Timeline (recent actions)
- System connection indicator

### Visible To
Responder, Supervisor, Admin

---

# 📋 2. Incidents List Page (`/incidents`)

### Purpose
Primary incident management table view.

### Features
- Paginated table
- Filtering:
  - Status
  - Severity
  - Date range
  - Assigned responder
- Sorting
- Search
- Status badges
- Severity color coding
- "Create Incident" modal button

### Role Permissions
- Witness → View own incidents
- Responder → View assigned incidents
- Supervisor → View all
- Admin → Full access

---

# ➕ 3. Create Incident (Modal)

Accessible from:
- Incidents page
- Dashboard

### Fields
- Title
- Description
- Severity
- Location picker (map click)
- Submit button

Auto-refreshes feed after submission.

---

# 📄 4. Incident Details Page (`/incidents/{id}`)

### Purpose
Single incident view with full context.

### Sections
- Incident info
- Map preview of location
- Assignment info
- Status history timeline
- Dispatch history
- Activity log

### Actions
- Assign / Deassign (Supervisor/Admin)
- Change Status (Assigned Responder)
- Delete (Admin only)

---

# 🗺 5. Live Map Page (`/map`)

### Purpose
Geospatial overview of incidents and responders.

### Features
- Map with:
  - Incident markers (color by severity)
  - Responder markers (live updates)
- Marker popups
- Click marker → open incident details
- Toggle:
  - Show only open incidents
  - Show responders
- Auto-refresh via SignalR

### Visible To
Supervisor, Admin

---

# 📊 6. Reporting Page (`/reporting`)

### Purpose
Analytics & performance insights.

### Components
- Charts:
  - Incidents by Severity
  - Incidents by Status
  - Trend over time
- Metrics:
  - Avg response time
  - Resolution time
- Date range selector
- Export to CSV (future)

### Visible To
Supervisor, Admin

---

# 🗂 7. Kanban Board (`/kanban`)

### Purpose
Visual workflow management.

### Columns
- Open
- In Progress
- Resolved
- Closed

### Features
- Drag and drop
- Real-time status update
- Assignment badge
- Severity indicator
- Auto-sync via SignalR

### Visible To
Supervisor

---

# 👤 8. My Incidents (`/my-incidents`)

### Purpose
Quick access to assigned incidents.

### Features
- List of assigned incidents
- Quick status update buttons
- Navigate to details

### Visible To
Responder

---

# 📍 9. Responder Location Page (`/location`)

### Purpose
For responders to manage check-in.

### Features
- Current location display
- "Update Location" button
- Auto-check-in toggle
- Location timestamp

### Visible To
Responder

---

# 👥 10. User Management (`/admin/users`)

### Purpose
Administrative user control.

### Features
- List all users
- Filter by role
- Activate/Deactivate
- Change role
- View assigned incidents

### Visible To
Admin

---

# 🔔 11. Notifications Panel (Global Component)

Real-time notifications:
- Incident assigned
- Status changed
- Critical incident created
- Escalation alert

---

# 🧭 Navigation Structure

## Sidebar Menu (Role-Based)

### Witness
- Dashboard
- My Incidents

### Responder
- Dashboard
- My Incidents
- Location

### Supervisor
- Dashboard
- Incidents
- Kanban
- Live Map
- Reporting

### Admin
- Dashboard
- Incidents
- Kanban
- Live Map
- Reporting
- User Management

---

# 🔄 Real-Time Integration

Using SignalR client:

Listen for:
- IncidentCreated
- IncidentUpdated
- IncidentAssigned
- IncidentStatusChanged
- ResponderLocationUpdated

Updates:
- Feed
- Kanban columns
- Map markers
- Notifications

---

# 🧩 Component Organization

## Core Components
- Navbar
- Sidebar
- ProtectedRoute
- RoleGuard
- NotificationBell
- RealTimeProvider

## Incident Components
- IncidentCard
- IncidentTable
- IncidentFilterPanel
- IncidentModal
- StatusBadge
- SeverityTag

## Map Components
- MapContainer
- IncidentMarker
- ResponderMarker

## Reporting Components
- ChartCard
- MetricsCard
- DateRangePicker

---

# 🛡 Access Control (Frontend Guards)

- Route guards check:
  - Authentication
  - Role
- Hide unauthorized navigation items
- Graceful 403 page

---

# ⚠ Error & System Pages

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Server Error
- Offline / Connection Lost (SignalR disconnected state)

---

# 📁 Suggested Folder Structure
/src
├── app
│ ├── layouts
│ ├── routes
│ ├── guards
│
├── features
│ ├── auth
│ ├── dashboard
│ ├── incidents
│ ├── kanban
│ ├── map
│ ├── reporting
│ ├── location
│ ├── users
│
├── components
├── services
├── hooks (or state)
├── utils
└── realtime


---

# Future Enhancements

- Mobile responsive PWA mode
- Push notifications
- Dark mode
- Offline incident drafting
- Attachment uploads
- Incident chat panel

---

# Summary

The frontend supports:

- Full authentication flow
- Role-based UI rendering
- Real-time updates
- Incident lifecycle management
- Geospatial monitoring
- Workflow via Kanban
- Reporting & analytics
- Modular feature-based structure aligned with backend modules