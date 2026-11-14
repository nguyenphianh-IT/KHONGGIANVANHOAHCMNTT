-- ==============================================================================
-- 001_extensions_and_enums.sql
-- MỤC ĐÍCH: Kích hoạt extension, định nghĩa types và khóa quyền tạo bảng tùy tiện
-- DỰ ÁN: KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - TRƯỜNG THCS NGUYỄN TRUNG TRỰC
-- ==============================================================================

-- 1. Kích hoạt Extension sinh khóa UUID và hàm băm mật mã
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Thiết lập đường dẫn tìm kiếm an toàn
SET search_path = public, pg_catalog;

-- 3. Khóa quyền tạo đối tượng tùy tiện trong schema public từ PUBLIC
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO postgres, service_role;
