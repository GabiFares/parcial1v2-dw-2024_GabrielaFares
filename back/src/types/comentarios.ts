import { Static, Type } from "@sinclair/typebox";

export const IdCommentSchema = Type.Object({
  id_comentario: Type.Integer({
    description: "Identificador único del comentario",
  }),
});
export type IdCommentType = Static<typeof IdCommentSchema>;

export const CommentSchema = Type.Object(
  {
    id_tema: Type.Integer(),
    id_comentario: Type.Integer(),
    id_usuario: Type.Integer(),
    descripcion: Type.String({ description: "El texto del comentario" }),
  },
  { examples: [{ descripcion: "La descripcion de comentario de prueba 1" }] }
);
export type CommentType = Static<typeof CommentSchema>;

export const CommentPut = Type.Pick(CommentSchema, ["descripcion"]);
