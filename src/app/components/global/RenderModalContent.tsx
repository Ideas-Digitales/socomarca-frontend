interface Props {
  content: string;
}

export default function RenderModalContent({ content }: Props) {
  switch (content) {
    case 'edit-user':
      return <p>Contenido del modal para editar usuario</p>;
    case 'delete-user':
      return <p>Contenido del modal para eliminar usuario</p>;
    default:
      return <p>Contenido del modal personalizado</p>;
  }
}
