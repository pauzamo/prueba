const express = require('express');
const { addCard, deleteCard, getCardByUserId } = require('../controller/checkout.controller');

const router = express.Router();

/**
 * @swagger
 * /api/checkout/cards:
 *   post:
 *     summary: Agregar nueva tarjeta
 *     tags: [Checkout]
 *     security:
 *       - CognitoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - numeroTarjeta
 *               - nombreTitular
 *               - fechaVencimiento
 *               - cvv
 *             properties:
 *               idUsuario:
 *                 type: number
 *                 example: 123
 *               numeroTarjeta:
 *                 type: string
 *                 example: "4532123456781234"
 *               nombreTitular:
 *                 type: string
 *                 example: Juan Pérez
 *               fechaVencimiento:
 *                 type: string
 *                 example: "12/25"
 *               cvv:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       201:
 *         description: Tarjeta agregada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', addCard);

/**
 * @swagger
 * /api/checkout/cards/{id}:
 *   delete:
 *     summary: Eliminar tarjeta
 *     tags: [Checkout]
 *     security:
 *       - CognitoAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de la tarjeta
 *       - in: query
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Tarjeta eliminada exitosamente
 *       404:
 *         description: Tarjeta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', deleteCard);

/**
 * @swagger
 * /api/checkout/cards/user/{idUsuario}:
 *   get:
 *     summary: Obtener tarjetas de un usuario
 *     tags: [Checkout]
 *     security:
 *       - CognitoAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de tarjetas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:idUsuario', getCardByUserId); 


module.exports = router;
