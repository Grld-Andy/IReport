# A Real-Time Incident Reporting & Coordination (Port Operations)

---

# Niche Overview: Port & Shipping Terminal Operations

This system is tailored for large ports and shipping terminals where real-time incident tracking, personnel coordination, and vehicle/equipment monitoring are critical. The system manages safety, operational efficiency, and incident response for dock workers, supervisors, and administrators.

It is a multi-tenant SaaS (not port-only): companies register, pay via Paystack, then run their own incident workspace.

---

# Stack

| Layer | Tech | Host |
|-------|------|------|
| Frontend | React + Vite | [Vercel](https://vercel.com) (`client/`) |
| API | .NET 10 modular Web API + SignalR | [Render](https://render.com) Docker (`server/`) |
| Database | PostgreSQL | [Supabase](https://supabase.com) (session mode, port **5432**) |
| Images | Supabase Storage (public bucket `safezone`) | Logos, profile pictures, media |

Render free disk is ephemeral, so files are never stored on the API host.

---

# Setup

Copy env templates from `client/.env.example` and `server/.env.example`. Nested API settings use double underscores (`postgres__connectionString`).

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Node.js 22+
- Docker (local Postgres) **or** a Supabase project
- A [Supabase](https://supabase.com) project (required for images; recommended for the database in production)

## 1. Supabase (database + bucket)

1. Create a project at [supabase.com](https://supabase.com).
2. **Database** — Project Settings → Database → connection string.
   - Use **Session mode, port 5432**. Do **not** use the transaction pooler on port 6543 (EF migrations need session mode).
3. **Storage** — create a **public** bucket named `safezone` (the API also tries to create it on first upload).
4. **API keys** — Project Settings → API: copy the Project URL and the **service_role** key.
   - Put `service_role` on the **server / Render only**. Never add it to Vercel or the client.

## 2. Local development

### Database

From `server/`:

```bash
docker compose up -d
```

This starts Postgres (`localhost:5432`, database `SafeZone`, user/password `postgres`) and Seq (`http://localhost:5341`). Point `postgres.connectionString` in `server/src/Bootstrapper/SafeZone.Bootstrapper/appsettings.json` at this instance, or at Supabase if you prefer one database everywhere.

EF migrations run automatically when the API starts.

### API

For local image uploads, set Supabase storage in `appsettings.json` or environment variables:

```json
"supabase": {
  "url": "https://YOUR_PROJECT_REF.supabase.co",
  "serviceRoleKey": "YOUR_SERVICE_ROLE_KEY",
  "bucket": "safezone"
}
```

Then:

```bash
cd server
dotnet run --project src/Bootstrapper/SafeZone.Bootstrapper/SafeZone.Bootstrapper.csproj
```

API: `http://localhost:5000` · health: `GET /ping` → `pong`

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

`client/.env`:

```
VITE_API_URL="http://localhost:5000/api/"
VITE_SOCKET_URL="http://localhost:5000/"
VITE_PAYSTACK_PUBLIC_KEY="pk_test_..."
```

Keep the trailing slashes on the URL vars. App: `http://localhost:5173`.

## 3. Production (Vercel + Render + Supabase)

### Render (API)

1. New **Web Service**, repo root directory **`server`**, Dockerfile path **`Dockerfile`**.
2. Health check: `/ping`.
3. Paste env vars from `server/.env.example`. Required in production:

| Variable | Notes |
|----------|--------|
| `postgres__connectionString` | Supabase **session** URI, port **5432**, `SSL Mode=Require` |
| `supabase__url` | `https://YOUR_PROJECT_REF.supabase.co` |
| `supabase__serviceRoleKey` | service_role key (server only) |
| `supabase__bucket` | `safezone` |
| `auth__jwt__issuerSigningKey` | random secret, 32+ characters |
| `security__encryption__key` | **exactly 32** characters |
| `cors__allowedOrigins__0` | Vercel origin, **no** trailing slash (`https://YOUR-APP.vercel.app`) |
| `paystack__secretKey` | Paystack secret |
| `paystack__callbackUrl` | `https://YOUR-APP.vercel.app/payment/callback` |
| `GmailSmtpSettings__Email` / `__AppPassword` | OTP / password-reset email |
| `logger__file__enabled` | `false` (Render disk is ephemeral) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

Render injects `PORT`; the container listens on `8080` locally in Docker.

After the first deploy, copy the service URL (e.g. `https://your-api.onrender.com`).

### Vercel (frontend)

1. New project, root directory **`client`**.
2. Framework: Vite. `vercel.json` already rewrites SPA routes to `index.html`.
3. Environment variables (include trailing slashes):

```
VITE_API_URL=https://your-api.onrender.com/api/
VITE_SOCKET_URL=https://your-api.onrender.com/
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_test
```

4. Redeploy the client after changing Vite env vars (they are baked in at build time).

Auth cookies use `SameSite=None; Secure` in production so the Vercel origin can call the Render API with credentials.

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