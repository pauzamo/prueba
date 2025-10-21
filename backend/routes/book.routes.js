const express = require('express');
const router = express.Router();
const { getBooks } = require('../controller/book.controller');

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Obtener lista de libros
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *         example: harry potter
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Error al obtener libros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getBooks);

module.exports = router;
