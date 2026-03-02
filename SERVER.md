# A Real-Time Incident Reporting & Coordination (Backend)

Refer to ../README.md

---

# Architecture

**Style:** Modular Monolith  
**Framework:** ASP.NET Core 8/9 Web API  
**Database:** SQL Server (single DB, separate schemas per module)  
**ORM:** Entity Framework Core  
**Authentication:** JWT + Refresh Tokens  
**Real-Time:** SignalR  

Each module contains:
- Domain
- Application
- Infrastructure
- Endpoints
- Module registration

---

# Modules

- Identity
- Incident
- Dispatch
- Location
- RealTime
- Reporting
- Comments

---

# Roles

- Guest (unauthenticated)
- Witness
- Responder (Field Staff)
- Supervisor
- Admin

---

# Flow

## Unauthenticated Users

### Guest
- Can register
- Can login

### Witness (Public Mode Optional)
- Can create incident (if public reporting enabled)

---

## Authenticated Users

### Witness
- Create incident
- View own incidents

### Responder
- View assigned incidents
- Update incident status
- Update own location

### Supervisor
- View all incidents
- Assign incidents
- Monitor responders on map
- View reports

### Admin
- Full system access
- Manage users
- Delete incidents

---

# API Endpoints

Base Route: `/api`

---

# Identity Module

## Auth Endpoints

POST `/api/auth/register`  
POST `/api/auth/login`  
POST `/api/auth/refresh-token`  
POST `/api/auth/password-reset-request`  
POST `/api/auth/password-reset`  
POST `/api/auth/logout`  

---

## Users Endpoints

GET `/api/users/me`  
PUT `/api/users/me`  
GET `/api/users/{id}`  
GET `/api/users`  
GET `/api/users/{id}/assigned-incidents`  
PUT `/api/users/{id}/role` (Admin only)  
PUT `/api/users/{id}/status` (Activate/Deactivate – Admin only)  

---

# Incident Module

## Status Lifecycle

Open → InProgress → Resolved → Closed

---

## Incident Endpoints

POST `/api/incidents`  
GET `/api/incidents`  
GET `/api/incidents/{id}`  
PUT `/api/incidents/{id}`  
DELETE `/api/incidents/{id}` (Admin only)  

PUT `/api/incidents/{id}/assign`  
PUT `/api/incidents/{id}/status`  

GET `/api/incidents/assigned/me`  
GET `/api/incidents/open`  

---

## Filtering

GET `/api/incidents?status=Open&severity=High&from=2026-01-01&to=2026-02-01`

---

## Create Incident Request

- Title
- Description
- Severity (Low | Medium | High | Critical)
- Latitude
- Longitude
- LocationDescription

---

## Assign Incident Request

- ResponderId

---

# Dispatch Module

Handles assignment logic, workflow rules, and audit tracking.

## Dispatch Endpoints

GET `/api/dispatch/history/{incidentId}`  
GET `/api/dispatch/unassigned`  
POST `/api/dispatch/escalate/{incidentId}`  

---

# Location Module

Handles responder check-ins and live positioning.

## Location Endpoints

PUT `/api/location/update`  
GET `/api/location/responders`  
GET `/api/location/responders/{id}`  
GET `/api/location/nearby?lat={lat}&lng={lng}&radius={meters}`  

---

## Update Location Request

- Latitude
- Longitude

Authorization:
- Responder → Update own location
- Supervisor/Admin → View all responders

---

# RealTime Module

## SignalR Hub

`/hubs/incident`

---

## Broadcasted Events

- IncidentCreated
- IncidentUpdated
- IncidentAssigned
- IncidentStatusChanged
- ResponderLocationUpdated

---

## Event Flow Example

Create Incident  
→ Incident Module saves to DB  
→ Publishes Domain Event  
→ RealTime Module handles event  
→ Broadcasts via SignalR  

Controllers do NOT call SignalR directly.  
RealTime reacts to domain events.

---

# Reporting Module

Read-only projections and analytics.

## Reporting Endpoints

GET `/api/reporting/summary`  
GET `/api/reporting/by-severity`  
GET `/api/reporting/by-status`  
GET `/api/reporting/response-times`  
GET `/api/reporting/trends`  

---

## Example Summary Response

- OpenCount
- InProgressCount
- ResolvedToday
- CriticalOpen
- AverageResponseTime

Access:
- Supervisor
- Admin

---

# Database Strategy

Single database with separate schemas:

- identity.*
- incident.*
- dispatch.*
- location.*
- reporting.*

Each module:
- Own DbContext
- Own migrations
- Own schema
- No cross-module entity references

---

# Security

- JWT Access Token (short-lived)
- Refresh Token (long-lived)
- Role-based authorization policies
- Soft delete for incidents
- Audit logging
- Concurrency control (RowVersion)

---

# Dependency Rules

Allowed:

API → Modules  
Modules → Shared BuildingBlocks  

Not Allowed:

Module → Another Module’s DbContext  
Module → Another Module’s Entity  
Controllers → Business Logic  

Modules communicate via:
- Interfaces
- Domain Events

---

# Future Enhancements

- File attachments per incident
- Incident chat
- SLA tracking
- Push notifications
- Geo-fencing alerts
- Mobile gateway
- Escalation rules engine

---

# Summary

This backend supports:

- Full authentication lifecycle
- Role-based access control
- Complete incident lifecycle management
- Assignment & dispatch workflow
- Real-time updates via SignalR
- Live responder location tracking
- Reporting & analytics
- Modular monolith architecture ready for future microservice extraction