-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 17 juil. 2018 à 19:02
-- Version du serveur :  5.7.19
-- Version de PHP :  5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `cryptoanalytics`
--

-- --------------------------------------------------------

--
-- Structure de la table `currency`
--

DROP TABLE IF EXISTS `currency`;
CREATE TABLE IF NOT EXISTS `currency` (
  `id_currency` varchar(45) NOT NULL,
  `name_currency` varchar(45) NOT NULL,
  PRIMARY KEY (`id_currency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `currency`
--

INSERT INTO `currency` (`id_currency`, `name_currency`) VALUES
('EUR', 'Euro'),
('USD', 'Dollar');

-- --------------------------------------------------------

--
-- Structure de la table `monnaie_crypto`
--

DROP TABLE IF EXISTS `monnaie_crypto`;
CREATE TABLE IF NOT EXISTS `monnaie_crypto` (
  `id_monnaie_crypto` varchar(255) NOT NULL,
  `nom_monnaie_crypto` varchar(255) NOT NULL,
  PRIMARY KEY (`id_monnaie_crypto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `monnaie_crypto`
--

INSERT INTO `monnaie_crypto` (`id_monnaie_crypto`, `nom_monnaie_crypto`) VALUES
('ADA', 'Cardano'),
('BCH', 'Bitcoin Cash'),
('BTC', 'Bitcoin'),
('BTM', 'Bytom'),
('DASH', 'DASH'),
('DGB', 'DigiByte'),
('EOS', 'EOS'),
('ETH', 'Ethereum'),
('HSR', 'Hshare'),
('ICX', 'ICON'),
('LTC', 'LiteCoin'),
('MCO', 'MCO'),
('NEO', 'NEO'),
('QKC', 'QuarkChain'),
('QTUM', 'Qtum'),
('TRX', 'TRON'),
('VEN', 'VeChain'),
('XLM', 'Stellar'),
('XMR', 'Monero'),
('XRP', 'XRP');

-- --------------------------------------------------------

--
-- Structure de la table `monnaie_crypto_user`
--

DROP TABLE IF EXISTS `monnaie_crypto_user`;
CREATE TABLE IF NOT EXISTS `monnaie_crypto_user` (
  `id_monnaie_crypto` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nom_user` varchar(255) NOT NULL,
  `prenom_user` varchar(255) NOT NULL,
  `mail_user` varchar(255) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user_currency`
--

DROP TABLE IF EXISTS `user_currency`;
CREATE TABLE IF NOT EXISTS `user_currency` (
  `id_user` int(11) NOT NULL,
  `id_currency` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
