--
-- PostgreSQL database dump
--

\restrict ZlG7kZiF9HCsohQIyeaTpI5bUBecHaXLqvkky5KN8mr1cfWFmmnyBPMOHKvVcbn

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type_enum AS ENUM (
    'INFO',
    'WARNING'
);


ALTER TYPE public.notification_type_enum OWNER TO postgres;

--
-- Name: report_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_status_enum AS ENUM (
    'DRAFT',
    'SUBMITTED'
);


ALTER TYPE public.report_status_enum OWNER TO postgres;

--
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'EMPLOYEE',
    'ADMIN',
    'Junior Software Engineer',
    'DEPT_HEAD'
);


ALTER TYPE public.role_enum OWNER TO postgres;

--
-- Name: task_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.task_status_enum AS ENUM (
    'COMPLETED',
    'IN_PROGRESS',
    'PENDING'
);


ALTER TYPE public.task_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    type public.notification_type_enum NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: report_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    weekly_report_id uuid NOT NULL,
    title text NOT NULL,
    status public.task_status_enum NOT NULL,
    time_spent character varying(50) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.report_tasks OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role public.role_enum NOT NULL,
    division character varying(150) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "position" character varying(150)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weekly_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_reports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    challenges text,
    achievements text,
    future_plans text,
    additional_notes text,
    status public.report_status_enum DEFAULT 'DRAFT'::public.report_status_enum,
    submitted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.weekly_reports OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, message, type, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: report_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_tasks (id, weekly_report_id, title, status, time_spent, notes, created_at) FROM stdin;
1e55c373-2db7-4ba2-8cac-549f5b2c0b4c	2af9bee5-58c8-4b33-9e3b-5f8d3a52124e	Odoo Custom Help Desk Module Development	COMPLETED	10 hr	Implemented ticket creation and workflow stages.	2026-01-20 15:08:02.36869
846beb1b-1245-4d53-aaf1-1ce6f25bdf77	b8a43dd0-9483-4857-a859-fd87b282dae6	Voluptatem Iste qui	COMPLETED	Consequatur fugiat t	Eius sint dolorem po	2026-01-20 16:20:48.473112
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, password_hash, role, division, is_active, created_at, updated_at, "position") FROM stdin;
f141a258-68b2-4bfe-9f2d-c3ee1859a67e	Yenework Fekadie	yeneworkf@altacomputec.com	$2b$10$I4x3nvdMF0P1.zFtkX593eve7rJS9jHS3Nk4gzsLup0ZVQjHOGdBy	Junior Software Engineer	Software Development	t	2026-01-20 14:53:38.027384	2026-01-20 14:53:38.027384	\N
eb34a3db-6c04-42e7-bc16-0f7a225a46d5	Kirubel Gebrehiwot	kirubelg@altacomputec.com	$2b$10$SkqjpcfpmAhj39IfL9tjWejxpu1nNNpM0e/YDmlGnLHx4NK5XgT06	DEPT_HEAD	Software, AI and Cybersecurity	t	2026-01-20 16:25:08.033867	2026-01-20 16:25:08.033867	\N
26f7ad7e-29fa-4384-9bfe-b89157b16208	Kiya Zewdu	kiyaz@altacomputec.com	$2b$10$G11CdwnGPtd/ptoEtidX1.r3.rcdl5FsNhdITk1tyxsBPrBw8CPNq	EMPLOYEE	Software 	t	2026-01-20 16:50:34.912422	2026-01-20 16:50:34.912422	\N
d3885fac-0b1c-415e-bf13-5ae38ba769b2	Abel Mulubirhan	abel@altacomputec.com	$2b$10$uaWv56dpLV8/SY7j3yJGGe/AaStl.UfjxF9udQ8OS33tZ86RDwZ02	EMPLOYEE	Software Development	t	2026-01-20 14:52:18.686262	2026-01-20 14:52:18.686262	\N
\.


--
-- Data for Name: weekly_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_reports (id, user_id, start_date, end_date, challenges, achievements, future_plans, additional_notes, status, submitted_at, created_at, updated_at) FROM stdin;
2af9bee5-58c8-4b33-9e3b-5f8d3a52124e	d3885fac-0b1c-415e-bf13-5ae38ba769b2	2025-01-12	2025-01-18	Balancing multiple advanced technical courses...	Successfully developed a custom Help Desk module in Odoo.	Finalize and optimize the HR Analytics custom module.	\N	SUBMITTED	2026-01-20 15:08:02.36869	2026-01-20 15:08:02.36869	2026-01-20 15:08:02.36869
b8a43dd0-9483-4857-a859-fd87b282dae6	d3885fac-0b1c-415e-bf13-5ae38ba769b2	2026-01-12	2026-01-17	Saepe voluptatem atq	Dolor ipsa velit mo	Ut repudiandae deser	\N	SUBMITTED	2026-01-20 16:20:48.473112	2026-01-20 16:20:48.473112	2026-01-20 16:20:48.473112
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: report_tasks report_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_tasks
    ADD CONSTRAINT report_tasks_pkey PRIMARY KEY (id);


--
-- Name: weekly_reports unique_user_week; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_reports
    ADD CONSTRAINT unique_user_week UNIQUE (user_id, start_date, end_date);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_reports weekly_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_reports
    ADD CONSTRAINT weekly_reports_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_reports_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reports_dates ON public.weekly_reports USING btree (start_date, end_date);


--
-- Name: idx_reports_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reports_user ON public.weekly_reports USING btree (user_id);


--
-- Name: idx_tasks_report; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_report ON public.report_tasks USING btree (weekly_report_id);


--
-- Name: audit_logs fk_audit_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: weekly_reports fk_report_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_reports
    ADD CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: report_tasks fk_task_report; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_tasks
    ADD CONSTRAINT fk_task_report FOREIGN KEY (weekly_report_id) REFERENCES public.weekly_reports(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZlG7kZiF9HCsohQIyeaTpI5bUBecHaXLqvkky5KN8mr1cfWFmmnyBPMOHKvVcbn

