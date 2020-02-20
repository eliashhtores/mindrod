-- Adds column for pdf links
ALTER TABLE `work_order` ADD `pdf` TEXT NULL AFTER `observations`;

-- Adds table to get/set latest serial
CREATE TABLE `serial` (
  `id` int(11) NOT NULL,
  `latest_serial` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `serial`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `serial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Check if file_uploads setting in php.ini is set to On

-- Add uploads dir and add 777 mode

-- ErrorDocument 404 /mindrod/404.html on httpd.conf of htaccess file