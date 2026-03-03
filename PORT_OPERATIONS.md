# A Real-Time Incident Reporting & Coordination (Port Operations)

Refer to ../README.md

---

# Niche Overview: Port & Shipping Terminal Operations

This system is tailored for large ports and shipping terminals where real-time incident tracking, personnel coordination, and vehicle/equipment monitoring are critical. The system manages safety, operational efficiency, and incident response for dock workers, supervisors, and administrators.

---

# Key Users / Roles

| Role                              | Description |
|----------------------------------|------------|
| Dock Worker / Operator (Witness)  | Reports incidents such as equipment failure, cargo spills, or injuries. Limited view of incidents. |
| Vehicle / Equipment Operator (Responder) | Responds to assigned incidents, updates incident status, and reports location in real-time. |
| Shift Supervisor (Supervisor)     | Assigns incidents, monitors all operations, tracks personnel and vehicles via map, manages workflow. |
| Port Safety & Security Admin (Admin) | Full system access, manages users, monitors operations, generates reports, oversees entire port safety. |

---

# Incident Categories

- Equipment Failure (e.g., crane, forklift, tugboat)
- Cargo Spill / Damage
- Fire / Hazardous Material Leak
- Security Breach / Theft
- Injury / Medical Emergency
- Traffic Congestion / Dock Delay

**Severity Levels:** Low, Medium, High, Critical

---

# Core Use Cases

1. **Forklift Breakdown**  
   - Worker reports incident on dashboard or mobile app.  
   - Supervisor assigns maintenance operator as responder.  
   - Responder updates status and location on map.  
   - Supervisor monitors live feed until incident is resolved.  

2. **Cargo Spill / Damage**  
   - Dock worker reports spill with location on map.  
   - Safety responder team assigned.  
   - Live map updates show responders' positions.  
   - Incident status updated in real-time; dashboard shows alerts to all relevant personnel.  

3. **Unauthorized Access / Security Breach**  
   - Security officer reports incident.  
   - Supervisor assigns security responders.  
   - Map tracks responders and affected zone.  
   - Admin oversees resolution and generates compliance report.  

4. **Dock Congestion / Traffic Management**  
   - Supervisor detects congestion on map.  
   - Incident created for traffic management.  
   - Personnel assigned to redirect vehicles.  
   - Real-time map updates allow monitoring of flow and clearance.  

---

# Data Models

## User Model
```json
{
  "Id": "guid",
  "Name": "string",
  "Email": "string",
  "Role": "Witness/User | Responder | Supervisor | Admin",
  "Status": "Active | Inactive",
  "AssignedIncidents": ["IncidentId"]
}
```

## Comments
```json
{
  "CommentId": "guid",
  "IncidentId": "guid",
  "AuthorId": "guid",
  "Text": "string",
  "Timestamp": "datetime"
}
```

## Incident Model
```json
{
  "Id": "guid",
  "Subject": "string",
  "Description": "string",
  "Category": "EquipmentFailure | CargoSpill | Fire | SecurityBreach | Injury | Congestion",
  "Severity": "Low | Medium | High | Critical",
  "Status": "Open | InProgress | Resolved | Closed",
  "ReporterId": "UserId",
  "AssignedToId": "UserId",
  "Location": {
    "Latitude": "double",
    "Longitude": "double",
    "ExtraDetails": "string"
  },
  "Timestamp": "datetime",
  "LastUpdated": "datetime"
}
```

## Respondee Location model
```json
{
  "UserId": "guid",
  "Latitude": "double",
  "Longitude": "double",
  "Timestamp": "datetime"
}
```

## Assignment Model
```json
{
  "IncidentId": "guid",
  "AssignedToId": "guid",
  "AssignedById": "guid",
  "AssignedAt": "datetime",
  "StatusHistory": [
    {"Status": "Open", "UpdatedBy": "guid", "Timestamp": "datetime"},
    {"Status": "InProgress", "UpdatedBy": "guid", "Timestamp": "datetime"}
  ]
}
```

# Frontend Pages

## Public Pages
1. Landing Page (/) – Overview, Sign Up, Sign In
2. Sign In (/auth/login) – Email, password, authentication
3. Sign Up (/auth/register) – Create account, select role if allowed
4. Forgot Password / Reset (/auth/forgot-password, /auth/reset-password)

## Authenticated Pages
1. Dashboard (/dashboard)
    - Live incident feed
    - Summary cards: Open, InProgress, Critical, Resolved
    - Quick filters and activity timeline

2. Incidents List (/incidents)
    - Table with filtering, sorting, search
    - Create incident modal
    - Status badges, severity color coding

3. Incident Details (/incidents/{id})
    - View full incident info
    - Map preview
    - Assignment controls (Supervisor/Admin)
    - Status updates by assigned responder

4. Live Map (/map)
    - Markers for all moving equipment and responders
    - Dock zones color-coded
    - Marker click → incident details popup
    - Real-time updates via SignalR

5. Kanban Board (/kanban)
    - Columns: Open → InProgress → Resolved → Closed
    - Drag & drop, real-time updates

6. Reports Page (/reporting)
    - Metrics and charts by incident category, dock zone, and severity
    - Export reports

7. User Management (/admin/users)
    - List users
    - Assign roles, activate/deactivate
    - View assigned incidents

8. Responder Location (/location)
    - Update own location (optional vehicle tracking)
    - Display other responders (Supervisor/Admin view)

## Backend Modules
- Identity Module – Authentication, roles, JWT + refresh tokens
- Incident Module – Core incident creation, update, status management
- Dispatch Module – Assignment logic, history, escalation
- Location Module – Real-time location tracking of responders and vehicles
- RealTime Module – SignalR hub for live updates
- Reporting Module – Read-only analytics, metrics, trends

## API Endpoints (Port-Specific)
1. Auth
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/refresh-token
    - POST /api/auth/password-reset-request
    - POST /api/auth/password-reset
    - POST /api/auth/logout

2. Users
    - GET /api/users/me
    - PUT /api/users/me
    - GET /api/users/{id}
    - GET /api/users
    - GET /api/users/{id}/assigned-incidents
    - PUT /api/users/{id}/role (Admin only)
    - PUT /api/users/{id}/status (Admin only)

3. Incidents
    - POST /api/incidents
    - GET /api/incidents
    - GET /api/incidents/{id}
    - PUT /api/incidents/{id}
    - DELETE /api/incidents/{id} (Admin only)
    - PUT /api/incidents/{id}/assign
    - PUT /api/incidents/{id}/status
    - GET /api/incidents/assigned/me
    - GET /api/incidents/open

4. Location
    - PUT /api/location/update
    - GET /api/location/responders
    - GET /api/location/responders/{id}
    - GET /api/location/nearby?lat=&lng=&radius=

5. Reporting
    - GET /api/reporting/summary
    - GET /api/reporting/by-category
    - GET /api/reporting/by-severity
    - GET /api/reporting/response-times
    - GET /api/reporting/trends

## RealTime Hub
1. /hubs/incident – broadcasts:
    - IncidentCreated
    - IncidentUpdated
    - IncidentAssigned
    - IncidentStatusChanged
    - ResponderLocationUpdated

2. /hubs/comments - broadcast:
    - CommentCreated
    - CommentUpdated

## Security
- Role-based access control (Dock Worker, Responder, Supervisor, Admin)
- JWT access tokens + refresh tokens
- Soft delete for incidents
- Audit logging of assignments, status changes, and location updates
- Users can be banned for abusing system

## Map / Location Considerations
- Entire port layout rendered on map: docks, container yards, cranes, roads, warehouses
- Real-time vehicle & responder positions via SignalR
- Color-coded zones and severity levels
- Marker click → opens incident details modal

## Future Enhancements
- Integrate IoT sensors for automated incident creation (e.g., crane faults)
- Push notifications for high-severity incidents
- Multi-terminal tracking for large port operations
- Vehicle telemetry (speed, equipment status)
- Heatmaps for incident hotspots