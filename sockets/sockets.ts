import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';

export const usuariosConectados: UsuariosLista = new UsuariosLista();

export const desconectar = (cliente: Socket) => {
  cliente.on('disconnect', () => {
    usuariosConectados.borrarUsuario(cliente.id);
    console.log('Cliente desconectado');
  });
};

// Conectar cliente

export const conectarCliente = (cliente: Socket) => {
  const usuario = {
    id: cliente.id,
  };
  usuariosConectados.agregar(usuario);
};

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on('mensaje', (payload: object) => {
    console.log('Mensaje recibido: ', payload);
    io.emit('mensaje-nuevo', payload);
  });
};

// Configurar usuario
export const usuario = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(
    'configurar-usuario',
    (payload: { nombre: string }, callback: Function) => {
      usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
      callback({
        ok: true,
        mensaje: `Usuario ${payload.nombre} configurado correctamente`,
      });
    }
  );
};
