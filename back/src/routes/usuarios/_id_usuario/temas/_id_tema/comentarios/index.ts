import { FastifyPluginAsync } from "fastify";
import { Type } from "@sinclair/typebox";
import { CommentSchema } from "../../../../../../types/comentarios.js";
import * as commentService from "../../../../../../services/comentarios.js";

const comentariosTemasRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      tags: ["temas"],
      summary: "Obtener comentarios de un tema",
      description: "### Implementar y validar: \n " + " - token \n ",
      response: {
        200: {
          description: "Comentario encontrado. ",
          content: {
            "application/json": {
              schema: Type.Array(CommentSchema),
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT],
    handler: async function (request, reply) {
      const { id_tema } = request.params as { id_tema: number };
      const comments = commentService.findAll(id_tema);
      console.log(comments);
      return comments;
    },
  });
};

export default comentariosTemasRoutes;
