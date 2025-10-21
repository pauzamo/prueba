const express = require('express');
const { chatWithAI } = require('../controller/aiGemini.controllers');
const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat con IA (Gemini)
 *     tags: [AI Chat]
 *     security:
 *       - CognitoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       200:
 *         description: Respuesta de la IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   type: string
 *                   example: "Te recomiendo '1984' de George Orwell..."
 *       400:
 *         description: Mensaje vacío o inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/chat', chatWithAI);

module.exports = router;