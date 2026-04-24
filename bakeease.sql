-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2026 at 04:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bakeease`
--
CREATE DATABASE IF NOT EXISTS `bakeease` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bakeease`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT DELAYED IGNORE INTO `categories` (`category_id`, `name`, `icon_url`) VALUES
(1, 'Cakes', '🎂'),
(2, 'Cupcakes', '🧁'),
(3, 'Pastries', '🥐'),
(4, 'Bread', '🍞'),
(5, 'Custom', '✨');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT DELAYED IGNORE INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `rating`, `created_at`) VALUES
(1, 'test', 'testuser_new@example.com', '9999999999', 'Feedback & Suggestions', 'testing this', 5, '2026-04-24 00:51:25'),
(2, 'testuser', 'yes@somaiya.edu', '1234567890', 'Feedback & Suggestions', 'yes i like it', 5, '2026-04-24 01:41:18');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `code` varchar(30) NOT NULL,
  `discount_pct` decimal(5,2) DEFAULT NULL,
  `min_order_value` decimal(10,2) DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT DELAYED IGNORE INTO `coupons` (`coupon_id`, `code`, `discount_pct`, `min_order_value`, `valid_until`, `is_active`) VALUES
(1, 'BAKE20', 20.00, 500.00, '2026-12-31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `ingredient_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `quantity_kg` decimal(8,2) NOT NULL,
  `low_stock_threshold` decimal(8,2) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT DELAYED IGNORE INTO `inventory` (`ingredient_id`, `name`, `quantity_kg`, `low_stock_threshold`, `updated_at`) VALUES
(1, 'Flour', 50.00, 10.00, '2026-03-26 17:21:55'),
(2, 'Sugar', 30.00, 5.00, '2026-03-26 17:21:55'),
(3, 'Butter', 20.00, 3.00, '2026-03-26 17:21:55'),
(4, 'Cocoa Powder', 10.00, 2.00, '2026-03-26 17:21:55'),
(5, 'Eggs (units)', 200.00, 24.00, '2026-03-26 17:21:55'),
(6, 'Vanilla Extract', 5.00, 1.00, '2026-03-26 17:21:55');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','baking','out_for_delivery','completed','cancelled') NOT NULL DEFAULT 'pending',
  `delivery_type` enum('delivery','pickup') NOT NULL,
  `delivery_address` text DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT DELAYED IGNORE INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `delivery_type`, `delivery_address`, `scheduled_at`, `created_at`) VALUES
(1, 2, 2490.00, 'completed', 'delivery', 'Apt 4B, Emerald Residency, Bandra West', NULL, '2026-04-18 22:05:57'),
(2, 3, 840.00, 'baking', 'delivery', '12, Kapoor Villa, Juhu Tara Road', NULL, '2026-04-22 22:05:57'),
(3, 4, 1200.00, 'pending', 'pickup', NULL, NULL, '2026-04-23 20:05:57'),
(4, 5, 3400.00, 'completed', 'delivery', '7th Floor, Oberoi Gardens, Goregaon', NULL, '2026-04-20 22:05:57'),
(5, 2, 450.00, 'out_for_delivery', 'delivery', 'Apt 4B, Emerald Residency, Bandra West', NULL, '2026-04-23 16:05:57'),
(6, 3, 320.00, 'cancelled', 'delivery', '12, Kapoor Villa, Juhu Tara Road', NULL, '2026-04-19 22:05:57'),
(7, 4, 1580.00, 'pending', 'delivery', '202, Sunrise Apartments, Powai', NULL, '2026-04-23 21:35:57'),
(8, 5, 750.00, 'baking', 'pickup', NULL, NULL, '2026-04-23 19:05:57'),
(9, 11, 1250.00, 'pending', 'pickup', NULL, '2026-04-25 10:00:00', '2026-04-23 23:57:57'),
(10, 12, 1250.00, 'baking', 'delivery', '123 Bake Street, Cake City', '2026-04-25 10:00:00', '2026-04-24 00:13:58'),
(11, 13, 1100.00, 'out_for_delivery', 'pickup', NULL, '2026-04-25 10:00:00', '2026-04-24 01:39:49');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `customisation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customisation`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT DELAYED IGNORE INTO `order_items` (`item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `customisation`) VALUES
(1, 1, 1, 1, 1250.00, NULL),
(2, 1, 7, 2, 280.00, NULL),
(3, 1, 9, 2, 340.00, NULL),
(4, 2, 3, 1, 320.00, NULL),
(5, 2, 7, 2, 260.00, NULL),
(6, 3, 1, 1, 1200.00, NULL),
(7, 4, 10, 2, 950.00, NULL),
(8, 4, 1, 1, 1250.00, NULL),
(9, 4, 8, 1, 250.00, NULL),
(10, 5, 5, 3, 120.00, NULL),
(11, 5, 8, 1, 90.00, NULL),
(12, 6, 3, 1, 320.00, NULL),
(13, 7, 2, 1, 950.00, NULL),
(14, 7, 6, 2, 180.00, NULL),
(15, 7, 4, 1, 270.00, NULL),
(16, 8, 7, 3, 250.00, NULL),
(17, 9, 7, 1, 1250.00, NULL),
(18, 10, 7, 1, 1250.00, NULL),
(19, 11, 8, 1, 1100.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `method` enum('upi','cod') NOT NULL,
  `status` enum('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT DELAYED IGNORE INTO `payments` (`payment_id`, `order_id`, `method`, `status`, `transaction_id`, `paid_at`) VALUES
(1, 1, 'upi', 'success', NULL, '2026-04-18 22:05:57'),
(2, 2, 'cod', 'pending', NULL, NULL),
(3, 3, 'upi', 'pending', NULL, NULL),
(4, 4, '', 'success', NULL, '2026-04-20 22:05:57'),
(5, 5, 'cod', 'pending', NULL, NULL),
(6, 6, 'upi', 'refunded', NULL, '2026-04-19 22:05:57'),
(7, 7, '', 'pending', NULL, NULL),
(8, 8, 'cod', 'pending', NULL, NULL),
(9, 9, 'upi', 'pending', NULL, NULL),
(10, 10, 'upi', 'pending', NULL, NULL),
(11, 11, 'upi', 'success', NULL, '2026-04-24 01:42:23');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `stock_quantity` int(11) NOT NULL DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT DELAYED IGNORE INTO `products` (`product_id`, `category_id`, `name`, `description`, `base_price`, `image_url`, `is_available`, `created_at`, `stock_quantity`) VALUES
(1, 1, 'Classic Chocolate Cake', 'Rich dark chocolate with ganache frosting', 699.00, 'chocolate-truffle-cake.png', 1, '2026-03-26 17:21:55', 15),
(2, 1, 'Vanilla Dream Cake', 'Light vanilla sponge with buttercream', 599.00, 'classic-vanilla-bean-cake.png', 1, '2026-03-26 17:21:55', 22),
(3, 2, 'Red Velvet Cupcakes', 'Box of 6, cream cheese frosting', 349.00, 'red-velvet-cake.png', 1, '2026-03-26 17:21:55', 30),
(4, 3, 'Butter Croissant', 'Flaky, golden, freshly baked', 89.00, 'Croissants.png', 1, '2026-03-26 17:21:55', 50),
(5, 4, 'Multigrain Loaf', 'Healthy multigrain sandwich bread', 149.00, 'artisan-sourdough.png', 1, '2026-03-26 17:21:55', 25),
(6, 5, 'Custom Birthday Cake', 'Fully customisable — size, flavour, message', 999.00, 'custom-cake-preview.png', 1, '2026-03-26 17:21:55', 10),
(7, 1, 'Berry Vanilla Cloud', 'Light sponge with organic Madagascar vanilla and fresh seasonal berries.', 1250.00, 'berry-vanilla-cake.png', 1, '2026-04-23 16:52:19', 20),
(8, 1, 'Red Velvet Delight', 'Crimson layers of velvety sponge with luscious cream cheese frosting.', 1100.00, 'red-velvet-delight.png', 1, '2026-04-23 16:52:19', 20),
(9, 1, 'Hazelnut Praline Cake', 'Roasted hazelnut praline between layers of chocolate ganache sponge.', 949.00, 'hazelnut-praline-cake.png', 1, '2026-04-23 16:52:19', 20),
(10, 1, 'Blueberry Cheesecake', 'New York style cheesecake with blueberry compote topping.', 899.00, 'blueberry-cheesecake.png', 1, '2026-04-23 16:52:19', 8),
(11, 1, 'Seasonal Fruit Cake', 'Layered sponge cake adorned with the freshest seasonal fruits.', 749.00, 'seasonal-fruit-cake.png', 1, '2026-04-23 16:52:19', 20),
(12, 1, 'Luxury Belgian Chocolate', 'Triple-layered Belgian dark chocolate with raspberry ganache.', 1250.00, 'luxury-belgian-chocolate-cake.png', 1, '2026-04-23 16:52:19', 20),
(13, 1, 'Mango Mousse Cake', 'Alphonso mango mousse on a delicate vanilla sponge base.', 950.00, 'mango-mousse.png', 1, '2026-04-23 16:52:19', 20),
(14, 1, 'Butterscotch Gold', 'Crunchy butterscotch praline cake with caramel drizzle.', 780.00, 'butterscotch-gold.png', 1, '2026-04-23 16:52:19', 20),
(15, 3, 'Chocolate Glazed Donut', '70% dark Belgian chocolate glaze over light yeast-raised dough.', 180.00, 'chocolate-glazed-donut.png', 1, '2026-04-23 16:52:19', 20),
(16, 3, 'Chocolate Eclairs', 'Choux pastry filled with vanilla custard and chocolate glaze.', 150.00, 'chocolate-eclairs.png', 1, '2026-04-23 16:52:19', 20),
(17, 3, 'French Macarons Box', 'Assorted box of 12 Parisian macarons in seasonal flavours.', 950.00, 'Macarons.png', 1, '2026-04-23 16:52:19', 10),
(18, 3, 'Walnut Brownies', 'Dense fudgy brownies loaded with premium California walnuts.', 320.00, 'walnut-brownies.png', 1, '2026-04-23 16:52:19', 18),
(19, 2, 'Vanilla Dream Cupcakes', 'Box of 6 artisanal cupcakes with velvet buttercream.', 450.00, 'vanilla-cupcakes.png', 1, '2026-04-23 16:52:19', 20),
(20, 2, 'Assorted Cupcake Box', 'A curated selection of 6 artisanal cupcakes with velvet buttercream.', 850.00, 'assorted-cupcakes.png', 1, '2026-04-23 16:52:19', 20),
(21, 4, 'Artisan Sourdough Loaf', '48-hour fermented loaf with a thick caramelised crust and soft airy crumb.', 350.00, 'artisan-sourdough.png', 1, '2026-04-23 16:52:19', 2),
(22, 4, 'Artisan Loaves Selection', 'Assorted artisan bread loaves baked fresh daily.', 450.00, 'artisan-loaves.png', 1, '2026-04-23 16:52:19', 20),
(24, 2, 'testcake3', 'testing', 20.00, 'testcake3.svg', 1, '2026-04-24 01:43:00', 20);

-- --------------------------------------------------------

--
-- Table structure for table `remember_tokens`
--

DROP TABLE IF EXISTS `remember_tokens`;
CREATE TABLE `remember_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT DELAYED IGNORE INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `is_approved`, `created_at`) VALUES
(1, 2, 1, 5, 'The Chocolate Truffle Cake was absolutely divine! Moist, rich, and the ganache was perfection. Best cake in Mumbai, hands down.', 1, '2026-04-23 22:05:56'),
(2, 3, 1, 5, 'Ordered this for my wife\'s birthday and she was over the moon. The presentation was beautiful and the taste even better.', 1, '2026-04-23 22:05:56'),
(3, 4, 1, 4, 'Delicious cake with a great balance of sweetness. The truffle layers were incredibly smooth.', 1, '2026-04-23 22:05:56'),
(4, 2, 2, 5, 'The Blueberry Cheesecake is creamy, tangy, and absolutely addictive. I\'ve ordered it three times already!', 1, '2026-04-23 22:05:56'),
(5, 5, 2, 4, 'Very good cheesecake. The blueberry compote on top was fresh and not too sweet. Will order again.', 1, '2026-04-23 22:05:56'),
(6, 3, 3, 5, 'Best sourdough in the city. The crust is perfectly crispy and the inside is soft and airy. Worth every rupee.', 1, '2026-04-23 22:05:56'),
(7, 4, 3, 5, 'This artisan sourdough has ruined all other bread for me. The fermentation flavor is spot on!', 1, '2026-04-23 22:05:56'),
(8, 2, 4, 4, 'Great chocolate chip cookies ??? crispy edges, chewy center. Just like homemade but better.', 1, '2026-04-23 22:05:56'),
(9, 5, 5, 5, 'The Red Velvet Cupcakes were the star of our office party. Everyone asked where I got them from!', 1, '2026-04-23 22:05:56'),
(10, 3, 5, 4, 'Beautifully decorated cupcakes with a wonderful cream cheese frosting. Light and fluffy.', 1, '2026-04-23 22:05:56'),
(11, 4, 6, 5, 'The Lemon Zest Tart is refreshingly tangy with a buttery crust. A perfect summer treat.', 1, '2026-04-23 22:05:56'),
(12, 2, 7, 5, 'These croissants are flaky, buttery, and melt in your mouth. Rivals any French bakery I\'ve been to.', 1, '2026-04-23 22:05:56'),
(13, 5, 7, 4, 'Excellent croissants! Golden and perfectly laminated. The almond filling version is amazing too.', 1, '2026-04-23 22:05:56'),
(14, 3, 8, 5, 'Blueberry muffins are moist and bursting with real blueberries. My kids love these for breakfast.', 1, '2026-04-23 22:05:56'),
(15, 4, 9, 5, 'The Walnut Brownies are fudgy, rich, and loaded with walnuts. Perfect with a cup of chai!', 1, '2026-04-23 22:05:56'),
(16, 2, 10, 5, 'BakeEase macarons are gorgeous and taste incredible. The pistachio flavor is my favorite.', 1, '2026-04-23 22:05:56'),
(17, 5, 10, 4, 'Beautiful macarons with the perfect crispy shell and soft center. Great for gifting.', 1, '2026-04-23 22:05:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT DELAYED IGNORE INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Amit Kumar', 'admin@bakeease.in', '9876543210', '$2y$10$es1UcY9LNBbiFRVQ/4ef/uADGtPJ3PhcGEnmTvg57qMKRXpuRnxoW', 'admin', '2026-04-23 22:05:56'),
(2, 'Priya Sharma', 'priya@test.com', '9876543211', '$2y$10$cDV4XlFcCaJhay0ipEda8eKT0WseG8IMM88A7hX1uldzLReQcya0.', 'customer', '2026-04-23 22:05:56'),
(3, 'Rahul Kapoor', 'rahul@test.com', '9876543212', '$2y$10$cDV4XlFcCaJhay0ipEda8eKT0WseG8IMM88A7hX1uldzLReQcya0.', 'customer', '2026-04-23 22:05:56'),
(4, 'Ananya Mehra', 'ananya@test.com', '9876543213', '$2y$10$cDV4XlFcCaJhay0ipEda8eKT0WseG8IMM88A7hX1uldzLReQcya0.', 'customer', '2026-04-23 22:05:56'),
(5, 'Rohan Singh', 'rohan@test.com', '9876543214', '$2y$10$cDV4XlFcCaJhay0ipEda8eKT0WseG8IMM88A7hX1uldzLReQcya0.', 'customer', '2026-04-23 22:05:56'),
(6, 'Priya Sharma', 'priya@example.com', '9876543210', '$2y$10$Hpc7nvzm75lEp6gjLHRdB.wmYsfPU3po8.Ssm8Ww1XDoHvhmRZhwe', 'customer', '2026-04-23 22:29:23'),
(7, 'Rahul Kapoor', 'rahul@example.com', '9876543211', '$2y$10$Hpc7nvzm75lEp6gjLHRdB.wmYsfPU3po8.Ssm8Ww1XDoHvhmRZhwe', 'customer', '2026-04-23 22:29:23'),
(8, 'Ananya Mehra', 'ananya@example.com', '9876543212', '$2y$10$Hpc7nvzm75lEp6gjLHRdB.wmYsfPU3po8.Ssm8Ww1XDoHvhmRZhwe', 'customer', '2026-04-23 22:29:24'),
(9, 'Siddharth Verma', 'sid@example.com', '9876543213', '$2y$10$Hpc7nvzm75lEp6gjLHRdB.wmYsfPU3po8.Ssm8Ww1XDoHvhmRZhwe', 'customer', '2026-04-23 22:29:24'),
(10, 'Neha Gupta', 'neha@example.com', '9876543214', '$2y$10$Hpc7nvzm75lEp6gjLHRdB.wmYsfPU3po8.Ssm8Ww1XDoHvhmRZhwe', 'customer', '2026-04-23 22:29:24'),
(11, 'prathamesh test 123', 'prathamesh@test.com', '9999999999', '$2y$10$jd8AKKiakrC0hPkbzmAvBeoJl8RkwWEglLQm7Umd45h6j3MV.sOE2', 'customer', '2026-04-23 23:08:05'),
(12, 'akhil', 'akhil@test.com', '1111111111', '$2y$10$BqkMD3ilqfd0BKQW/W/vouo/YvYf.GSQrPkdJGbCsdMt.6235fPGG', 'admin', '2026-04-24 00:03:08'),
(13, 'testuser3', 'test@test.com', '1234567890', '$2y$10$4jSiYqMMlMRqyVemQFZfkOAAznD42Q.2l4pvL5uW2J/eMtBILjm1y', 'customer', '2026-04-24 01:38:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `uq_category_name` (`name`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `uq_coupon_code` (`code`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_order_user` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `fk_item_order` (`order_id`),
  ADD KEY `fk_item_product` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `uq_payment_order` (`order_id`),
  ADD UNIQUE KEY `uq_transaction_id` (`transaction_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Indexes for table `remember_tokens`
--
ALTER TABLE `remember_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `fk_review_user` (`user_id`),
  ADD KEY `fk_review_product` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uq_user_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `remember_tokens`
--
ALTER TABLE `remember_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE;

--
-- Constraints for table `remember_tokens`
--
ALTER TABLE `remember_tokens`
  ADD CONSTRAINT `remember_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
