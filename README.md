# RuralCare: AI-Based Rural Healthcare Navigation and Referral System

People in rural areas often do not know which hospital to go to for a given health problem. This
platform helps them find the right facility, get an AI-assisted recommendation, book appointments
and track digital referrals between healthcare facilities.

> MCA Final Year Project, Session 2026-27

---

## Table of Contents
1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Run with Docker](#run-with-docker)
6. [Run Locally (without Docker)](#run-locally-without-docker)
7. [User Roles and Security](#user-roles-and-security)
8. [API Reference](#api-reference)
9. [Business Rules](#business-rules)
10. [AI Recommendation](#ai-recommendation)
11. [Database Design](#database-design)
12. [Testing](#testing)
13. [Project Status](#project-status)
14. [Team](#team)

---

## Features
- **Facility search:** find PHCs, clinics and hospitals by type, status and government-scheme support.
- **Nearby facilities:** distance-based search using the Haversine formula.
- **AI recommendation:** describe symptoms and get a suggested specialization, urgency level and
  matching facilities and doctors (Google Gemini, with a keyword fallback if the AI is unavailable).
- **Digital referrals:** health workers and patients create referrals, and the receiving facility
  accepts, rejects or completes them. Emergency referrals are shown first.
- **Appointments:** book and cancel appointments with a facility or a doctor.
- **Notifications:** patients are notified about appointments and referrals.
- **Ratings:** patients rate facilities from 1 to 5 stars.
- **Admin statistics:** totals and breakdowns for facilities, doctors, referrals and appointments.
- **Secure access:** JWT authentication and role-based authorization (PATIENT, HEALTH_WORKER, ADMIN).

## Architecture

The system follows a **microservices architecture**. Every service owns its own responsibility and
its own database (database-per-service), and the browser talks to a single entry point, the API gateway.

```
                        +-----------------------+
                        |   React frontend      |
                        |   (Vite, port 5173)   |
                        +-----------+-----------+
                                    |  /api/**
                                    v
                        +-----------------------+
                        |      API Gateway      |
                        |      (port 8080)      |
                        |  routing, CORS, logs  |
                        +-----+------+------+---+
                              |      |      |
              /api/users/**   |      |      |   /api/ai/**
                    +---------+      |      +----------+
                    v                v                 v
          +----------------+  +----------------+  +----------------+
          |  user-service  |  |  core-service  |  |   ai-service   |
          |   (port 8081)  |  |   (port 8082)  |<-|   (port 8083)  |
          | auth, profiles |  | facilities,    |  | recommendation |
          |      JWT       |  | doctors,       |  |  Gemini + local|
          +-------+--------+  | referrals,     |  |    fallback    |
                  |           | appointments,  |  +--------+-------+
                  v           | notifications, |           |
            +-----------+     | ratings, stats |           v
            |  user_db  |     +--------+-------+    Google Gemini API
            |  (MySQL)  |              |
            +-----------+              v
                                 +-----------+
                                 |  core_db  |
                                 |  (MySQL)  |
                                 +-----------+

        discovery-server (Eureka, port 8761): optional service registry
```

| Service | Port | Responsibility | Database |
|---|---|---|---|
| frontend | 5173 | React user interface | none |
| api-gateway | 8080 | Single entry point: routing, CORS, request logging | none |
| user-service | 8081 | Registration, login, JWT issuing, user profile | `user_db` |
| core-service | 8082 | Facilities, doctors, referrals, appointments, notifications, ratings, admin stats | `core_db` |
| ai-service | 8083 | Symptom-based facility and doctor recommendation | none (reads from core-service) |
| discovery-server | 8761 | Eureka service registry (optional, disabled by default) | none |

**Why two databases?** Each service owns its data, so services stay independent and can be changed,
scaled or deployed on their own. There are no foreign keys across databases: core-service stores the
user's id (`patientId`) as a plain number that came from the JWT.

**How authentication works.** user-service signs a JWT (HS256) at login. core-service validates the
same token with a shared secret and reads the user's id and role from it, so core-service never has
to call user-service on each request.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router |
| Backend | Java 17, Spring Boot 3.3.4, Spring Cloud 2023.0.3 |
| Gateway | Spring Cloud Gateway (reactive) |
| Security | Spring Security, JWT (jjwt), BCrypt password hashing |
| Persistence | Spring Data JPA (Hibernate), MySQL 8 |
| AI | Google Gemini API with a keyword-based fallback |
| API docs | springdoc OpenAPI (Swagger UI) |
| Build and run | Maven, Docker, Docker Compose |
| Testing | JUnit 5, Mockito |

Backend code follows a layered structure in every service:
`controller -> service (interface + implementation) -> repository -> model`, with `dto`,
`exception` (custom exceptions plus a global `@RestControllerAdvice` handler) and `security` packages.
Every response uses one wrapper, `ApiResponse<T>`.

## Project Structure
```
.
├── backend/
│   ├── api-gateway/        # routing, CORS, logging filter
│   ├── user-service/       # auth, JWT, user profile
│   ├── core-service/       # main business logic
│   ├── ai-service/         # AI recommendation
│   └── discovery-server/   # Eureka server (optional)
├── frontend/               # React + Vite application
├── database/
│   ├── schema.sql          # creates user_db and core_db with all tables
│   └── seed.sql            # demo data: 12 facilities and 16 doctors (Nagpur region)
├── docker-compose.yml      # runs the whole system (see "Run with Docker")
├── .env.example            # environment variables template
├── DFD.png                 # data flow diagram
└── ER Diagram.png          # entity relationship diagram
```

## Run with Docker

**Prerequisites:** Docker Desktop (running).

1. Copy the environment template and fill in the values:
   ```bash
   cp .env.example .env
   ```
   | Variable | Meaning |
   |---|---|
   | `MYSQL_ROOT_PASSWORD` | Password for the MySQL container |
   | `JWT_SECRET` | Secret used to sign tokens, at least 32 characters, shared by user-service and core-service |
   | `GEMINI_API_KEY` | Optional. Without it, the AI service uses its keyword fallback |
   | `GEMINI_MODEL` | Optional. Gemini model name |

2. Build and start everything:
   ```bash
   docker compose up --build
   ```
3. Open the application:

   | What | URL |
   |---|---|
   | Frontend | http://localhost:5173 |
   | API gateway | http://localhost:8080 |
   | Swagger UI (core-service) | http://localhost:8082/swagger-ui.html |

4. Stop: `docker compose down`. Reset the database as well: `docker compose down -v`.

The database is created from `database/schema.sql` and `database/seed.sql` on the first start only.

## Run Locally (without Docker)

**Prerequisites:** Java 17 or newer, Maven (or the included `mvnw`), MySQL 8, Node.js 20+.

### 1. Database
Run both scripts in MySQL (Workbench or the `mysql` command line), **once**:
```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```
Do not run `seed.sql` twice, because it would insert duplicate rows.

### 2. Backend
Start the services in this order. Each runs with `mvn spring-boot:run` from its own folder (or run
the main class from your IDE).

| Order | Service | Command |
|---|---|---|
| 1 | user-service | `cd backend/user-service && mvn spring-boot:run` |
| 2 | core-service | `cd backend/core-service && mvn spring-boot:run` |
| 3 | ai-service | `cd backend/ai-service && mvn spring-boot:run` |
| 4 | api-gateway | `cd backend/api-gateway && mvn spring-boot:run` |

Settings are read from environment variables, with local defaults in each `application.yml`:

| Variable | Default | Used by |
|---|---|---|
| `DB_URL` | local MySQL on 3306 | user-service, core-service |
| `DB_USERNAME` | `root` | user-service, core-service |
| `DB_PASSWORD` | `root` | user-service, core-service (set your own password here, never commit it) |
| `JWT_SECRET` | local dev value | user-service, core-service (must be identical) |
| `GEMINI_API_KEY` | empty | ai-service |
| `CORE_SERVICE_URL`, `USER_SERVICE_URL`, `AI_SERVICE_URL` | localhost URLs | api-gateway, ai-service |
| `EUREKA_ENABLED` | `false` | user-service, core-service |

The discovery-server is optional. To use it, start it first (`backend/discovery-server`) and set
`EUREKA_ENABLED=true` on the services.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8080` so the app talks to the gateway.

## User Roles and Security
| Role | Can do |
|---|---|
| **PATIENT** | Search facilities and doctors, create referrals, book appointments, rate facilities, read own notifications |
| **HEALTH_WORKER** | Everything a patient can do, plus view all referrals and accept, reject or complete them |
| **ADMIN** | Manage facilities and doctors, update referral status, view admin statistics and all users |

- Passwords are stored as BCrypt hashes and are never returned by the API.
- Protected endpoints need the header `Authorization: Bearer <token>`.
- Missing or invalid token: `401`. Logged in but not allowed: `403`.
- Profile endpoints use the email inside the token, so a user can only access their own profile.

## API Reference

All requests go through the gateway at `http://localhost:8080`. All responses use this shape:
```json
{ "success": true, "message": "Facilities fetched", "data": {}, "timestamp": "2026-10-18T19:00:00" }
```

### Users (user-service)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register (`name, email, password, phone, location, role`) |
| POST | `/api/users/login` | Public | Login, returns `token, role, name, userId` |
| GET | `/api/users/profile/me` | Logged in | Own profile |
| PUT | `/api/users/profile/me` | Logged in | Update `name, phone, location, age, gender` |
| PATCH | `/api/users/profile/password` | Logged in | Change password (`oldPassword, newPassword`) |
| GET | `/api/users/admin/users` | ADMIN | List all users |

### Facilities and doctors (core-service)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/facilities` | Public | All facilities |
| GET | `/api/facilities/{id}` | Public | One facility |
| GET | `/api/facilities/type/{type}` | Public | By type: `PHC, DISTRICT_HOSPITAL, SPECIALIST_HOSPITAL, CLINIC` |
| GET | `/api/facilities/govt-scheme` | Public | Facilities that accept a government scheme |
| GET | `/api/facilities/nearby?lat=&lng=&radiusKm=&type=&govtScheme=` | Public | Nearby facilities with `distanceKm` |
| POST, PUT, DELETE | `/api/facilities` | ADMIN | Manage facilities |
| GET | `/api/doctors` | Public | All doctors |
| GET | `/api/doctors/{id}` | Public | One doctor |
| GET | `/api/doctors/facility/{facilityId}` | Public | Doctors of a facility |
| GET | `/api/doctors/search?specialization=` | Public | Search by specialization |
| POST, PUT, DELETE | `/api/doctors` | ADMIN | Manage doctors |

### Referrals
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/referrals` | PATIENT, HEALTH_WORKER | Create (`patientId, fromFacilityId, toFacilityId, reason, isEmergency`) |
| GET | `/api/referrals` | Logged in | All referrals, emergency first |
| GET | `/api/referrals/{id}` | Logged in | One referral |
| GET | `/api/referrals/patient/{patientId}` | Logged in | Referrals of a patient |
| PATCH | `/api/referrals/{id}/status?status=` | HEALTH_WORKER, ADMIN | Change status |

### Appointments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/appointments` | Logged in | Book (`patientId, facilityId, doctorId, appointmentDate`) |
| GET | `/api/appointments/patient/{patientId}` | Logged in | Appointments of a patient |
| GET | `/api/appointments/facility/{facilityId}` | Logged in | Appointments of a facility |
| PATCH | `/api/appointments/{id}/cancel` | Logged in | Cancel |
| PATCH | `/api/appointments/{id}/status?status=` | Logged in | Change status |

### Notifications and ratings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/notifications/user/{userId}` | Logged in | All notifications of a user |
| GET | `/api/notifications/user/{userId}/unread` | Logged in | Unread notifications |
| PATCH | `/api/notifications/{id}/read` | Logged in | Mark one as read |
| PATCH | `/api/notifications/user/{userId}/read-all` | Logged in | Mark all as read |
| GET | `/api/ratings/facility/{facilityId}` | Public | Ratings and average of a facility |
| POST | `/api/ratings` | Logged in | Rate a facility (`facilityId, patientId, stars 1-5, comment`) |

### AI and admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/ai/recommend` | Public | Recommend by symptoms (`symptoms, latitude, longitude, isEmergency`) |
| GET | `/api/admin/stats` | ADMIN | Platform statistics |

Interactive documentation for core-service: `http://localhost:8082/swagger-ui.html`.

## Business Rules
- A referral cannot be created for a facility that is **CLOSED**.
- An **EMERGENCY_ONLY** facility accepts emergency referrals only.
- Referral status follows one flow: `PENDING -> ACCEPTED or REJECTED`, then `ACCEPTED -> COMPLETED`.
  Any other change is rejected with `400`.
- Referral lists show emergency referrals first, then the newest.
- An appointment date must be in the future. Booking and cancelling an appointment creates a notification.
- A rating must be between 1 and 5 stars.
- Registration needs a valid email, a password of at least 6 characters and a 10-digit phone number.

## AI Recommendation
1. The patient enters symptoms, and optionally location and an emergency flag.
2. ai-service fetches current facilities and doctors from core-service.
3. It builds a prompt and calls Google Gemini, then validates the JSON reply against real data
   (facility names always come from our own database).
4. If Gemini is not configured, fails or returns an invalid reply, a **keyword-based fallback**
   recommends a specialization and nearby facilities, so the feature keeps working.
5. The reply contains `suggestedSpecialization`, `urgency` (LOW, MEDIUM, HIGH), a list of
   recommendations with a `matchScore`, and a medical disclaimer.

> AI recommendations are a navigation aid. They do not replace a doctor's diagnosis.

## Database Design
Two MySQL databases, created by `database/schema.sql`:

- **user_db:** `users`
- **core_db:** `facilities`, `services`, `doctors`, `referrals`, `appointments`, `notifications`, `ratings`

See `ER Diagram.png` and `DFD.png` in the repository root.

## Testing
Unit tests use JUnit 5 and Mockito (services, controller and the AI fallback logic):
```bash
cd backend/core-service && mvn test
cd backend/ai-service && mvn test
```
Manual API testing: use Swagger UI, or a REST client (Postman or Thunder Client) against the gateway.

## Project Status
- [x] user-service: register, login, JWT, profile
- [x] core-service: facilities, doctors, referrals, appointments, notifications, ratings, admin stats
- [x] ai-service: Gemini recommendation with fallback
- [x] api-gateway: routing, CORS, logging
- [x] Docker files for all services
- [ ] Frontend connected to the backend APIs
- [ ] Docker Compose moved to the repository root and verified end to end

## Team

| Sakshi Bhuyar | Backend architecture, user-service, core-service, AI service, API gateway, Docker setup, database design, README |
| Kanishka Hirapure | 	Frontend UI (React pages, design) |
| Sakshi Kandalkar | 	Frontend UI (React pages, design) |

## Disclaimer
This project is built for educational purposes. It is not a medical device and does not provide
medical diagnosis.