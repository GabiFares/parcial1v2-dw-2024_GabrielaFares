import { FastifyPluginAsync } from "fastify";
import { IdUsuarioSchema } from "../../../../../../../types/usuario.js";
import * as commentService from "../../../../../../../services/comentarios.js";
import { Type } from "@sinclair/typebox";
import {
  CommentPut,
  CommentSchema,
  CommentType,
  IdCommentSchema,
} from "../../../../../../../types/comentarios.js";
import { IdTema } from "../../../../../../../types/tema.js";

const usuariosRoutes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // El put para modificar un comentario
  fastify.put("/", {
    schema: {
      tags: ["usuarios"],
      summary: "Modificar comentario del tema.",
      params: Type.Intersect([IdUsuarioSchema, IdTema, IdCommentSchema]),
      body: CommentPut,
      response: {
        201: {
          description: "Comentario modificado.",
          content: {
            "application/json": {
              schema: CommentSchema,
            },
          },
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const comentario = request.body as CommentType;
      const idTema = comentario.id_tema;
      const idComentario = comentario.id_comentario;
      const descripcion = comentario.descripcion;
      return commentService.modify(idTema, idComentario, descripcion);
    },
  });

  // El delete para borrar un comentario
  fastify.delete("/", {
    schema: {
      tags: ["usuarios"],
      summary: "Eliminar comentario de la tarea.",
      params: Type.Intersect([IdTema, IdCommentSchema]),
      response: {
        204: {
          description: "Comentario eliminado.",
        },
      },
    },
    onRequest: [fastify.verifyJWT, fastify.verifySelfOrAdmin],
    handler: async function (request, reply) {
      const { id_tema } = request.params as { id_tema: number };
      const { id_comentario } = request.params as { id_comentario: number };
      reply.code(204);
      return commentService.erase(id_tema, id_comentario);
    },
  });
};

export default usuariosRoutes;
