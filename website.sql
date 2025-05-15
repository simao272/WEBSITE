-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 13-Maio-2025 às 15:32
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `website`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `comments`
--

INSERT INTO `comments` (`id`, `game_id`, `user_id`, `comment`, `created_at`) VALUES
(3, 2, 16, 'ola', '2025-05-13 11:27:30'),
(4, 2, 2, 'boas', '2025-05-13 11:27:46');

-- --------------------------------------------------------

--
-- Estrutura da tabela `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `img_url` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `games`
--

INSERT INTO `games` (`id`, `name`, `img_url`, `description`) VALUES
(2, 'Apex Legends', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt_wwrwt_guon3k-m6ztGPgWhXPykBamccbA&s', 'Jogo muito bom!'),
(3, 'For Honer', 'data:image/jpeg;base64,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', 'É um jogo!'),
(7, 'Tralalero Tralala', 'https://animalpolitico.com/_next/image?url=https%3A%2F%2Fap-cdn.sfo3.cdn.digitaloceanspaces.com%2Fuploads%2F2025%2F04%2Fmemes-virales.jpg&w=3840&q=75', 'A');

-- --------------------------------------------------------

--
-- Estrutura da tabela `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `game_id`, `rating`, `comment`, `created_at`) VALUES
(2, 1, 3, 4, NULL, '2025-05-13 11:25:23'),
(3, 2, 3, 2, NULL, '2025-05-13 11:26:14'),
(4, 16, 3, 3, NULL, '2025-05-13 11:27:02'),
(5, 16, 2, 3, NULL, '2025-05-13 11:27:10'),
(6, 2, 2, 4, NULL, '2025-05-13 11:27:52'),
(7, 16, 7, 5, 'Tung Tung Tung Tung Tung Tung Tung Sahur', '2025-05-13 11:45:15');

-- --------------------------------------------------------

--
-- Estrutura da tabela `suggestions`
--

CREATE TABLE `suggestions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `img_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `suggestions`
--

INSERT INTO `suggestions` (`id`, `user_id`, `name`, `img_url`, `description`, `created_at`) VALUES
(8, 2, 'scavc', 'cdcdsv', 'vdsvdv', '2025-05-13 12:08:55');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'simao272', '1234', 'admin'),
(2, 'user', '1234', 'user'),
(16, 'rui', '1234', 'admin');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices para tabela `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Índices para tabela `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `suggestions`
--
ALTER TABLE `suggestions`
  ADD CONSTRAINT `suggestions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
