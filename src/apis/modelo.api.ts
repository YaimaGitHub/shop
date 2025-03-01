import axios, { AxiosResponse } from "axios";
import { ModeloEntity } from "../entities/modelo.entity";
import { personalizarMensajeError } from "../utils/funciones.utils";

export class ModeloApi {
   async registrar(data: ModeloEntity): Promise<AxiosResponse> {
      try {
         const config = {
            headers: {
               "Content-Type": "application/json",
            },
         };

         const body = JSON.stringify(data);

         return await axios.post(`${ModeloEntity.url}/registrar`, body, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async actualizar(
      modelo_id: number,
      data: ModeloEntity
   ): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               modelo_id,
            },
            headers: {
               "Content-Type": "application/json",
            },
         };
         const body = JSON.stringify(data);

         return await axios.put(`${ModeloEntity.url}/actualizar`, body, config);
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

         return await axios.get(`${ModeloEntity.url}/todos`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async historial(modelo_id: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               modelo_id,
            },
            headers: {
               "Content-Type": "application/json",
            },
         };

         return await axios.get(`${ModeloEntity.url}/historial`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async buscarPorId(modelo_id: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               modelo_id,
            },
         };
         return await axios.get(`${ModeloEntity.url}/uno`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async eliminarUno(ID: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               modelo_id: ID,
            },
         };
         return await axios.delete(`${ModeloEntity.url}/eliminar`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async listarModelosPorFiltro(
      categoria_id: number,
      nombre_modelo: string
   ): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               categoria_id,
               nombre_modelo,
            },
         };
         return await axios.get(`${ModeloEntity.url}/listar_filtro`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }

   async listarModeloDescripcion(modelo_id: number): Promise<AxiosResponse> {
      try {
         const config = {
            params: {
               modelo_id,
            },
         };
         return await axios.get(`${ModeloEntity.url}/descripcion`, config);
      } catch (error: any) {
         error.message = personalizarMensajeError(error);
         return Promise.reject(error);
      }
   }
}
