-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 06-09-2019 a las 18:01:07
-- Versión del servidor: 5.7.27-0ubuntu0.18.04.1
-- Versión de PHP: 7.2.21-1+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mindrod`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSequence` (`name` VARCHAR(30), `start` INT, `inc` INT)  BEGIN
          CREATE TABLE IF NOT EXISTS _sequences
     (
         name VARCHAR(70) NOT NULL UNIQUE,
         next INT NOT NULL,
         inc INT NOT NULL
     );
 
          INSERT INTO _sequences VALUES (name, start, inc);  
  END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `nextVal` (`vname` VARCHAR(30)) RETURNS INT(11) BEGIN
          UPDATE _sequences
       SET next = (@next := next) + 1
       WHERE name = vname;
 
     RETURN @next;
  END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `attributes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`id`, `description`, `attributes`) VALUES
(1, 'administrator', 'invoice, work_order_number, dwg_number, description, client, machine, quantity, serial, receipt_date, commitment_date, observations'),
(2, 'metrology', 'rework, observations'),
(3, 'warehouse', 'indicator, machinist, status, due_date, observations'),
(4, 'admin', 'super');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `role_id`, `username`, `password`, `name`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 4, 'admin', '*4ACFE3202A5FF5CF467898FC58AAB1D615029441', 'Global Admin', '2019-08-28 21:31:25', 1, NULL, NULL),
(2, 1, 'marcela', '*23AE809DDACAF96AF0FD78ED04B6A265E05AA257', 'Marcela', '2019-08-28 21:31:40', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `work_order`
--

CREATE TABLE `work_order` (
  `id` int(11) NOT NULL,
  `invoice` varchar(50) DEFAULT NULL,
  `work_order_number` varchar(50) DEFAULT NULL,
  `folio` int(11) NOT NULL,
  `dwg_number` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `client` varchar(50) NOT NULL,
  `machine` varchar(50) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `serial` text NOT NULL,
  `receipt_date` date DEFAULT NULL,
  `commitment_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `rework` varchar(50) DEFAULT '',
  `indicator` varchar(50) DEFAULT '',
  `machinist` varchar(50) DEFAULT '',
  `status` int(11) DEFAULT '0',
  `observations` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(50) NOT NULL DEFAULT 'admin',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `work_order`
--

INSERT INTO `work_order` (`id`, `invoice`, `work_order_number`, `folio`, `dwg_number`, `description`, `client`, `machine`, `quantity`, `serial`, `receipt_date`, `commitment_date`, `due_date`, `rework`, `indicator`, `machinist`, `status`, `observations`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'REM.1971', 'NTJP-19-010400', 7828, 'BRAZO', 'FABRICACION DE BRAZO, ELABORADO EN MATERIAL DE ACERO AL CARBON Y BRONCE , SEGÚN MUESTRA.', 'AVON', 'SOLLAS', '2', 'MIN-5652', '2019-01-07', '2019-05-01', '2019-08-07', 'R', 'FT', 'JOSE CARMEN,RENE,MARCO', 100, 'PT NO ENTRA EN ALMACÉN,SE ENTREGA DIRECTO AL CLIENTE EL 6/4/19', '2019-08-07 22:25:35', 'admin', '2019-09-06 20:18:11', '2'),
(2, 'REM.0301', 'NTJP-19-0104', 7835, 'S12523J000641', 'FABRICACIÓN DE PIEZA, ELABORADA EN MATERIAL DE ACERO 1045, SEGÚN DIBUJO.', 'NACHI-TOKIWA', 'N/A', '40', 'MIN-8440-8443', '2019-01-07', '2018-08-07', '2018-08-07', 'R', 'AT', 'ALBERTO,ARTURO,JUAN JOSE', 99, '', '2019-08-28 21:20:29', 'admin', '2019-09-03 20:41:40', '2'),
(5, '1', '1', 14, '1', '2', '23', '3123', '23', '23123', '2019-09-03', '2019-09-03', NULL, 'R', 'FT', NULL, 100, 'dasdas', '2019-09-03 22:58:52', '2', '2019-09-05 22:16:42', NULL),
(6, '1', '1', 15, '1', '2', '23', '3123', '23', '23123', '2019-09-03', '2019-09-03', NULL, 'R', 'FT', NULL, 100, 'dasdas', '2019-09-03 22:59:07', '2', '2019-09-05 22:16:40', NULL),
(7, '34', '43', 16, 'fsd', 'sdfdsfsd', 'fsfsd', 'dsfdsf', '5', 'ddsdfs', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 100, '', '2019-09-04 00:36:48', '2', '2019-09-05 22:21:10', NULL),
(8, 'rafafa', 'saasdasd', 18, 'sadsad', 'asdasddas', 'asdasdsa', 'dasdasdasd', '3', 'sasadasd', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, 'afasdasdsa', '2019-09-04 00:38:25', '2', '2019-09-05 22:21:05', '2'),
(9, 'ygsd', 'sdgdfgdfg', 19, 'fdgdfgdffg', 'dfgdffgdfg', 'fgdfgdfh', 'fdhfdh', '4', 'fdgfgdfgdf', '2019-09-03', '2019-09-03', NULL, '', 'AT', '', 100, 'jfjjtyjrt', '2019-09-04 00:49:41', '2', '2019-09-06 20:21:51', NULL),
(10, 'sfdfsd', 'sdgdfgdfg', 20, 'fdgdfgdffg', 'dfgdffgdfgdsfsd', 'fgdfgdfh', 'fdhfdh', '44', 'fdgfgdfgdf', '2019-09-03', '2019-09-03', NULL, '', 'ET', '', 100, 'jfjjtyjrt', '2019-09-04 00:50:10', '2', '2019-09-06 20:22:01', NULL),
(11, 'dgdfg', 'gdfgdff', 21, 'dfgdfgfd', 'gfdgdfgdf', 'gdfgdfgdf', 'dgdfgdfg', '5', 'dsfdsfsdf', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, 'svdvdsfsdd', '2019-09-04 00:50:39', '2', '2019-09-05 22:22:11', NULL),
(12, 'asfag', 'sagasga', 22, 'gasgash', 'hhasgsfasf', 'fsfassaf', 'asfsafas', '4', 'sfasfasf', '2019-09-03', '2019-09-03', NULL, '', 'ET', '', 50, '', '2019-09-04 00:52:55', '2', '2019-09-06 20:18:27', NULL),
(13, 'sadas', 'sadsa', 23, 'dasda', 'asd', 'asdsad', 'asdasd', '2', 'dasdasd', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, '', '2019-09-04 00:57:33', '2', '2019-09-05 22:22:11', NULL),
(14, 'sfsfs', 'sdfsfs', 24, 'fsdfsdf', 'sdfsdfsdf', 'fsdfds', 'sdfsdf', '3', 'fsdf33', '2019-09-03', '2019-09-03', NULL, 'R', 'ET', '', 0, '', '2019-09-04 00:58:05', '2', '2019-09-06 20:18:24', NULL),
(15, 'af', 'safas', 25, 'fa', 'asfasgasg', 'gasfsa', 'saasfs', '2', 'ads', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, '', '2019-09-04 01:01:11', '2', '2019-09-05 22:22:11', NULL),
(16, 'gsdgsd', 'gsdgsdg', 26, 'ssdgdsg', 'dsgsdgds', 'gdsgsdgd', 'gsdgdsg', '2', 'sfsafasf', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, '', '2019-09-04 01:02:50', '2', '2019-09-05 22:22:11', NULL),
(17, 'dghdfh', 'dfhdfhdfh', 27, 'dfhdfhdfh', 'jdhsdhjgffghfg', 'hjghfjfg', 'gjfgjfjf', '4', 'dfgdfgfdg', '2019-09-03', '2019-09-03', NULL, '', 'FT', '', 0, '', '2019-09-04 01:04:09', '2', '2019-09-05 22:22:11', NULL),
(18, 'sdfdsg', 'sdgdsgdsgs', 28, 'dgdsgsdgds', 'sdgdsgds', 'gsddgsdgsdg', 'dsgdsgdsg', '4', 'dfsdfdsf', '2019-09-03', '2019-09-03', NULL, '', 'ET', '', 100, '', '2019-09-04 01:06:44', '2', '2019-09-06 20:22:07', NULL),
(19, 'sfasf', 'gasgas', 29, 'sgsag', 'asgasg', 'agasgasg', 'agasg', '2', 'gasgsag', '2019-09-03', '2019-08-01', NULL, '', 'ET', '', 0, '', '2019-09-04 01:08:30', '2', '2019-09-06 20:18:42', NULL),
(20, 'sfasf', 'gasgas', 30, 'sgsag', 'asgasg', 'agasgasg', 'agasg', '2', 'gasgsag', '2019-09-03', '2019-08-01', NULL, '', 'ET', '', 0, 'Test', '2019-09-04 01:11:37', '2', '2019-09-06 20:18:40', '2'),
(21, 'dfhfdhdf', 'hfdhfdh', 31, 'dfhfdh', 'dhfdd', 'fdhdfh', 'fdhhfh', '4', 'h4hr', '2019-09-03', '2019-09-03', NULL, '', 'ET', '', 0, '', '2019-09-04 01:18:30', '2', '2019-09-06 20:19:28', NULL),
(22, 'dgdsg', 'sdgsdgsd', 32, 'dsgsdgsd', 'gdsgsdg', 'e', '4', '4', 'sdfdsfsd', '2019-09-03', '2019-09-03', NULL, '', 'ET', '', 0, '', '2019-09-04 01:20:17', '2', '2019-09-06 20:19:34', NULL),
(23, 'safafas', 'asfsaf', 33, 'asgf', 'adssad', '4sd', 'fsfdsf', '34', 'fsdfdsfsdf', '2019-09-03', '2019-09-03', NULL, 'R', 'ET', '', 0, '', '2019-09-04 01:22:00', '2', '2019-09-06 20:19:58', NULL),
(24, '', '', 34, 'asdas', 'dadas', 'asdasd', 'asdasdasd', '5', 'dsfdsfdsfds', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 17:25:24', '2', '2019-09-06 20:19:33', NULL),
(25, '56765', '6', 35, '6767', '657657', '76576', '676767', '6', 'yjutyuty', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 17:26:41', '2', '2019-09-06 20:20:00', NULL),
(26, '56765', '6', 36, '6767', '657657', '76576', '676767', '6', 'yjutyuty', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 17:27:08', '2', '2019-09-06 20:18:38', NULL),
(27, '64565', '546546', 37, '5465', '65', 'fghgf', '656', '5', '6fgh', '2019-09-04', '2019-09-04', NULL, '', 'AT', '', 0, '', '2019-09-04 17:30:03', '2', '2019-09-06 20:20:04', NULL),
(28, 'ytyyrtyt', 'try', 38, 'trytr', 'ytyty', 'tytyt', '5', '6', 'drgffgdfgf', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 17:30:51', '2', '2019-09-06 20:20:10', NULL),
(29, '7', 'yyrytr', 39, 'tytrytry', 'yrtyyrtyt', '5', 'ytytyty', '6', 'tyrtyt', '2019-09-04', '2019-09-04', NULL, '', 'AT', '', 0, '', '2019-09-04 17:31:52', '2', '2019-09-06 20:20:12', NULL),
(30, '5654654', 'thrty', 40, 'rtyrty', 'ryrtyrty', '56ytyt', 'ty55', '6', 'rtyrtyrtyrt', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 17:52:28', '2', '2019-09-06 20:20:14', NULL),
(31, '4534', 'rtretr', 41, 'rtertret', 'rtrtr', 'trtr4', 'retrt', '5', 'trtr', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, 'ghjhjgfjf', '2019-09-04 18:56:32', '2', '2019-09-06 20:20:16', NULL),
(32, '67868', 'yrty', 42, 'tytyt', 'yturtut', 'rturtu', 'rturtutut', '7', 'rtyrtyrty', '2019-09-04', '2019-09-04', NULL, '', 'FT', '', 0, 'ttytytyt', '2019-09-04 18:58:00', '2', '2019-09-06 20:20:18', NULL),
(33, 'eretre', '76', 43, 'yjyjty', '767', 'yuyu', '6767', '8', 'uyutyuyt', '2019-09-04', '2019-09-04', NULL, '', 'AT', '', 0, '', '2019-09-04 18:58:41', '2', '2019-09-06 20:20:20', NULL),
(34, 'turturtu', 'rturtu', 44, 'tryrty', 'tyrtyrty', 'tytyty', 'ty5656', '5', 'tyrtytytyty', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 19:05:21', '2', '2019-09-06 20:20:23', NULL),
(35, '67', 'fggfh', 45, 'fghgfh', 'ghghgh', 'ghghgh', 'ghghg', '5', 'tyrtyrt', '2019-09-04', '2019-09-04', NULL, '', 'ET', '', 0, '', '2019-09-04 19:06:54', '2', '2019-09-06 20:20:25', NULL),
(36, 'E T-10323116-0200-1000', '26006221', 47, 'T-10323116-0200-0006', 'FABRICACION DE DRUM,ELABORADO EN MATERIAL DE ACERO 8620, SEGÚN DIBUJO.', 'SCHAEFFLER', 'N.A', '1', 'MIN-8747', '2019-09-05', '2019-09-05', NULL, '', 'ET', '', 0, 'Test', '2019-09-05 22:26:27', '2', '2019-09-06 20:20:27', '2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_sequences`
--

CREATE TABLE `_sequences` (
  `name` varchar(70) NOT NULL,
  `next` int(11) NOT NULL,
  `inc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `_sequences`
--

INSERT INTO `_sequences` (`name`, `next`, `inc`) VALUES
('folio_id_seq', 48, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usrrole` (`role_id`),
  ADD KEY `usrcreate_user` (`created_by`),
  ADD KEY `usrupdate_user` (`updated_by`);

--
-- Indices de la tabla `work_order`
--
ALTER TABLE `work_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wkcreate_user` (`created_by`),
  ADD KEY `wkupdate_user` (`updated_by`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `work_order`
--
ALTER TABLE `work_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `usr_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `usrcreate_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `usrupdate_user` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
