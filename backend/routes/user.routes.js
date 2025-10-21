const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail, updateUser } = require('../controller/user.controller');

router.post('/', createUser);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Obtener usuario por email
 *     tags: [Users]
 *     security:
 *       - CognitoAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario
 *         example: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:email', getUserByEmail);

/**
 * @swagger
 * /api/users/{email}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - CognitoAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez Actualizado
 *               telefono:
 *                 type: string
 *                 example: "+5491123456789"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:email', updateUser);

module.exports = router;
