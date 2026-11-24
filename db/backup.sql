--
-- PostgreSQL database dump
--

\restrict mphZ85vrvWBJUhPnSAEm9GU6s72s6gagoxMZOHbGvu2sFXm7VS07FIOGIbzcGSH

-- Dumped from database version 17.12
-- Dumped by pg_dump version 17.12

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: parcial
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_name character varying NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO parcial;

--
-- Name: users; Type: TABLE; Schema: public; Owner: parcial
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    phone character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO parcial;

--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: parcial
--

CREATE TABLE public.users_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.users_roles OWNER TO parcial;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: parcial
--

COPY public.roles (id, role_name, description, created_at) FROM stdin;
11111111-1111-1111-1111-111111111111	admin	Administrador del sistema	2026-11-24 19:45:32.278181
22222222-2222-2222-2222-222222222222	supervisor	Supervisa y consulta usuarios	2026-11-24 19:45:32.278181
33333333-3333-3333-3333-333333333333	user	\N	2026-11-24 19:45:32.278181
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: parcial
--

COPY public.users (id, email, password, name, phone, is_active, created_at) FROM stdin;
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	admin@parcial.com	$scrypt$ln=17,r=8,p=1$EZh+0eux2CjBcGm0wNSkhA$W+UqHzNGTdNHvgCCZBwIWdHYLeSbFQbN7+i5jxuJLPI	Admin	3001112233	t	2026-11-24 19:45:32.278181
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	supervisor@parcial.com	$scrypt$ln=17,r=8,p=1$DdjIJ+iRQpMB8A5pCJImbg$vL3J02Gw3uftBdVf0En+wX0eu7gAaMt1bTVKBTlGQ5Y	Sara Supervisora	\N	t	2026-11-24 19:45:32.278181
cccccccc-cccc-cccc-cccc-cccccccccccc	user@parcial.com	$scrypt$ln=17,r=8,p=1$FygqKCTvjTHdcCBqknePJQ$ejldYE4bDKMmC87WSWSnYbMZ1gfmgB3toUCVg3+2/Co	Ulises Usuario	3004445566	t	2026-11-24 19:45:32.278181
dddddddd-dddd-dddd-dddd-dddddddddddd	inactivo@parcial.com	$scrypt$ln=17,r=8,p=1$ZxgGMuQaxel9NUFfK5uUsw$WclBn/f6dmJGu+1kxLnyZVYG1Wwuv3gbbROglQGzk7o	Ines Inactiva	\N	f	2026-11-24 19:45:32.278181
\.


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: parcial
--

COPY public.users_roles (user_id, role_id) FROM stdin;
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	11111111-1111-1111-1111-111111111111
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	22222222-2222-2222-2222-222222222222
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	33333333-3333-3333-3333-333333333333
cccccccc-cccc-cccc-cccc-cccccccccccc	33333333-3333-3333-3333-333333333333
\.


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- Name: users_roles PK_c525e9373d63035b9919e578a9c; Type: CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY (user_id, role_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: roles UQ_ac35f51a0f17e3e1fe121126039; Type: CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE (role_name);


--
-- Name: IDX_1cf664021f00b9cc1ff95e17de; Type: INDEX; Schema: public; Owner: parcial
--

CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON public.users_roles USING btree (role_id);


--
-- Name: IDX_e4435209df12bc1f001e536017; Type: INDEX; Schema: public; Owner: parcial
--

CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON public.users_roles USING btree (user_id);


--
-- Name: users_roles FK_1cf664021f00b9cc1ff95e17de4; Type: FK CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_roles FK_e4435209df12bc1f001e5360174; Type: FK CONSTRAINT; Schema: public; Owner: parcial
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict mphZ85vrvWBJUhPnSAEm9GU6s72s6gagoxMZOHbGvu2sFXm7VS07FIOGIbzcGSH

