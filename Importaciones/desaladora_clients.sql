-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: database
-- Tiempo de generación: 25-11-2024 a las 21:52:29
-- Versión del servidor: 8.0.33
-- Versión de PHP: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `devnet`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `desaladora_clients`
--

CREATE TABLE `desaladora_clients` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `importancia` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `group` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `clave` int NOT NULL,
  `status_prtg` varchar(50) DEFAULT NULL,
  `lastup_prtg` varchar(50) DEFAULT NULL,
  `lastdown_prtg` varchar(50) DEFAULT NULL,
  `device_ip_cisco` varchar(50) DEFAULT NULL,
  `device_cisco` varchar(100) DEFAULT NULL,
  `port_cisco` varchar(100) DEFAULT NULL,
  `status_cisco` varchar(50) DEFAULT NULL,
  `reachability_cisco` varchar(50) DEFAULT NULL,
  `id_prtg` varchar(50) DEFAULT NULL,
  `status_device_cisco` varchar(50) DEFAULT NULL,
  `data_backup` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `desaladora_clients`
--

INSERT INTO `desaladora_clients` (`id`, `name`, `description`, `ip`, `importancia`, `group`, `clave`, `status_prtg`, `lastup_prtg`, `lastdown_prtg`, `device_ip_cisco`, `device_cisco`, `port_cisco`, `status_cisco`, `reachability_cisco`, `id_prtg`, `status_device_cisco`, `data_backup`) VALUES
(1, 'CLCANDCPTD01', 'Dominio Primario', '10.224.204.6', 'ALTA', 'CSP', 101, 'Up', '25-11-2024 15:36:01 [6 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19571', 'Not Found', 'false'),
(2, 'CLCANDCPTD02', 'Dominio Secundario', '10.224.204.7', 'ALTA', 'CSP', 101, 'Up', '25-11-2024 15:36:02 [9 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19573', 'Not Found', 'false'),
(3, 'CLCANASPTDAS01', 'Aspecto Primario', '10.224.204.11', 'ALTA', 'CSP', 102, 'Up', '25-11-2024 15:35:52 [24 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19575', 'Not Found', 'false'),
(4, 'CLCANASPTDAS02', 'Aspecto Secundario', '10.224.204.12', 'ALTA', 'CSP', 102, 'Up', '25-11-2024 15:35:46 [34 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19577', 'Not Found', 'false'),
(5, 'CLCANASPTDCS01', 'Conectivity 1', '10.224.204.21', 'ALTA', 'CSP', 1, 'Up', '25-11-2024 15:35:46 [39 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19579', 'Not Found', 'false'),
(6, 'CLCANASPTDCS02', 'Conectivity 2', '10.224.204.22', 'ALTA', 'CSP', 1, 'Up', '25-11-2024 15:35:30 [59 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19581', 'Not Found', 'false'),
(7, 'CLCANASPTDIM01', 'Historico', '10.224.204.51', 'BAJA', 'CSP', 201, 'Up', '25-11-2024 15:35:52 [42 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19583', 'Not Found', 'false'),
(8, 'CLCANWKPTDOP01', 'WS desaladora', '10.224.204.81', 'BAJA', 'CSP', 202, 'Up', '25-11-2024 15:35:59 [39 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19585', 'Not Found', 'false'),
(9, 'CLCANWKPTDOP02', 'WS desaladora (Fallo)', '10.224.204.82', 'BAJA', 'CSP', 203, 'Paused  (paused by parent)', '-', '25-11-2024 15:30:45 [5 m 57 s ago]', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19587', 'Not Found', 'false'),
(10, 'CLCANWKPTDOP03', 'WS desaladora ', '10.224.204.83', 'BAJA', 'CSP', 204, 'Up', '25-11-2024 15:36:11 [36 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19589', 'Not Found', 'false'),
(11, 'CLCANWKPTDOP04', 'WS desaladora', '10.224.204.84', 'BAJA', 'CSP', 205, 'Up', '25-11-2024 15:36:00 [52 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19591', 'Not Found', 'false'),
(12, 'CLCANWKPTDOP05', 'WS Bodega', '10.224.204.85', 'BAJA', 'CSP', 206, 'Up', '25-11-2024 15:36:16 [40 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19593', 'Not Found', 'false'),
(13, 'CLCANWKPTDOP06', 'WS desaladora', '10.224.204.86', 'BAJA', 'CSP', 207, 'Up', '25-11-2024 15:36:21 [40 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19595', 'Not Found', 'false'),
(14, 'CLCANWKPTDOP07', 'WS Concentradora', '10.224.204.87', 'BAJA', 'CSP', 208, 'Up', '25-11-2024 15:36:35 [30 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19599', 'Not Found', 'false'),
(15, 'CLCANWKPTDOP08', 'Spare (WS Desaladora)', '10.224.204.88', 'BAJA', 'CSP', 209, 'Up', '25-11-2024 15:36:36 [34 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19601', 'Not Found', 'false'),
(16, 'CLCANVHPTD01', 'ESX primario', '10.224.204.121', 'ALTA', 'CSP', 106, 'Up', '25-11-2024 15:36:45 [29 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19603', 'Not Found', 'false'),
(17, 'CLCANVHPTD02', 'ESX secundario', '10.224.204.122', 'ALTA', 'CSP', 106, 'Up', '25-11-2024 15:36:54 [25 s ago]', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19605', 'Not Found', 'false'),
(18, 'CLCANDCPTD01', 'Dominio Primario', '10.225.204.6', 'ALTA', 'CSS', 101, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19644', 'Not Found', 'false'),
(19, 'CLCANDCPTD02', 'Dominio Secundario', '10.225.204.7', 'ALTA', 'CSS', 101, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19646', 'Not Found', 'false'),
(20, 'CLCANASPTDAS01', 'Aspecto Primario', '10.225.204.11', 'ALTA', 'CSS', 102, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19648', 'Not Found', 'false'),
(21, 'CLCANASPTDAS02', 'Aspecto Secundario', '10.225.204.12', 'ALTA', 'CSS', 102, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19650', 'Not Found', 'false'),
(22, 'CLCANASPTDCS01', 'Conectivity 1', '10.225.204.21', 'ALTA', 'CSS', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19652', 'Not Found', 'false'),
(23, 'CLCANASPTDCS02', 'Conectivity 2', '10.225.204.22', 'ALTA', 'CSS', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19654', 'Not Found', 'false'),
(24, 'CLCANASPTDIM01', 'Historico', '10.225.204.51', 'BAJA', 'CSS', 201, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19656', 'Not Found', 'false'),
(25, 'CLCANWKPTDOP01', 'WS desaladora', '10.225.204.81', 'BAJA', 'CSS', 202, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19658', 'Not Found', 'false'),
(26, 'CLCANWKPTDOP02', 'WS desaladora (Fallo)', '10.225.204.82', 'BAJA', 'CSS', 203, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19660', 'Not Found', 'false'),
(27, 'CLCANWKPTDOP03', 'WS desaladora ', '10.225.204.83', 'BAJA', 'CSS', 204, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19662', 'Not Found', 'false'),
(28, 'CLCANWKPTDOP04', 'WS desaladora', '10.225.204.84', 'BAJA', 'CSS', 205, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19664', 'Not Found', 'false'),
(29, 'CLCANWKPTDOP05', 'WS Bodega', '10.225.204.85', 'BAJA', 'CSS', 206, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19666', 'Not Found', 'false'),
(30, 'CLCANWKPTDOP06', 'WS desaladora', '10.225.204.86', 'BAJA', 'CSS', 207, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19668', 'Not Found', 'false'),
(31, 'CLCANWKPTDOP07', 'WS Concentradora', '10.225.204.87', 'BAJA', 'CSS', 208, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19670', 'Not Found', 'false'),
(32, 'CLCANWKPTDOP08', 'Spare (WS Desaladora)', '10.225.204.88', 'BAJA', 'CSS', 209, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19672', 'Not Found', 'false'),
(33, 'CLCANVHPTD01', 'ESX primario', '10.225.204.121', 'ALTA', 'CSS', 106, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19674', 'Not Found', 'false'),
(34, 'CLCANVHPTD02', 'ESX secundario', '10.225.204.122', 'ALTA', 'CSS', 106, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19676', 'Not Found', 'false'),
(35, 'CLCANASPTDCS01', 'Conectivity 1', '10.225.204.21', 'ALTA', 'CNP', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19652', 'Not Found', 'false'),
(36, 'CLCANASPTDCS01', 'Conectivity 1', '10.225.204.21', 'ALTA', 'CNS', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19652', 'Not Found', 'false'),
(37, 'CLCANASPTDCS01', 'Conectivity 1', '10.225.204.21', 'ALTA', 'HSE', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19652', 'Not Found', 'false'),
(38, 'CLCANASPTDCS02', 'Conectivity 2', '10.225.204.22', 'ALTA', 'CNP', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19654', 'Not Found', 'false'),
(39, 'CLCANASPTDCS02', 'Conectivity 2', '10.225.204.22', 'ALTA', 'CNS', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19654', 'Not Found', 'false'),
(40, 'CLCANASPTDCS02', 'Conectivity 2', '10.225.204.22', 'ALTA', 'HSE', 1, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19654', 'Not Found', 'false'),
(41, '_1000_PCS_001', 'Estacion_Bomba', '10.117.132.151', 'BAJA', 'CNP', 301, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19746', 'Not Found', 'false'),
(42, '_4000_PCS_001', 'Tuberia_impulsion', '10.117.132.152', 'BAJA', 'CNP', 302, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19611', 'Not Found', 'false'),
(43, '_950_PCS_001', 'Impulsion_Caldera', '10.117.132.153', 'BAJA', 'CNP', 303, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19613', 'Not Found', 'false'),
(44, '_952_PCS_001', 'Osmosis_Caldera', '10.117.132.154', 'BAJA', 'CNP', 304, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19615', 'Not Found', 'false'),
(45, '_952_PCS_002', 'Pretratamiento', '10.117.132.155', 'BAJA', 'CNP', 305, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19617', 'Not Found', 'false'),
(46, '_953_PCS_001', 'Captacion', '10.117.132.156', 'BAJA', 'CNP', 306, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19619', 'Not Found', 'false'),
(47, '_920_CO_001', 'A920_Stock_Pile', '10.117.132.161', 'BAJA', 'CNP', 307, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19621', 'Not Found', 'false'),
(48, '_930_CO_001', 'A930_Muelle', '10.117.132.162', 'BAJA', 'CNP', 308, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19623', 'Not Found', 'false'),
(49, '_1000_PCS_001', 'Estacion_Bomba', '10.118.132.151', 'BAJA', 'CNS', 301, 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'false'),
(50, '_4000_PCS_001', 'Tuberia_impulsion', '10.118.132.152', 'BAJA', 'CNS', 302, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19631', 'Not Found', 'false'),
(51, '_950_PCS_001', 'Impulsion_Caldera', '10.118.132.153', 'BAJA', 'CNS', 303, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19633', 'Not Found', 'false'),
(52, '_952_PCS_001', 'Osmosis_Caldera', '10.118.132.154', 'BAJA', 'CNS', 304, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19635', 'Not Found', 'false'),
(53, '_952_PCS_002', 'Pretratamiento', '10.118.132.155', 'BAJA', 'CNS', 305, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19748', 'Not Found', 'false'),
(54, '_953_PCS_001', 'Captacion', '10.118.132.156', 'BAJA', 'CNS', 306, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19637', 'Not Found', 'false'),
(55, '_920_CO_001', 'A920_Stock_Pile', '10.118.132.161', 'BAJA', 'CNS', 307, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19639', 'Not Found', 'false'),
(56, '_930_CO_001', 'A930_Muelle', '10.118.132.162', 'BAJA', 'CNS', 308, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19641', 'Not Found', 'false'),
(57, '_1000_PCS_001', 'Estacion_Bomba', '10.117.132.151', 'BAJA', 'CNPB', 301, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19746', 'Not Found', 'false'),
(58, '_4000_PCS_001', 'Tuberia_impulsion', '10.117.132.152', 'BAJA', 'CNPB', 302, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19611', 'Not Found', 'false'),
(59, '_950_PCS_001', 'Impulsion_Caldera', '10.117.132.153', 'BAJA', 'CNPB', 303, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19613', 'Not Found', 'false'),
(60, '_952_PCS_001', 'Osmosis_Caldera', '10.117.132.154', 'BAJA', 'CNPB', 304, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19615', 'Not Found', 'false'),
(61, '_952_PCS_002', 'Pretratamiento', '10.117.132.155', 'BAJA', 'CNPB', 305, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19617', 'Not Found', 'false'),
(62, '_953_PCS_001', 'Captacion', '10.117.132.156', 'BAJA', 'CNPB', 306, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19619', 'Not Found', 'false'),
(63, '_920_CO_001', 'A920_Stock_Pile', '10.117.132.161', 'BAJA', 'CNPB', 307, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19621', 'Not Found', 'false'),
(64, '_930_CO_001', 'A930_Muelle', '10.117.132.162', 'BAJA', 'CNPB', 308, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19623', 'Not Found', 'false'),
(65, '_1000_PCS_001', 'Estacion_Bomba', '10.118.132.151', 'BAJA', 'CNSB', 301, 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'false'),
(66, '_4000_PCS_001', 'Tuberia_impulsion', '10.118.132.152', 'BAJA', 'CNSB', 302, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19631', 'Not Found', 'false'),
(67, '_950_PCS_001', 'Impulsion_Caldera', '10.118.132.153', 'BAJA', 'CNSB', 303, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19633', 'Not Found', 'false'),
(68, '_952_PCS_001', 'Osmosis_Caldera', '10.118.132.154', 'BAJA', 'CNSB', 304, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19635', 'Not Found', 'false'),
(69, '_952_PCS_002', 'Pretratamiento', '10.118.132.155', 'BAJA', 'CNSB', 305, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19748', 'Not Found', 'false'),
(70, '_953_PCS_001', 'Captacion', '10.118.132.156', 'BAJA', 'CNSB', 306, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19637', 'Not Found', 'false'),
(71, '_920_CO_001', 'A920_Stock_Pile', '10.118.132.161', 'BAJA', 'CNSB', 307, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19639', 'Not Found', 'false'),
(72, '_930_CO_001', 'A930_Muelle', '10.118.132.162', 'BAJA', 'CNSB', 308, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19641', 'Not Found', 'false'),
(73, 'HSE_Carga', 'Linking device', '192.168.2.51', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19682', 'Not Found', 'false'),
(74, 'HSE_Carga', 'Linking device', '192.168.2.52', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19684', 'Not Found', 'false'),
(75, 'HSE_Bbas', 'Linking device', '192.168.2.53', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19686', 'Not Found', 'false'),
(76, 'HSE_Bbas', 'Linking device', '192.168.2.54', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19688', 'Not Found', 'false'),
(77, 'LD_Impuls_01', 'Linking device', '192.168.2.55', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19690', 'Not Found', 'false'),
(78, 'LD_Impuls_01', 'Linking device', '192.168.2.56', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19694', 'Not Found', 'false'),
(79, 'LD_Osmosis_01', 'Linking device', '192.168.2.57', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19696', 'Not Found', 'false'),
(80, 'LD_Osmosis_01', 'Linking device', '192.168.2.58', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19698', 'Not Found', 'false'),
(81, 'LD_Osmosis_02', 'Linking device', '192.168.2.59', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19700', 'Not Found', 'false'),
(82, 'LD_Osmosis_02', 'Linking device', '192.168.2.60', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19702', 'Not Found', 'false'),
(83, 'LD_Osmosis_03', 'Linking device', '192.168.2.61', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19704', 'Not Found', 'false'),
(84, 'LD_Osmosis_03', 'Linking device', '192.168.2.62', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19708', 'Not Found', 'false'),
(85, 'LD_Osmosis_04', 'Linking device', '192.168.2.63', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19706', 'Not Found', 'false'),
(86, 'LD_Osmosis_04', 'Linking device', '192.168.2.64', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19710', 'Not Found', 'false'),
(87, 'LD_Pretra_01', 'Linking device', '192.168.2.65', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19712', 'Not Found', 'false'),
(88, 'LD_Pretra_01', 'Linking device', '192.168.2.66', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19714', 'Not Found', 'false'),
(89, 'LD_Captac_01', 'Linking device', '192.168.2.67', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19718', 'Not Found', 'false'),
(90, 'LD_Captac_01', 'Linking device', '192.168.2.68', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19720', 'Not Found', 'false'),
(91, 'LD_Osmosis_05', 'Linking device', '192.168.2.73', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19722', 'Not Found', 'false'),
(92, 'LD_Pretra_02', 'Linking device', '192.168.2.75', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19724', 'Not Found', 'false'),
(93, 'HSE_HOST_Bbas', 'Host (tarjeta CI860)', '192.168.2.69', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19726', 'Not Found', 'false'),
(94, 'HSE_HOST_Carga', 'Host (tarjeta CI860)', '192.168.2.71', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19728', 'Not Found', 'false'),
(95, 'CI860_Impuls', 'Host (tarjeta CI860)', '192.168.2.155', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19730', 'Not Found', 'false'),
(96, 'CI860_Impuls', 'Host (tarjeta CI860)', '192.168.2.156', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19732', 'Not Found', 'false'),
(97, 'CI860_Osmosis', 'Host (tarjeta CI860)', '192.168.2.157', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19734', 'Not Found', 'false'),
(98, 'CI860_Osmosis', 'Host (tarjeta CI860)', '192.168.2.158', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19736', 'Not Found', 'false'),
(99, 'CI860_Pretra', 'Host (tarjeta CI860)', '192.168.2.159', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19738', 'Not Found', 'false'),
(100, 'CI860_Pretra', 'Host (tarjeta CI860)', '192.168.2.160', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19740', 'Not Found', 'false'),
(101, 'CI860_Captac', 'Host (tarjeta CI860)', '192.168.2.161', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19742', 'Not Found', 'false'),
(102, 'CI860_Captac', 'Host (tarjeta CI860)', '192.168.2.162', 'BAJA', 'HSE', 0, 'Paused  (paused by parent)', '-', '-', 'Not Found', 'Not Found', 'Not Found', 'Not Found', 'Not Found', '19744', 'Not Found', 'false');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `desaladora_clients`
--
ALTER TABLE `desaladora_clients`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `desaladora_clients`
--
ALTER TABLE `desaladora_clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
