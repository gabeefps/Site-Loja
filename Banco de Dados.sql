-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para discord_store
CREATE DATABASE IF NOT EXISTS `discord_store` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `discord_store`;

-- Copiando estrutura para tabela discord_store.activities
CREATE TABLE IF NOT EXISTS `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(40) NOT NULL DEFAULT 'info',
  `title` varchar(120) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.activities: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.bot_settings
CREATE TABLE IF NOT EXISTS `bot_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `bot_name` varchar(120) DEFAULT 'Store Bot',
  `guild_id` varchar(80) DEFAULT '',
  `log_channel_id` varchar(80) DEFAULT '',
  `orders_channel_id` varchar(80) DEFAULT '',
  `checkout_category_id` varchar(80) DEFAULT '',
  `staff_role_id` varchar(80) DEFAULT '',
  `approve_role_id` varchar(80) DEFAULT '',
  `pix_key` varchar(180) DEFAULT '',
  `pix_name` varchar(120) DEFAULT '',
  `pix_qr_code_url` text DEFAULT NULL,
  `payment_methods` varchar(255) DEFAULT 'PIX',
  `payment_instructions` text DEFAULT NULL,
  `embed_color` varchar(20) DEFAULT '#a70000',
  `auto_sync` tinyint(1) DEFAULT 1,
  `bot_enabled` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `join_log_channel_id` varchar(80) DEFAULT '',
  `leave_log_channel_id` varchar(80) DEFAULT '',
  `verification_channel_id` varchar(80) DEFAULT '',
  `verification_role_id` varchar(80) DEFAULT '',
  `verification_log_channel_id` varchar(80) DEFAULT '',
  `verification_title` varchar(180) DEFAULT 'Verificação',
  `verification_description` text DEFAULT NULL,
  `verification_success_message` varchar(255) DEFAULT 'Você foi verificado com sucesso!',
  `antilink_enabled` tinyint(1) DEFAULT 0,
  `antilink_blocked_links` text DEFAULT NULL,
  `antilink_allowed_roles` text DEFAULT NULL,
  `antilink_log_channel_id` varchar(80) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.bot_settings: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.custom_embeds
CREATE TABLE IF NOT EXISTS `custom_embeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(80) NOT NULL,
  `channel_name` varchar(150) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `embed_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`embed_json`)),
  `message_id` varchar(80) DEFAULT NULL,
  `sent_by` varchar(120) DEFAULT 'painel',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.custom_embeds: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `discord_tag` varchar(120) DEFAULT NULL,
  `discord_id` varchar(80) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.customers: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.finance_transactions
CREATE TABLE IF NOT EXISTS `finance_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('income','expense','fee','refund') NOT NULL DEFAULT 'expense',
  `title` varchar(140) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.finance_transactions: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('paid','pending','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(80) DEFAULT '',
  `checkout_channel_id` varchar(80) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `decision_reason` text DEFAULT NULL,
  `decided_by` varchar(80) DEFAULT '',
  `decided_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.orders: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.product_embeds
CREATE TABLE IF NOT EXISTS `product_embeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `channel_id` varchar(80) NOT NULL,
  `message_id` varchar(80) DEFAULT '',
  `title` varchar(160) DEFAULT '',
  `description` text DEFAULT NULL,
  `button_label` varchar(60) DEFAULT 'Comprar',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_embeds_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.product_embeds: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.product_roles
CREATE TABLE IF NOT EXISTS `product_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `role_id` varchar(80) NOT NULL,
  `role_name` varchar(120) DEFAULT '',
  `duration_days` int(11) NOT NULL DEFAULT 30,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_roles_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.product_roles: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `category` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT '',
  `badge` varchar(80) DEFAULT '',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.products: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.request_categories
CREATE TABLE IF NOT EXISTS `request_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(180) DEFAULT '',
  `emoji` varchar(30) DEFAULT '?',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.request_categories: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.request_panel_settings
CREATE TABLE IF NOT EXISTS `request_panel_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `panel_title` varchar(180) DEFAULT 'Central de Pedidos',
  `panel_description` text DEFAULT NULL,
  `panel_color` varchar(20) DEFAULT '#a70000',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `public_channel_id` varchar(80) DEFAULT '',
  `public_channel_name` varchar(120) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.request_panel_settings: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.request_panels
CREATE TABLE IF NOT EXISTS `request_panels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(80) NOT NULL,
  `channel_name` varchar(120) DEFAULT '',
  `message_id` varchar(80) DEFAULT '',
  `title` varchar(180) DEFAULT '',
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.request_panels: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.request_replies
CREATE TABLE IF NOT EXISTS `request_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `author` varchar(120) NOT NULL DEFAULT 'Admin',
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `request_replies_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `store_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.request_replies: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.role_grants
CREATE TABLE IF NOT EXISTS `role_grants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `discord_id` varchar(80) NOT NULL,
  `role_id` varchar(80) NOT NULL,
  `role_name` varchar(120) DEFAULT '',
  `granted_by` varchar(80) DEFAULT '',
  `granted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `removed_at` datetime DEFAULT NULL,
  `status` enum('active','removed','failed') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `role_grants_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_grants_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `role_grants_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.role_grants: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.site_notifications
CREATE TABLE IF NOT EXISTS `site_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(40) NOT NULL DEFAULT 'info',
  `title` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `discord_id` varchar(80) DEFAULT '',
  `channel_id` varchar(80) DEFAULT '',
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.site_notifications: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.store_requests
CREATE TABLE IF NOT EXISTS `store_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) DEFAULT NULL,
  `discord_id` varchar(60) DEFAULT '',
  `username` varchar(120) NOT NULL,
  `discord_tag` varchar(120) DEFAULT '',
  `initials` varchar(8) DEFAULT '',
  `category` varchar(80) NOT NULL DEFAULT 'Pedido',
  `title` varchar(180) NOT NULL,
  `message` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT 0,
  `origin` varchar(80) NOT NULL DEFAULT '#pedidos-loja',
  `status` enum('Novo','Em análise','Aceito','Recusado','Concluído') NOT NULL DEFAULT 'Novo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `upvotes` int(11) DEFAULT 0,
  `downvotes` int(11) DEFAULT 0,
  `public_channel_id` varchar(80) DEFAULT '',
  `public_message_id` varchar(80) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.store_requests: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.support_tickets
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(80) NOT NULL,
  `username` varchar(120) DEFAULT '',
  `user_tag` varchar(120) DEFAULT '',
  `category_id` int(11) DEFAULT NULL,
  `category_name` varchar(120) DEFAULT '',
  `subject` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `channel_id` varchar(80) DEFAULT '',
  `status` enum('open','answered','closed') DEFAULT 'open',
  `closed_by` varchar(80) DEFAULT '',
  `closed_reason` text DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `assigned_staff_id` varchar(80) DEFAULT '',
  `assigned_staff_name` varchar(120) DEFAULT '',
  `close_requested_by` varchar(80) DEFAULT '',
  `close_requested_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.support_tickets: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.ticket_categories
CREATE TABLE IF NOT EXISTS `ticket_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(180) DEFAULT '',
  `emoji` varchar(30) DEFAULT '?',
  `discord_category_id` varchar(80) DEFAULT '',
  `staff_role_id` varchar(80) DEFAULT '',
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.ticket_categories: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.ticket_extra_members
CREATE TABLE IF NOT EXISTS `ticket_extra_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `user_id` varchar(80) NOT NULL,
  `added_by` varchar(80) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ticket_member` (`ticket_id`,`user_id`),
  CONSTRAINT `ticket_extra_members_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.ticket_extra_members: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.ticket_messages
CREATE TABLE IF NOT EXISTS `ticket_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `author_id` varchar(80) DEFAULT '',
  `author_name` varchar(120) DEFAULT '',
  `author_type` enum('user','staff','bot','system') DEFAULT 'user',
  `message` text NOT NULL,
  `discord_message_id` varchar(80) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.ticket_messages: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.ticket_panels
CREATE TABLE IF NOT EXISTS `ticket_panels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(80) NOT NULL,
  `channel_name` varchar(120) DEFAULT '',
  `message_id` varchar(80) DEFAULT '',
  `title` varchar(180) DEFAULT '',
  `description` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.ticket_panels: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.ticket_settings
CREATE TABLE IF NOT EXISTS `ticket_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `panel_title` varchar(180) DEFAULT 'Central de Atendimento',
  `panel_description` text DEFAULT NULL,
  `panel_color` varchar(20) DEFAULT '#a70000',
  `staff_role_id` varchar(80) DEFAULT '',
  `log_channel_id` varchar(80) DEFAULT '',
  `close_on_resolve` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.ticket_settings: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela discord_store.verification_attempts
CREATE TABLE IF NOT EXISTS `verification_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(80) NOT NULL,
  `captcha_code` varchar(20) NOT NULL,
  `attempts` int(11) DEFAULT 0,
  `status` enum('pending','success','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela discord_store.verification_attempts: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
