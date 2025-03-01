import axios, { AxiosResponse } from "axios";
import { ProductoEntity } from "../entities/producto.entities";
import { personalizarMensajeError } from "../utils/funciones.utils";

export enum opcionSerie {
   PEDIDO = "PEDIDO",
   COMPRA = "COMPRA",
}
export class ProductoApi {
   async registrar(data: ProductoEntity): Promise<AxiosResponse> {
      try {
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };

         const body = JSON.stringify(data);

         return await axios.post(
            `${ProductoEntity.url}/registrar`,
            body,
            config
         );
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async actualizar(
      producto_id: number,
      data: ProductoEntity
   ): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               producto_id,
            },
            headers: {
               "Content-Type": "application/json",
            },
         };
         const body = JSON.stringify(data);

         return await axios.put(
            `${ProductoEntity.url}/actualizar`,
            body,
            config
         );
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async listarTodos(): Promise<AxiosResponse> {
      try {
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };

         return await axios.get(`${ProductoEntity.url}/todos`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async buscarPorID(producto_id: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               producto_id,
            },
         };
         return await axios.get(`${ProductoEntity.url}/uno`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }
   async eliminarUno(producto_id: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               producto_id,
            },
         };
         return await axios.delete(`${ProductoEntity.url}/eliminar`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }
   async obtenerSeries(
      detalle_id: number,
      usuario_id: number
   ): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               detalle_id,
               usuario_id,
            },
            headers: {
               "Content-Type": "application/json",
            },
         };
         return await axios.get(`${ProductoEntity.url}/series`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }
}
